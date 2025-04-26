
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookmarkIcon, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSupabaseData } from "@/hooks/use-supabase-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface CardItemProps {
  id: string;
  type: 'scholarship' | 'event' | 'project' | 'gig' | 'hackathon';
  title: string;
  description: string;
  tags: string[];
  image?: string;
  creator?: {
    name: string;
    avatar?: string;
  };
  bookmarked?: boolean;
  detailsUrl: string;
  metadata?: {
    [key: string]: any;
    icon?: JSX.Element;
  }[];
  actionLabel?: string;
  onAction?: () => void;
  onBookmark?: () => Promise<void>;
}

export function CardItem({
  id,
  type,
  title,
  description,
  tags,
  image,
  creator,
  bookmarked: initialBookmarked = false,
  detailsUrl,
  metadata = [],
  actionLabel = "View Details",
  onAction,
  onBookmark,
}: CardItemProps) {
  const { user } = useAuth();
  const { toggleBookmark } = useSupabaseData();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scholarship':
        return 'bg-pastel-blue/20';
      case 'event':
        return 'bg-pastel-purple/20';
      case 'project':
        return 'bg-pastel-green/20';
      case 'gig':
        return 'bg-pastel-orange/20';
      case 'hackathon':
        return 'bg-pastel-purple/20';
      default:
        return 'bg-muted';
    }
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark items",
        variant: "destructive"
      });
      return;
    }

    setIsBookmarking(true);
    
    try {
      if (onBookmark) {
        await onBookmark();
      } else {
        const { bookmarked, error } = await toggleBookmark(type, id, user.id);
        
        if (error) throw error;
        
        setIsBookmarked(bookmarked);
        
        toast({
          title: bookmarked ? "Added to bookmarks" : "Removed from bookmarks",
          description: bookmarked ? `${title} has been bookmarked` : `${title} has been removed from bookmarks`,
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive"
      });
    } finally {
      setIsBookmarking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-xl border p-6 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-4 mb-4">
        {image ? (
          <div className="w-12 h-12 rounded-full bg-muted flex-shrink-0 overflow-hidden">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className={cn("w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center", getTypeColor(type))}>
            {type === 'scholarship' && <span className="text-lg">🎓</span>}
            {type === 'event' && <span className="text-lg">📅</span>}
            {type === 'project' && <span className="text-lg">👥</span>}
            {type === 'gig' && <span className="text-lg">💼</span>}
            {type === 'hackathon' && <span className="text-lg">🚀</span>}
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold line-clamp-1">{title}</h3>
          {creator && (
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                {creator.avatar && <AvatarImage src={creator.avatar} />}
                <AvatarFallback>{creator.name.charAt(0)}{creator.name.split(' ')[1]?.charAt(0) || ''}</AvatarFallback>
              </Avatar>
              <p className="text-sm text-muted-foreground">{creator.name}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn("flex-shrink-0", isBookmarked ? "text-primary" : "text-muted-foreground")}
          onClick={handleBookmarkToggle}
          disabled={isBookmarking}
        >
          <BookmarkIcon className={cn("h-5 w-5", isBookmarked ? "fill-primary" : "")} />
        </Button>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        
        {metadata && metadata.length > 0 && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {metadata.map((item, i) => (
              <div key={i} className="flex items-center text-muted-foreground">
                {item.icon && <span className="mr-1.5">{item.icon}</span>}
                <span className="truncate">{item.value}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag, i) => (
            <Badge key={i} variant="outline" className={cn(getTypeColor(type))}>
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <Link to={detailsUrl} className="text-primary text-sm flex items-center hover:underline">
            <ExternalLink className="h-4 w-4 mr-1" />
            Details
          </Link>
          <Button onClick={onAction} size="sm">
            {actionLabel}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
