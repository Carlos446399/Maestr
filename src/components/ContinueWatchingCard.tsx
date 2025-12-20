import { PlaybackProgress } from "@/services/playbackStorage";
import { Play } from "lucide-react";

interface ContinueWatchingCardProps {
  progress: PlaybackProgress;
  onClick: () => void;
}

const ContinueWatchingCard = ({ progress, onClick }: ContinueWatchingCardProps) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const remainingTime = progress.duration - progress.currentTime;

  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-64 group tv-focus rounded-xl overflow-hidden bg-card border border-border/30 hover:border-primary/50 transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={progress.contentCapa || "/placeholder.svg"}
          alt={progress.contentName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-primary/90 backdrop-blur flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress.progress}%` }}
          />
        </div>

        {/* Remaining Time */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 text-xs font-medium bg-background/80 backdrop-blur rounded text-foreground">
          {formatTime(remainingTime)} restantes
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm truncate mb-1 group-hover:text-primary transition-colors">
          {progress.contentName}
        </h3>
        {progress.episodeId && (
          <p className="text-xs text-muted-foreground">
            T{progress.season} E{progress.episode}
          </p>
        )}
        {!progress.episodeId && (
          <p className="text-xs text-muted-foreground">{progress.contentTipo}</p>
        )}
      </div>
    </button>
  );
};

export default ContinueWatchingCard;
