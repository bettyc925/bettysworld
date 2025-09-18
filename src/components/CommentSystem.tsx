import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, MoreHorizontal, Send } from "lucide-react";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isUserCharacter?: boolean;
  characterName?: string;
}

interface CommentSystemProps {
  postId: string;
  initialComments?: Comment[];
}

const CommentSystem = ({ postId, initialComments = [] }: CommentSystemProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  // Mock user characters for demo
  const userCharacters = [
    { id: "1", name: "Alex Creative", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { id: "2", name: "Tech Sage", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" }
  ];
  const [selectedCharacter, setSelectedCharacter] = useState(userCharacters[0]);

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      user: selectedCharacter.name,
      avatar: selectedCharacter.avatar,
      content: newComment,
      timestamp: "now",
      likes: 0,
      isUserCharacter: true,
      characterName: selectedCharacter.name
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  return (
    <div className="space-y-4">
      {/* Comment Toggle */}
      <div className="flex items-center space-x-6 text-sm">
        <button 
          className="flex items-center space-x-2 text-muted-foreground hover:text-accent transition-colors"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle className="w-4 h-4" />
          <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
        </button>
        <button className="flex items-center space-x-2 text-muted-foreground hover:text-accent transition-colors">
          <Heart className="w-4 h-4" />
          <span>42 likes</span>
        </button>
        <button className="flex items-center space-x-2 text-muted-foreground hover:text-cyber transition-colors">
          <Share className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-gradient-card backdrop-blur-sm rounded-xl border border-border/50 p-4 space-y-4">
          {/* New Comment Form */}
          <div className="flex space-x-3">
            <Avatar className="w-8 h-8 border border-border/50">
              <AvatarImage src={selectedCharacter.avatar} alt={selectedCharacter.name} />
              <AvatarFallback>{selectedCharacter.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              {/* Character Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Posting as:</span>
                <select 
                  value={selectedCharacter.id}
                  onChange={(e) => {
                    const character = userCharacters.find(c => c.id === e.target.value);
                    if (character) setSelectedCharacter(character);
                  }}
                  className="text-xs bg-muted/50 border border-border/50 rounded px-2 py-1"
                >
                  {userCharacters.map(char => (
                    <option key={char.id} value={char.id}>{char.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Comment Input */}
              <div className="flex space-x-2">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-muted/50"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
                />
                <Button 
                  variant="cyber" 
                  size="sm"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar className="w-8 h-8 border border-border/50">
                  <AvatarImage src={comment.avatar} alt={comment.user} />
                  <AvatarFallback>{comment.user[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">{comment.user}</span>
                      {comment.isUserCharacter && (
                        <span className="text-xs text-cyber">User Character</span>
                      )}
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-2">
                    <button 
                      className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-accent transition-colors"
                      onClick={() => handleLikeComment(comment.id)}
                    >
                      <Heart className="w-3 h-3" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                      Reply
                    </button>
                    <button className="text-xs text-muted-foreground hover:text-muted-foreground/80 transition-colors">
                      <MoreHorizontal className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {comments.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-4">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSystem;