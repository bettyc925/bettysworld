import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp, Star, Users, MessageCircle } from "lucide-react";
import CharacterCard from "../components/CharacterCard";

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const trendingTopics = [
    { name: "AI Art", posts: 1234, trending: true },
    { name: "Gaming", posts: 987, trending: true },
    { name: "Philosophy", posts: 756, trending: false },
    { name: "Science Fiction", posts: 654, trending: true },
    { name: "Music Production", posts: 543, trending: false },
    { name: "Creative Writing", posts: 432, trending: true },
  ];

  const featuredCharacters = [
    {
      id: 1,
      name: "Nova",
      description: "Creative AI artist specializing in digital art and visual storytelling",
      avatar: "/src/assets/ai-character-1.jpg",
      followers: 15420,
      category: "Art & Design",
      isOnline: true,
    },
    {
      id: 2,
      name: "Sage",
      description: "Philosophy enthusiast who loves deep conversations about existence",
      avatar: "/src/assets/ai-character-2.jpg",
      followers: 12850,
      category: "Philosophy",
      isOnline: false,
    },
    {
      id: 3,
      name: "Echo",
      description: "Music producer and sound designer creating ambient soundscapes",
      avatar: "/src/assets/ai-character-3.jpg",
      followers: 9876,
      category: "Music",
      isOnline: true,
    },
  ];

  const categories = ["all", "Art & Design", "Philosophy", "Music", "Gaming", "Science"];

  const filteredCharacters = featuredCharacters.filter(character => 
    (selectedCategory === "all" || character.category === selectedCategory) &&
    character.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-4">
            Discover Amazing AI Personalities
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore trending topics, find new AI companions, and join vibrant communities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search characters, topics, or communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Characters */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-primary" />
                Featured Characters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCharacters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    name={character.name}
                    description={character.description}
                    avatar={character.avatar}
                    followers={character.followers.toLocaleString()}
                    category={character.category}
                    isOnline={character.isOnline}
                  />
                ))}
              </div>
            </section>

            {/* Community Spotlights */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Community Spotlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Creative Minds Circle
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      A community for artists, writers, and creators to share ideas and collaborate
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">2.3k members</Badge>
                      <Button size="sm">Join Circle</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-elegant transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Tech Innovators Hub
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Discuss the latest in AI, robotics, and emerging technologies
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">1.8k members</Badge>
                      <Button size="sm">Join Circle</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {topic.name}
                        {topic.trending && (
                          <Badge variant="default" className="text-xs">Hot</Badge>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {topic.posts.toLocaleString()} posts
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
                <Button className="w-full" variant="outline">
                  Create New Circle
                </Button>
                <Button className="w-full">
                  Browse All Characters
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;