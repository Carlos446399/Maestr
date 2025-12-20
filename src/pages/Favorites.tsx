import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Content, contentApi } from "@/services/baserow";
import { Button } from "@/components/ui/button";
import ContentCard from "@/components/ContentCard";
import { ArrowLeft, Heart, Loader2 } from "lucide-react";

const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.Email) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const data = await contentApi.getFavorites(user!.Email);
      setFavorites(data);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentClick = (content: Content) => {
    navigate(`/content/${content.id}`);
  };

  const handleToggleFavorite = async (content: Content, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user?.Email) return;

    try {
      await contentApi.removeFavorite(content.id, content.Favoritos, user.Email);
      setFavorites((prev) => prev.filter((f) => f.id !== content.id));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)} className="tv-focus">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Meus Favoritos</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {favorites.map((content) => (
              <ContentCard
                key={content.id}
                content={content}
                onClick={() => handleContentClick(content)}
                isFavorite={true}
                onToggleFavorite={(e) => handleToggleFavorite(content, e)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-muted-foreground mb-6">
              Adicione filmes e séries aos seus favoritos para encontrá-los facilmente aqui.
            </p>
            <Button variant="hero" onClick={() => navigate("/browse")}>
              Explorar Conteúdos
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
