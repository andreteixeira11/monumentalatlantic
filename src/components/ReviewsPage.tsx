import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { Star, Search, Filter, TrendingUp, User, Calendar } from "lucide-react";

interface Review {
  id: string;
  guestName: string;
  platform: "booking" | "airbnb";
  property: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  response?: string;
}

const mockReviews: Review[] = [
  {
    id: "REV-001",
    guestName: "Maria Silva",
    platform: "booking",
    property: "Apartamento Centro Porto",
    rating: 5,
    title: "Excelente estadia!",
    comment: "O apartamento estava impecável e a localização é perfeita. O anfitrião foi muito atencioso e prestável. Recomendo vivamente!",
    date: "2024-12-10",
    response: "Muito obrigado pela sua avaliação, Maria! Foi um prazer recebê-la."
  },
  {
    id: "REV-002",
    guestName: "João Santos",
    platform: "airbnb",
    property: "Casa Vila Nova de Gaia",
    rating: 4,
    title: "Muito boa experiência",
    comment: "Casa muito confortável e bem equipada. A vista para o rio é fantástica. Apenas o check-in poderia ter sido mais rápido.",
    date: "2024-12-08"
  },
  {
    id: "REV-003",
    guestName: "Ana Costa",
    platform: "booking",
    property: "Loft Ribeira",
    rating: 5,
    title: "Perfeito!",
    comment: "Localização excepcional na Ribeira. O loft é moderno e tem tudo o que é necessário. Voltarei certamente!",
    date: "2024-12-05",
    response: "Obrigado Ana! Será sempre bem-vinda de volta."
  },
  {
    id: "REV-004",
    guestName: "Pedro Oliveira",
    platform: "airbnb",
    property: "Apartamento Centro Porto",
    rating: 3,
    title: "Experiência OK",
    comment: "O apartamento é bom mas o ruído da rua foi um pouco incómodo durante a noite. No geral foi uma estadia aceitável.",
    date: "2024-12-03"
  },
  {
    id: "REV-005",
    guestName: "Carla Fernandes",
    platform: "booking",
    property: "Casa Vila Nova de Gaia",
    rating: 5,
    title: "Fantástico!",
    comment: "Tudo perfeito! A casa é lindíssima, muito limpa e bem decorada. O jardim é um bónus fantástico. Recomendo 100%!",
    date: "2024-12-01",
    response: "Muito obrigado Carla! Ficamos felizes que tenha gostado tanto."
  }
];

export const ReviewsPage = () => {
  const [reviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [platformFilter, setPlatformFilter] = useState<"all" | "booking" | "airbnb">("all");

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "booking":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "airbnb":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === null || review.rating === ratingFilter;
    const matchesPlatform = platformFilter === "all" || review.platform === platformFilter;
    
    return matchesSearch && matchesRating && matchesPlatform;
  });

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const recentReviews = reviews.filter(review => {
    const reviewDate = new Date(review.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return reviewDate >= thirtyDaysAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">Avaliações dos hóspedes das suas propriedades</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avaliação Média
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex items-center space-x-1 mt-1">
              {renderStars(Math.round(averageRating))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Reviews
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Todas as plataformas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reviews Recentes
            </CardTitle>
            <Calendar className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentReviews}</div>
            <p className="text-xs text-success mt-1">
              Últimos 30 dias
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Procurar reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={platformFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlatformFilter("all")}
              >
                Todas
              </Button>
              <Button
                variant={platformFilter === "booking" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlatformFilter("booking")}
              >
                Booking.com
              </Button>
              <Button
                variant={platformFilter === "airbnb" ? "default" : "outline"}
                size="sm"
                onClick={() => setPlatformFilter("airbnb")}
              >
                Airbnb
              </Button>
            </div>
            
            <div className="flex gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating}
                  variant={ratingFilter === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
                >
                  {rating} ⭐
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Reviews dos Hóspedes</CardTitle>
          <CardDescription>
            {filteredReviews.length} review(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Não foram encontradas reviews</p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 rounded-lg border bg-card space-y-4"
                >
                  {/* Review Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{review.guestName}</div>
                        <div className="text-sm text-muted-foreground">{review.property}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className={getPlatformColor(review.platform)}>
                        {review.platform === "booking" ? "Booking.com" : "Airbnb"}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString('pt-PT')}
                      </div>
                    </div>
                  </div>

                  {/* Rating and Title */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                      <span className="font-medium text-sm">({review.rating}/5)</span>
                    </div>
                    <h3 className="font-semibold text-lg">{review.title}</h3>
                  </div>

                  {/* Comment */}
                  <div className="text-muted-foreground">
                    <p>{review.comment}</p>
                  </div>

                  {/* Response */}
                  {review.response && (
                    <div className="bg-accent/50 p-4 rounded-lg border-l-4 border-primary">
                      <div className="text-sm font-medium text-primary mb-2">Resposta do Anfitrião:</div>
                      <p className="text-sm">{review.response}</p>
                    </div>
                  )}

                  {/* Action Button */}
                  {!review.response && (
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Responder
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};