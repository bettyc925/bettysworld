import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Star, 
  DollarSign, 
  Eye,
  Heart,
  Share2,
  Crown,
  BarChart3,
  Calendar,
  Award,
  Target,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

interface CreatorStats {
  totalViews: number;
  totalChats: number;
  totalFollowers: number;
  totalEarnings: number;
  engagementRate: number;
  topCharacter: string;
  charactersCount: number;
}

interface PopularCharacter {
  id: string;
  name: string;
  avatar_url: string;
  total_views: number;
  total_chats: number;
  total_followers: number;
  rating: number;
  engagement_score: number;
  category: string;
  growth_percentage: number;
}

const CreatorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<CreatorStats>({
    totalViews: 0,
    totalChats: 0,
    totalFollowers: 0,
    totalEarnings: 0,
    engagementRate: 0,
    topCharacter: '',
    charactersCount: 0
  });
  const [popularCharacters, setPopularCharacters] = useState<PopularCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    if (user) {
      fetchCreatorStats();
      fetchPopularCharacters();
    }
  }, [user, timeRange]);

  const fetchCreatorStats = async () => {
    try {
      // Fetch user's characters stats
      const { data: characters, error: charError } = await supabase
        .from('characters')
        .select(`
          id, name, total_views, total_chats, total_followers, rating,
          character_analytics(interaction_type, created_at)
        `)
        .eq('created_by', user?.id);

      if (charError) throw charError;

      const totalViews = characters?.reduce((sum, char) => sum + (char.total_views || 0), 0) || 0;
      const totalChats = characters?.reduce((sum, char) => sum + (char.total_chats || 0), 0) || 0;
      const totalFollowers = characters?.reduce((sum, char) => sum + (char.total_followers || 0), 0) || 0;
      
      // Find top performing character
      const topChar = characters?.reduce((prev, current) => 
        (current.total_views || 0) > (prev.total_views || 0) ? current : prev
      );

      setStats({
        totalViews,
        totalChats,
        totalFollowers,
        totalEarnings: totalChats * 0.1, // Simulate earnings
        engagementRate: totalViews > 0 ? (totalChats / totalViews) * 100 : 0,
        topCharacter: topChar?.name || '',
        charactersCount: characters?.length || 0
      });

    } catch (error) {
      console.error('Error fetching creator stats:', error);
      toast({
        title: "Error",
        description: "Failed to load creator statistics",
        variant: "destructive"
      });
    }
  };

  const fetchPopularCharacters = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('created_by', user?.id)
        .order('total_views', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Calculate growth and engagement scores
      const enrichedData = data?.map(char => ({
        ...char,
        engagement_score: ((char.total_chats || 0) * 2 + (char.total_followers || 0) * 3) / (char.total_views || 1),
        growth_percentage: Math.random() * 50 + 5 // Simulate growth
      })) || [];

      setPopularCharacters(enrichedData);
    } catch (error) {
      console.error('Error fetching popular characters:', error);
      toast({
        title: "Error",
        description: "Failed to load character analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = "text-primary" }: any) => (
    <Card className="bg-gradient-card backdrop-blur-sm border-border/50 hover:shadow-cosmic transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            {trend && (
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+{trend}%</span>
                <span className="text-muted-foreground ml-1">this week</span>
              </div>
            )}
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-cosmic bg-clip-text text-transparent">
            Creator Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your character performance and grow your audience
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setTimeRange('24h')}>
            24h
          </Button>
          <Button variant="outline" onClick={() => setTimeRange('7d')}>
            7d
          </Button>
          <Button variant="outline" onClick={() => setTimeRange('30d')}>
            30d
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Views" 
          value={stats.totalViews.toLocaleString()} 
          icon={Eye}
          trend={15.2}
          color="text-blue-500"
        />
        <StatCard 
          title="Total Chats" 
          value={stats.totalChats.toLocaleString()} 
          icon={MessageCircle}
          trend={8.7}
          color="text-green-500"
        />
        <StatCard 
          title="Followers" 
          value={stats.totalFollowers.toLocaleString()} 
          icon={Users}
          trend={12.3}
          color="text-purple-500"
        />
        <StatCard 
          title="Engagement Rate" 
          value={`${stats.engagementRate.toFixed(1)}%`} 
          icon={Heart}
          trend={5.8}
          color="text-pink-500"
        />
      </div>

      <Tabs defaultValue="characters" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="characters">Top Characters</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">Growth Insights</TabsTrigger>
        </TabsList>

        {/* Top Characters Tab */}
        <TabsContent value="characters" className="space-y-6">
          <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                Your Top Performing Characters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularCharacters.map((character, index) => (
                  <div 
                    key={character.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                        #{index + 1}
                      </div>
                      <Avatar className="w-12 h-12 border-2 border-primary/30">
                        <AvatarImage src={character.avatar_url || undefined} />
                        <AvatarFallback>{character.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{character.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{character.category}</Badge>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {(character.rating || 0).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-blue-500">
                          {(character.total_views || 0).toLocaleString()}
                        </div>
                        <div className="text-muted-foreground">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-500">
                          {(character.total_chats || 0).toLocaleString()}
                        </div>
                        <div className="text-muted-foreground">Chats</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-500">
                          {(character.total_followers || 0).toLocaleString()}
                        </div>
                        <div className="text-muted-foreground">Followers</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1 font-semibold text-green-600">
                          <TrendingUp className="w-3 h-3" />
                          +{character.growth_percentage.toFixed(1)}%
                        </div>
                        <div className="text-muted-foreground">Growth</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>View-to-Chat Conversion</span>
                  <span className="font-semibold">{stats.engagementRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Rating</span>
                  <span className="font-semibold">4.7/5.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Top Category</span>
                  <Badge variant="secondary">Creative</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Most Active Character</span>
                  <span className="font-semibold">{stats.topCharacter || 'None'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Growth Targets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Monthly Views Goal</span>
                    <span>10,000</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${Math.min((stats.totalViews / 10000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Follower Goal</span>
                    <span>1,000</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.min((stats.totalFollowers / 1000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Growth Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Growth Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">Trending Categories</h4>
                  <p className="text-sm text-muted-foreground">
                    AI tutors and wellness coaches are gaining 30% more views this month.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <h4 className="font-semibold text-green-600 mb-2">Engagement Boost</h4>
                  <p className="text-sm text-muted-foreground">
                    Characters with detailed personalities get 2x more engagement.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <h4 className="font-semibold text-blue-600 mb-2">Optimal Posting</h4>
                  <p className="text-sm text-muted-foreground">
                    Users are most active between 2-6 PM on weekdays.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  Creator Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-semibold">First Character Created</div>
                    <div className="text-sm text-muted-foreground">Welcome to the platform!</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="font-semibold">100 Views Milestone</div>
                    <div className="text-sm text-muted-foreground">Your content is gaining traction!</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-background/30 opacity-50">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Users className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <div className="font-semibold">1000 Followers</div>
                    <div className="text-sm text-muted-foreground">Keep growing your community!</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorDashboard;