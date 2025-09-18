import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, characterId, conversationId } = await req.json();
    console.log('Received chat request:', { message, characterId, conversationId });

    // Enhanced input validation
    if (!message || typeof message !== 'string' || !characterId) {
      throw new Error('Message and character ID are required');
    }

    // Validate message length and content
    if (message.length < 1 || message.length > 2000) {
      throw new Error('Message must be between 1 and 2000 characters');
    }

    // Basic content filtering
    const sanitizedMessage = message.trim();
    if (!sanitizedMessage) {
      throw new Error('Message cannot be empty');
    }

    // Validate character ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(characterId)) {
      throw new Error('Invalid character ID format');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    // Extract user from token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid authentication');
    }

    // Get character details with security check
    const { data: character, error: characterError } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .maybeSingle();

    if (characterError || !character) {
      throw new Error('Character not found');
    }

    console.log('Found character:', character.name);

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .single();
      conversation = existingConv;
    }

    if (!conversation) {
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          character_id: characterId,
          title: `Chat with ${character.name}`,
        })
        .select()
        .single();

      if (convError) {
        throw new Error('Failed to create conversation');
      }
      conversation = newConv;
    }

    console.log('Using conversation:', conversation.id);

    // Save user message with sanitized content
    const { error: userMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        content: sanitizedMessage,
        is_user: true,
      });

    if (userMsgError) {
      throw new Error('Failed to save user message');
    }

    // Get recent conversation history
    const { data: recentMessages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(10);

    // Build conversation context
    const conversationHistory = recentMessages?.map(msg => ({
      role: msg.is_user ? 'user' : 'assistant',
      content: msg.content
    })) || [];

    // Create character prompt
    const systemPrompt = `You are ${character.name}, an AI character in a social platform. 
${character.description ? `Description: ${character.description}` : ''}
${character.personality ? `Personality: ${character.personality}` : ''}
${character.greeting_message ? `Your typical greeting: ${character.greeting_message}` : ''}

Respond as this character would, keeping your responses engaging, authentic to the character, and suitable for a social platform. Keep responses concise but meaningful (1-3 sentences usually).`;

    console.log('Calling Hugging Face with system prompt');

    // Build conversation context for Hugging Face
    const conversationContext = conversationHistory.slice(-6).map(msg => 
      `${msg.role === 'user' ? 'User' : character.name}: ${msg.content}`
    ).join('\n');

    const fullPrompt = `${systemPrompt}

Previous conversation:
${conversationContext}

User: ${sanitizedMessage}
${character.name}:`;

    // Call Hugging Face API
    const huggingFaceResponse = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.8,
          return_full_text: false,
          do_sample: true,
        },
      }),
    });

    if (!huggingFaceResponse.ok) {
      const errorData = await huggingFaceResponse.text();
      console.error('Hugging Face API error:', errorData);
      throw new Error('Failed to generate AI response');
    }

    const huggingFaceData = await huggingFaceResponse.json();
    let aiResponse = Array.isArray(huggingFaceData) ? huggingFaceData[0]?.generated_text : huggingFaceData.generated_text;
    
    // Clean up the response
    if (aiResponse) {
      aiResponse = aiResponse.trim();
      // Remove any remaining prompt text that might be included
      const characterPrefix = `${character.name}:`;
      if (aiResponse.startsWith(characterPrefix)) {
        aiResponse = aiResponse.substring(characterPrefix.length).trim();
      }
    } else {
      aiResponse = "I'm here to chat! How can I help you today?";
    }

    console.log('Generated AI response:', aiResponse);

    // Save AI response
    const { error: aiMsgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        content: aiResponse,
        is_user: false,
      });

    if (aiMsgError) {
      console.error('Failed to save AI message:', aiMsgError);
    }

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversation.id);

    return new Response(JSON.stringify({ 
      response: aiResponse,
      conversationId: conversation.id,
      character: {
        id: character.id,
        name: character.name,
        avatar_url: character.avatar_url
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});