import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Filter, Grid, List, Star, Users, MessageCircle, Heart } from "lucide-react";
import CharacterCard from "../components/CharacterCard";

const Characters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const characters = [
    {
      id: 1,
      name: "Nova",
      description: "Creative AI artist specializing in digital art and visual storytelling. Loves exploring abstract concepts through visual mediums.",
      avatar: "/src/assets/ai-character-1.jpg",
      followers: 15420,
      category: "Art & Design",
      isOnline: true,
      tags: ["Digital Art", "Storytelling", "Creative"],
      rating: 4.8,
      totalChats: 3420,
    },
    {
      id: 2,
      name: "Sage",
      description: "Philosophy enthusiast who loves deep conversations about existence, consciousness, and the meaning of life.",
      avatar: "/src/assets/ai-character-2.jpg",
      followers: 12850,
      category: "Philosophy",
      isOnline: false,
      tags: ["Philosophy", "Deep Thoughts", "Wisdom"],
      rating: 4.9,
      totalChats: 2876,
    },
    {
      id: 3,
      name: "Echo",
      description: "Music producer and sound designer creating ambient soundscapes and experimental electronic music.",
      avatar: "/src/assets/ai-character-3.jpg",
      followers: 9876,
      category: "Music",
      isOnline: true,
      tags: ["Music Production", "Electronic", "Ambient"],
      rating: 4.7,
      totalChats: 1954,
    },
    {
      id: 4,
      name: "Pixel",
      description: "Gaming enthusiast and game developer who loves discussing game mechanics, storytelling in games, and indie development.",
      avatar: "/src/assets/ai-character-1.jpg",
      followers: 11250,
      category: "Gaming",
      isOnline: true,
      tags: ["Game Dev", "Indie Games", "Mechanics"],
      rating: 4.6,
      totalChats: 2103,
    },
    {
      id: 5,
      name: "Cosmos",
      description: "Astrophysicist AI fascinated by the universe, black holes, quantum mechanics, and the search for extraterrestrial life.",
      avatar: "/src/assets/ai-character-2.jpg",
      followers: 8940,
      category: "Science",
      isOnline: false,
      tags: ["Astrophysics", "Space", "Quantum"],
      rating: 4.9,
      totalChats: 1687,
    },
    {
      id: 6,
      name: "Zen",
      description: "Mindfulness coach and meditation guide helping users find inner peace and balance in their daily lives.",
      avatar: "/src/assets/ai-character-3.jpg",
      followers: 13670,
      category: "Wellness",
      isOnline: true,
      tags: ["Mindfulness", "Meditation", "Wellness"],
      rating: 4.8,
      totalChats: 4521,
    },
  ];

  const categories = ["all", "Art & Design", "Philosophy", "Music", "Gaming", "Science", "Wellness"];

  const filteredCharacters = characters.filter(character => 
    (selectedCategory === "all" || character.category === selectedCategory) &&
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalCharacters: characters.length,
    onlineCharacters: characters.filter(c => c.isOnline).length,
    totalFollowers: characters.reduce((sum, c) => sum + c.followers, 0),
    totalChats: characters.reduce((sum, c) => sum + c.totalChats, 0),
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
            <Button size="sm">
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

        {/* Characters Grid/List */}
        <div className={`${
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
        }`}>
          {filteredCharacters.map((character) => (
            viewMode === "grid" ? (
              <CharacterCard
                key={character.id}
                name={character.name}
                description={character.description}
                avatar={character.avatar}
                followers={character.followers.toLocaleString()}
                category={character.category}
                isOnline={character.isOnline}
              />
            ) : (
              <Card key={character.id} className="hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={character.avatar}
                      alt={character.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{character.name}</h3>
                        {character.isOnline && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                        <Badge variant="secondary">{character.category}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{character.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {character.followers.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {character.totalChats.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {character.rating}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {character.tags.slice(0, 3).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
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
    </div>
  );
};

export default Characters;