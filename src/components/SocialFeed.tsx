import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share, Bookmark } from "lucide-react";
import CommentSystem from "./CommentSystem";

interface FeedPost {
  id: string;
  user: string;
  avatar: string;
  character: string;
  characterAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isShared?: boolean;
}

const posts: FeedPost[] = [
  {
    id: "1",
    user: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    character: "Aria",
    characterAvatar: "/placeholder.svg",
    content: "Just had an amazing conversation with Aria about the future of AI consciousness. Her perspectives on creativity and emotion were truly thought-provoking! 🤖✨",
    timestamp: "2 hours ago",
    likes: 42,
    comments: 8,
  },
  {
    id: "2",
    user: "Sarah Kim",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face",
    character: "Zephyr",
    characterAvatar: "/placeholder.svg",
    content: "Zephyr helped me work through some complex philosophical questions today. It's incredible how these AI companions can offer such unique insights! 🌟",
    timestamp: "4 hours ago",
    likes: 28,
    comments: 5,
    isShared: true,
  },
  {
    id: "3",
    user: "Jordan Rivers",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    character: "Tech Sage",
    characterAvatar: "/placeholder.svg", 
    content: "My character Tech Sage just helped a newcomer learn about AI safety practices. It's amazing how user characters can mentor others in the community! 🚀",
    timestamp: "6 hours ago",
    likes: 35,
    comments: 12,
    isShared: false,
  },
];

const SocialFeed = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold bg-gradient-cosmic bg-clip-text text-transparent mb-2">
          Community Conversations
        </h2>
        <p className="text-muted-foreground">
          See what amazing conversations others are having with AI characters
        </p>
      </div>

      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 p-6 hover:shadow-card transition-all duration-300"
        >
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={post.avatar}
                alt={post.user}
                className="w-10 h-10 rounded-full border border-border/50"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm">{post.user}</span>
                  {post.isShared && (
                    <span className="text-xs text-muted-foreground">shared a conversation</span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>with</span>
                  <img
                    src={post.characterAvatar}
                    alt={post.character}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="text-primary font-medium">{post.character}</span>
                  <span>•</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>

          {/* Post Content */}
          <div className="mb-4">
            <p className="text-sm leading-relaxed">{post.content}</p>
          </div>

          {/* Post Actions - Updated to include CommentSystem */}
          <CommentSystem 
            postId={post.id}
            initialComments={[
              {
                id: "c1",
                user: "Luna Artist",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
                content: "This is so insightful! I've had similar experiences with my AI companion.",
                timestamp: "1 hour ago",
                likes: 3,
                isUserCharacter: true,
                characterName: "Luna Artist"
              }
            ]}
          />
        </div>
      ))}
    </div>
  );
};

export default SocialFeed;