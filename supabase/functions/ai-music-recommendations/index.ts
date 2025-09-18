import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { mood, genres, currentlyPlaying, preferences } = await req.json();

    console.log('Generating music recommendations for:', { mood, genres, currentlyPlaying, preferences });

    const prompt = `You are an expert music curator and AI DJ. Based on the following information, recommend 8-10 songs that would be perfect for the user:

Mood: ${mood || 'Any'}
Preferred Genres: ${genres?.join(', ') || 'Any'}
Currently Playing: ${currentlyPlaying || 'None'}
User Preferences: ${preferences || 'None'}

Please respond with a JSON array of song recommendations. Each recommendation should have:
- title: Song title
- artist: Artist name
- genre: Primary genre
- mood: Mood/vibe of the song
- description: Brief description of why this song fits
- duration: Duration in format "MM:SS"
- spotifyId: Fake Spotify ID (generate a realistic looking one)

Make the recommendations diverse but cohesive. Focus on both popular and hidden gems. Consider the user's current mood and musical journey.

Example format:
[
  {
    "title": "Midnight City",
    "artist": "M83",
    "genre": "Electronic",
    "mood": "Dreamy",
    "description": "Perfect synth-pop anthem with nostalgic vibes",
    "duration": "4:03",
    "spotifyId": "4uLU6hMCjMI75M1A2tKUQC"
  }
]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional music curator and AI DJ. Always respond with valid JSON arrays of music recommendations.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const recommendationsText = data.choices[0].message.content;

    console.log('Raw recommendations:', recommendationsText);

    // Parse the JSON response
    let recommendations;
    try {
      recommendations = JSON.parse(recommendationsText);
    } catch (parseError) {
      console.error('Failed to parse recommendations JSON:', parseError);
      // Fallback recommendations
      recommendations = [
        {
          title: "Cosmic Conversations",
          artist: "AI Ambient",
          genre: "Ambient",
          mood: "Relaxing",
          description: "Perfect for deep thinking and AI conversations",
          duration: "3:24",
          spotifyId: "1a2b3c4d5e6f7g8h9i0j1k2l"
        },
        {
          title: "Digital Dreams",
          artist: "Synthetic Symphony",
          genre: "Electronic",
          mood: "Uplifting",
          description: "Energizing electronic beats for creativity",
          duration: "4:12",
          spotifyId: "2b3c4d5e6f7g8h9i0j1k2l3m"
        }
      ];
    }

    return new Response(JSON.stringify({ 
      recommendations,
      generatedAt: new Date().toISOString(),
      mood,
      genres
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-music-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackRecommendations: [
        {
          title: "Fallback Track",
          artist: "Default Artist",
          genre: "Ambient",
          mood: "Calm",
          description: "A relaxing fallback track",
          duration: "3:00",
          spotifyId: "fallback123456789"
        }
      ]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});