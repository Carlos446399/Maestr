import { Content } from "@/services/baserow";
import { Play, Eye, Heart } from "lucide-react";
import { useState } from "react";

interface ContentCardProps {
  content: Content;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  showProgress?: boolean;
  progress?: number;
}

const ContentCard = ({ 
  content, 
  onClick, 
  isFavorite = false, 
  onToggleFavorite,
  showProgress = false,
  progress = 0,
}: ContentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex-shrink-0 w-full group tv-focus rounded-xl overflow-hidden bg-card border border-border/30 hover:border-primary/50 transition-all duration-300"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={content.Capa || "/placeholder.svg"}
          alt={content.Nome}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full gradient-hero flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(e);
            }}
            className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isFavorite 
                ? "bg-primary text-primary-foreground" 
                : "bg-background/70 text-foreground hover:bg-primary hover:text-primary-foreground"
            } ${isHovered || isFavorite ? "opacity-100" : "opacity-0"}`}
          >
            <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>
        )}

        {/* Type Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs font-medium bg-background/80 backdrop-blur rounded-md text-foreground">
            {content.Tipo}
          </span>
        </div>

        {/* Progress Bar */}
        {showProgress && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm truncate mb-1 group-hover:text-primary transition-colors">
          {content.Nome}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Eye className="w-3 h-3" />
          <span>{typeof content.Views === 'string' ? parseInt(content.Views, 10) || 0 : content.Views?.toLocaleString() || 0} views</span>
        </div>
      </div>
    </button>
  );
};

export default ContentCard;
