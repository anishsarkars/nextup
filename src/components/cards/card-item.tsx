
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Calendar, Clock, ExternalLink, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project, Gig, Event } from '@/hooks/use-supabase-data';

export interface CardItemProps {
  item: Project | Gig | Event;
  type: 'project' | 'gig' | 'hackathon' | 'event';
  onBookmark?: (id: string) => void;
  onApply?: (id: string) => void;
  isBookmarked?: boolean;
}

export function CardItem({ item, type, onBookmark, onApply, isBookmarked = false }: CardItemProps) {
  // Helpers for rendering different card types
  const getCardBadgeColor = () => {
    switch (type) {
      case 'project':
        return 'bg-blue-100 text-blue-800';
      case 'gig':
        if ((item as Gig).gig_type === 'offering') return 'bg-emerald-100 text-emerald-800';
        return 'bg-purple-100 text-purple-800';
      case 'hackathon':
      case 'event':
        return 'bg-amber-100 text-amber-800';
      default:
        return '';
    }
  };

  const getCardIcon = () => {
    switch (type) {
      case 'project':
        return <User className="h-4 w-4 mr-1" />;
      case 'gig':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'hackathon':
      case 'event':
        return <Calendar className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  const getCardTypeName = () => {
    switch (type) {
      case 'project':
        return 'Project';
      case 'gig':
        return (item as Gig).gig_type === 'offering' ? 'Skill Offered' : 'Skill Wanted';
      case 'hackathon':
        return 'Hackathon';
      case 'event':
        return 'Event';
      default:
        return '';
    }
  };

  // Helper functions to unify accessing different field names
  const getTags = () => {
    if (type === 'project') {
      return (item as Project).tags || (item as Project).skill_tags || [];
    } else if (type === 'gig') {
      return (item as Gig).tags || [];
    } else {
      return (item as Event).tags || [];
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Badge className={cn("font-normal", getCardBadgeColor())}>
              {getCardIcon()}
              {getCardTypeName()}
            </Badge>
            {isBookmarked && (
              <Badge variant="outline" className="font-normal">Bookmarked</Badge>
            )}
          </div>
          
          {onBookmark && (
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-8 w-8", isBookmarked ? "text-amber-500" : "text-muted-foreground")}
              onClick={() => onBookmark(item.id)}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <CardTitle className="text-xl line-clamp-2">{item.title}</CardTitle>
        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {getTags().slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {getTags().length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{getTags().length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Type specific content */}
        {type === 'project' && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>Deadline: </span>
              <span className="ml-1 font-medium">{(item as Project).deadline}</span>
            </p>
            
            <p className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1.5" />
              <span>Looking for: </span>
              <span className="ml-1 font-medium">{(item as Project).roles_needed.join(', ')}</span>
            </p>
          </div>
        )}
        
        {type === 'gig' && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>Rate: </span>
              <span className="ml-1 font-medium">{(item as Gig).rate}</span>
            </p>
            
            <p className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>Duration: </span>
              <span className="ml-1 font-medium">{(item as Gig).duration}</span>
            </p>
            
            <p className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1.5" />
              <span>Availability: </span>
              <span className="ml-1 font-medium">{(item as Gig).availability}</span>
            </p>
          </div>
        )}
        
        {(type === 'hackathon' || type === 'event') && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>Date: </span>
              <span className="ml-1 font-medium">{(item as Event).date}</span>
            </p>
            
            <p className="flex items-center">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              <span>Location: </span>
              <span className="ml-1 font-medium">{(item as Event).location}</span>
            </p>
            
            <p className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1.5" />
              <span>Organizer: </span>
              <span className="ml-1 font-medium">{(item as Event).organizer}</span>
            </p>
            
            {(item as Event).link && (
              <p className="flex items-center">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                <a 
                  href={(item as Event).link} 
                  className="ml-1 font-medium text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Event Website
                </a>
              </p>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              {type === 'project' ? 
                ((item as Project).creator?.name?.charAt(0) || 'U') : 
                type === 'gig' ? 
                  ((item as Gig).poster?.name?.charAt(0) || 'U') : 
                  (item as Event).organizer?.charAt(0) || 'O'}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {type === 'project' ? 
              ((item as Project).creator?.name) : 
              type === 'gig' ? 
                ((item as Gig).poster?.name) : 
                (item as Event).organizer}
          </span>
        </div>
        
        {onApply && (
          <Button 
            variant="default" 
            size="sm"
            onClick={() => onApply(item.id)}
            className="text-xs py-1 h-7"
          >
            {type === 'project' ? 'Join Project' : 
             type === 'gig' ? ((item as Gig).gig_type === 'offering' ? 'Request Help' : 'Offer Help') : 
             'Register'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
