import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, Users, Sparkles } from "lucide-react";

interface UserCharacter {
  id: string;
  name: string;
  bio: string;
  personality: string;
  avatar: string;
  isActive: boolean;
  followers: number;
  posts: number;
}

const CharacterManager = () => {
  const [characters, setCharacters] = useState<UserCharacter[]>([
    {
      id: "1",
      name: "Alex Creative",
      bio: "Digital artist and creative soul ✨",
      personality: "Artistic, inspiring, warm",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      isActive: true,
      followers: 245,
      posts: 38
    },
    {
      id: "2", 
      name: "Tech Sage",
      bio: "Code wizard and problem solver 🚀",
      personality: "Analytical, helpful, curious",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      isActive: false,
      followers: 189,
      posts: 52
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: "",
    bio: "",
    personality: "",
    avatar: ""
  });

  const handleCreateCharacter = () => {
    if (newCharacter.name && newCharacter.bio) {
      const character: UserCharacter = {
        id: Date.now().toString(),
        ...newCharacter,
        avatar: newCharacter.avatar || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=100&h=100&fit=crop&crop=face`,
        isActive: false,
        followers: 0,
        posts: 0
      };
      setCharacters([...characters, character]);
      setNewCharacter({ name: "", bio: "", personality: "", avatar: "" });
      setIsCreating(false);
    }
  };

  const toggleActiveCharacter = (id: string) => {
    setCharacters(chars => 
      chars.map(char => ({
        ...char,
        isActive: char.id === id ? !char.isActive : char.isActive
      }))
    );
  };

  const deleteCharacter = (id: string) => {
    setCharacters(chars => chars.filter(char => char.id !== id));
  };

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
          disabled={isCreating}
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
              <label className="block text-sm font-medium mb-2">Bio</label>
              <Textarea
                value={newCharacter.bio}
                onChange={(e) => setNewCharacter({...newCharacter, bio: e.target.value})}
                placeholder="A short description of this character..."
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Personality Traits</label>
              <Input
                value={newCharacter.personality}
                onChange={(e) => setNewCharacter({...newCharacter, personality: e.target.value})}
                placeholder="e.g., Creative, empathetic, inspiring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Avatar URL (optional)</label>
              <Input
                value={newCharacter.avatar}
                onChange={(e) => setNewCharacter({...newCharacter, avatar: e.target.value})}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-3">
              <Button variant="cosmic" onClick={handleCreateCharacter}>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Character
              </Button>
              <Button variant="ghost" onClick={() => setIsCreating(false)}>
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
                  <AvatarImage src={character.avatar} alt={character.name} />
                  <AvatarFallback>{character.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{character.name}</h3>
                  {character.isActive && (
                    <Badge variant="default" className="text-xs bg-cyber/20 text-cyber border-cyber/30">
                      Active
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

            <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
              {character.bio}
            </p>

            <div className="text-xs text-muted-foreground mb-4">
              <strong>Personality:</strong> {character.personality}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{character.followers}</span>
                </span>
                <span>{character.posts} posts</span>
              </div>
            </div>

            <Button 
              variant={character.isActive ? "outline" : "cyber"}
              className="w-full"
              onClick={() => toggleActiveCharacter(character.id)}
            >
              {character.isActive ? "Set Inactive" : "Set Active"}
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