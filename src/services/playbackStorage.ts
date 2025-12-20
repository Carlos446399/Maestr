// Local storage for playback progress
const PROGRESS_KEY = "streamtv_playback_progress";

export interface PlaybackProgress {
  contentId: number;
  episodeId?: number;
  progress: number; // percentage 0-100
  currentTime: number; // in seconds
  duration: number; // in seconds
  timestamp: number; // when saved
  contentName: string;
  contentCapa: string;
  contentTipo: string;
  season?: number;
  episode?: number;
}

export const playbackStorage = {
  getAll(): PlaybackProgress[] {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  get(contentId: number, episodeId?: number): PlaybackProgress | null {
    const all = this.getAll();
    return all.find((p) => 
      p.contentId === contentId && 
      (episodeId ? p.episodeId === episodeId : !p.episodeId)
    ) || null;
  },

  save(progress: PlaybackProgress): void {
    const all = this.getAll();
    const existingIndex = all.findIndex((p) => 
      p.contentId === progress.contentId && 
      (progress.episodeId ? p.episodeId === progress.episodeId : !p.episodeId)
    );

    if (existingIndex >= 0) {
      all[existingIndex] = progress;
    } else {
      all.unshift(progress);
    }

    // Keep only last 50 items
    const trimmed = all.slice(0, 50);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(trimmed));
  },

  remove(contentId: number, episodeId?: number): void {
    const all = this.getAll();
    const filtered = all.filter((p) => 
      !(p.contentId === contentId && 
        (episodeId ? p.episodeId === episodeId : !p.episodeId))
    );
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(filtered));
  },

  getContinueWatching(): PlaybackProgress[] {
    const all = this.getAll();
    // Return items with progress > 5% and < 95%
    return all.filter((p) => p.progress > 5 && p.progress < 95)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);
  },
};
