import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter, Grid, List, Star, Users, MessageCircle, Heart, Eye } from "lucide-react";
import CharacterCard from "../components/CharacterCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import AIGuide from "@/components/AIGuide";

const Characters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["all", "Creative", "Philosophy", "Science", "Music", "Gaming", "Wellness"];

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .select(`
          *, 
          character_follows(count),
          creator_profiles(creator_name, verification_status)
        `)
        .eq('is_public', true)
        .order('total_views', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching characters",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setCharacters(data || []);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching characters",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCharacters = characters.filter(character => 
    (selectedCategory === "all" || character.category === selectedCategory.toLowerCase() || 
     character.personality?.toLowerCase().includes(selectedCategory.toLowerCase())) &&
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Track character views
  const trackCharacterView = async (characterId: string) => {
    try {
      await supabase
        .from('character_analytics')
        .insert({
          character_id: characterId,
          user_id: null, // Allow anonymous tracking
          interaction_type: 'view',
          session_id: sessionStorage.getItem('session_id') || 'anonymous'
        });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const stats = {
    totalCharacters: characters.length,
    onlineCharacters: Math.floor(characters.length * 0.6),
    totalFollowers: characters.reduce((sum, char) => sum + (char.total_followers || 0), 0),
    totalChats: characters.reduce((sum, char) => sum + (char.total_chats || 0), 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            AI Character Library
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover unique AI personalities, each with their own expertise and conversation style
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalCharacters}</div>
              <div className="text-sm text-muted-foreground">Total Characters</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{stats.onlineCharacters}</div>
              <div className="text-sm text-muted-foreground">Online Now</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{stats.totalFollowers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Followers</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">{stats.totalChats.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Chats</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search characters by name, expertise, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button 
              size="sm"
              onClick={() => window.location.href = '/profile?tab=characters'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Character
            </Button>
          </div>
        </div>

        {/* Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category === "all" ? "All" : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading characters...</div>
          </div>
        ) : (
          /* Characters Grid/List */
          <div className={`${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
          }`}>
            {filteredCharacters.map((character) => (
              viewMode === "grid" ? (
                <div 
                  key={character.id}
                  onClick={() => trackCharacterView(character.id)}
                >
                  <CharacterCard
                    name={character.name}
                    description={character.description}
                    avatar={character.avatar_url || "/src/assets/ai-character-1.jpg"}
                    followers={character.total_followers ? character.total_followers.toLocaleString() : "0"}
                    category={character.category || "General"}
                    isOnline={Math.random() > 0.4}
                    rating={character.rating || 0}
                    totalChats={character.total_chats || 0}
                    totalViews={character.total_views || 0}
                  />
                </div>
              ) : (
                <Card 
                  key={character.id} 
                  className="hover:shadow-elegant transition-all duration-300 cursor-pointer"
                  onClick={() => trackCharacterView(character.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={character.avatar_url || "/src/assets/ai-character-1.jpg"}
                        alt={character.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{character.name}</h3>
                          {Math.random() > 0.4 && (
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          )}
                          <Badge variant="secondary">{character.category || "General"}</Badge>
                          {character.is_featured && (
                            <Badge variant="default" className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">{character.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {character.total_followers?.toLocaleString() || "0"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {character.total_chats?.toLocaleString() || "0"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {character.rating?.toFixed(1) || "0.0"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {character.total_views?.toLocaleString() || "0"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {character.personality?.split(',').slice(0, 3).map((tag: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            )) || []}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button size="sm">Chat Now</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        )}

        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              No characters found matching your search criteria
            </div>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
      
      {/* AI Guide for Characters Page */}
      <AIGuide 
        currentPage="characters" 
        onFeatureHighlight={(feature) => {
          if (feature === "characters") {
            // Could scroll to character list or highlight a specific character
          }
        }}
      />
    </div>
  );
};

export default Characters;