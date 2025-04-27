
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Calendar, Clock, ExternalLink, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project, Gig, Event } from '@/hooks/use-supabase-data';

export interface CardItemProps {
  item?: Project | Gig | Event;
  id?: string; // Add id as an optional prop
  type: 'project' | 'gig' | 'hackathon' | 'event' | 'scholarship'; // Add 'scholarship' type
  title?: string;
  description?: string;
  tags?: string[];
  creator?: { name?: string; avatar?: string };
  detailsUrl?: string;
  metadata?: { icon: React.ReactNode; value: string }[];
  actionLabel?: string;
  onAction?: (id: string) => void;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
  bookmarked?: boolean; // For compatibility with some components
}

export function CardItem({ 
  item, 
  id, 
  type, 
  title, 
  description, 
  tags, 
  creator, 
  detailsUrl, 
  metadata, 
  actionLabel, 
  onAction, 
  onBookmark, 
  isBookmarked = false,
  bookmarked = false
}: CardItemProps) {
  
  // Use either provided props or extract from item
  const itemId = id || (item?.id);
  const itemTitle = title || (item?.title);
  const itemDescription = description || (item?.description);
  const itemTags = tags || (
    type === 'project' 
      ? (item as Project)?.skill_tags || (item as Project)?.tags || [] 
      : (item as Gig | Event)?.tags || []
  );
  const isBookmarkedValue = isBookmarked || bookmarked;
  
  // Helpers for rendering different card types
  const getCardBadgeColor = () => {
    switch (type) {
      case 'project':
        return 'bg-blue-100 text-blue-800';
      case 'gig':
        if ((item as Gig)?.gig_type === 'offering') return 'bg-emerald-100 text-emerald-800';
        return 'bg-purple-100 text-purple-800';
      case 'hackathon':
      case 'event':
        return 'bg-amber-100 text-amber-800';
      case 'scholarship':
        return 'bg-indigo-100 text-indigo-800';
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
      case 'scholarship':
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
        return (item as Gig)?.gig_type === 'offering' ? 'Skill Offered' : 'Skill Wanted';
      case 'hackathon':
        return 'Hackathon';
      case 'event':
        return 'Event';
      case 'scholarship':
        return 'Scholarship';
      default:
        return '';
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
            {isBookmarkedValue && (
              <Badge variant="outline" className="font-normal">Bookmarked</Badge>
            )}
          </div>
          
          {onBookmark && (
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("h-8 w-8", isBookmarkedValue ? "text-amber-500" : "text-muted-foreground")}
              onClick={() => onBookmark(itemId || "")}
              aria-label={isBookmarkedValue ? "Remove bookmark" : "Bookmark"}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <CardTitle className="text-xl line-clamp-2">{itemTitle}</CardTitle>
        <CardDescription className="line-clamp-2">{itemDescription}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {itemTags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {itemTags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{itemTags.length - 3} more
            </Badge>
          )}
        </div>
        
        {/* Metadata display */}
        {metadata && metadata.length > 0 && (
          <div className="space-y-2 text-sm text-muted-foreground">
            {metadata.map((meta, index) => meta && (
              <p key={index} className="flex items-center">
                {meta.icon && <span className="mr-1.5">{meta.icon}</span>}
                <span className="font-medium">{meta.value}</span>
              </p>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              {creator?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {creator?.name || 'Unknown'}
          </span>
        </div>
        
        {(onAction || detailsUrl) && (
          <Button 
            variant="default" 
            size="sm"
            onClick={() => onAction && onAction(itemId || "")}
            className="text-xs py-1 h-7"
            {...(detailsUrl ? { 
              as: 'a', 
              href: detailsUrl,
              target: "_blank",
              rel: "noopener noreferrer"
            } : {})}
          >
            {actionLabel || (
              type === 'project' ? 'Join Project' : 
              type === 'gig' ? ((item as Gig)?.gig_type === 'offering' ? 'Request Help' : 'Offer Help') : 
              'View Details'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
