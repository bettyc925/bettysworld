import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, Users, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { validateCharacterName, validateCharacterDescription, sanitizeInput } from "@/utils/validation";

interface UserCharacter {
  id: string;
  name: string;
  description: string | null;
  personality: string | null;
  avatar_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

const CharacterManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [characters, setCharacters] = useState<UserCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    description: "",
    personality: "",
    avatar_url: ""
  });

  // Fetch user's characters
  useEffect(() => {
    if (user) {
      fetchCharacters();
    }
  }, [user]);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCharacters(data || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
      toast({
        title: "Error",
        description: "Failed to load characters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create characters.",
        variant: "destructive",
      });
      return;
    }

    // Validate inputs
    const nameValidation = validateCharacterName(newCharacter.name);
    const descriptionValidation = validateCharacterDescription(newCharacter.description);

    if (!nameValidation.isValid) {
      toast({
        title: "Invalid character name",
        description: nameValidation.errors[0],
        variant: "destructive",
      });
      return;
    }

    if (!descriptionValidation.isValid) {
      toast({
        title: "Invalid description",
        description: descriptionValidation.errors[0],
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('characters')
        .insert({
          name: sanitizeInput(newCharacter.name),
          description: newCharacter.description ? sanitizeInput(newCharacter.description) : null,
          personality: newCharacter.personality ? sanitizeInput(newCharacter.personality) : null,
          avatar_url: newCharacter.avatar_url || null,
          created_by: user.id,
          is_public: true
        })
        .select()
        .single();

      if (error) throw error;

      setCharacters([data, ...characters]);
      setNewCharacter({ name: "", description: "", personality: "", avatar_url: "" });
      setIsCreating(false);
      
      toast({
        title: "Character created",
        description: "Your new character has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating character:', error);
      toast({
        title: "Error",
        description: "Failed to create character. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePublicCharacter = async (id: string, currentPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('characters')
        .update({ is_public: !currentPublic })
        .eq('id', id)
        .eq('created_by', user?.id);

      if (error) throw error;

      setCharacters(chars => 
        chars.map(char => ({
          ...char,
          is_public: char.id === id ? !currentPublic : char.is_public
        }))
      );

      toast({
        title: "Character updated",
        description: `Character is now ${!currentPublic ? 'public' : 'private'}.`,
      });
    } catch (error) {
      console.error('Error updating character:', error);
      toast({
        title: "Error",
        description: "Failed to update character. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteCharacter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id)
        .eq('created_by', user?.id);

      if (error) throw error;

      setCharacters(chars => chars.filter(char => char.id !== id));
      
      toast({
        title: "Character deleted",
        description: "Character has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting character:', error);
      toast({
        title: "Error",
        description: "Failed to delete character. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading characters...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="p-8 text-center bg-gradient-card backdrop-blur-sm border-border/50">
        <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
        <p className="text-muted-foreground">
          Please log in to create and manage your characters.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
            Your Characters
          </h2>
          <p className="text-muted-foreground">Create and manage your different personas</p>
        </div>
        <Button 
          variant="cosmic" 
          onClick={() => setIsCreating(true)}
          disabled={isCreating || isSubmitting}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Character
        </Button>
      </div>

      {/* Create New Character Form */}
      {isCreating && (
        <Card className="p-6 bg-gradient-card backdrop-blur-sm border-border/50">
          <h3 className="text-lg font-semibold mb-4">Create New Character</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Character Name</label>
              <Input
                value={newCharacter.name}
                onChange={(e) => setNewCharacter({...newCharacter, name: e.target.value})}
                placeholder="e.g., Luna Artist, Tech Wizard"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={newCharacter.description}
                onChange={(e) => setNewCharacter({...newCharacter, description: e.target.value})}
                placeholder="A short description of this character..."
                rows={2}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {newCharacter.description.length}/1000 characters
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Personality Traits (optional)</label>
              <Input
                value={newCharacter.personality}
                onChange={(e) => setNewCharacter({...newCharacter, personality: e.target.value})}
                placeholder="e.g., Creative, empathetic, inspiring"
                maxLength={2000}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Avatar URL (optional)</label>
              <Input
                value={newCharacter.avatar_url}
                onChange={(e) => setNewCharacter({...newCharacter, avatar_url: e.target.value})}
                placeholder="https://..."
                type="url"
              />
            </div>
            <div className="flex gap-3">
              <Button 
                variant="cosmic" 
                onClick={handleCreateCharacter}
                disabled={isSubmitting || !newCharacter.name.trim()}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? "Creating..." : "Create Character"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setIsCreating(false);
                  setNewCharacter({ name: "", description: "", personality: "", avatar_url: "" });
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Character List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character) => (
          <Card key={character.id} className="p-6 bg-gradient-card backdrop-blur-sm border-border/50 hover:shadow-cosmic transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-12 h-12 border-2 border-primary/30">
                  <AvatarImage src={character.avatar_url || undefined} alt={character.name} />
                  <AvatarFallback>{character.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{character.name}</h3>
                  {character.is_public && (
                    <Badge variant="default" className="text-xs bg-cyber/20 text-cyber border-cyber/30">
                      Public
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => deleteCharacter(character.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>

            {character.description && (
              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                {character.description}
              </p>
            )}

            {character.personality && (
              <div className="text-xs text-muted-foreground mb-4">
                <strong>Personality:</strong> {character.personality}
              </div>
            )}

            <div className="text-xs text-muted-foreground mb-4">
              <strong>Created:</strong> {new Date(character.created_at).toLocaleDateString()}
            </div>

            <Button 
              variant={character.is_public ? "outline" : "cyber"}
              className="w-full"
              onClick={() => togglePublicCharacter(character.id, character.is_public)}
            >
              {character.is_public ? "Make Private" : "Make Public"}
            </Button>
          </Card>
        ))}
      </div>

      {characters.length === 0 && !isCreating && (
        <Card className="p-12 text-center bg-gradient-card backdrop-blur-sm border-border/50">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No characters yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first character to start expressing different aspects of yourself
          </p>
          <Button variant="cosmic" onClick={() => setIsCreating(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Character
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CharacterManager;