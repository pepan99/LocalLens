"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  ChevronLeft,
  ExternalLink,
  Globe,
  Heart,
  ImageIcon,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  Share,
  Star,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Mock data for a place
const MOCK_PLACE = {
  id: "1",
  name: "Impact Hub Brno",
  category: "Coworking Space",
  address: "Cyrilská 7, 602 00 Brno, Czech Republic",
  coordinates: [49.1924, 16.6124],
  rating: 4.7,
  reviewCount: 28,
  description:
    "Impact Hub Brno is a coworking space and innovation center located in the heart of Brno. It offers a productive and inspiring environment for freelancers, startups, and established businesses. The space features private offices, dedicated desks, and flexible workspace options, as well as meeting rooms and event spaces.",
  website: "https://www.hubbrno.cz",
  phone: "+420 123 456 789",
  email: "info@hubbrno.cz",
  openingHours: [
    { day: "Monday", hours: "8:00 - 20:00" },
    { day: "Tuesday", hours: "8:00 - 20:00" },
    { day: "Wednesday", hours: "8:00 - 20:00" },
    { day: "Thursday", hours: "8:00 - 20:00" },
    { day: "Friday", hours: "8:00 - 18:00" },
    { day: "Saturday", hours: "10:00 - 16:00" },
    { day: "Sunday", hours: "Closed" },
  ],
  amenities: [
    "WiFi",
    "Coffee",
    "Meeting Rooms",
    "Event Space",
    "Kitchen",
    "Accessible",
  ],
  images: [
    "/placeholder-place-1.jpg",
    "/placeholder-place-2.jpg",
    "/placeholder-place-3.jpg",
  ],
  upcomingEvents: [
    {
      id: "e1",
      title: "Tech Meetup",
      date: "2025-05-10T18:00:00",
      attendees: 24,
    },
    {
      id: "e2",
      title: "Startup Weekend",
      date: "2025-05-15T09:00:00",
      attendees: 46,
    },
  ],
};

// Mock data for reviews
const MOCK_REVIEWS = [
  {
    id: "r1",
    userId: "u1",
    username: "Marie Novotná",
    userImage: "/placeholder-user-1.jpg",
    rating: 5,
    date: "2025-04-28T10:23:00",
    content:
      "Amazing workspace with a friendly community! The facilities are top-notch and the coffee is excellent. I love coming here to work and meet other professionals.",
    likes: 7,
    dislikes: 0,
  },
  {
    id: "r2",
    userId: "u2",
    username: "Jan Svoboda",
    userImage: "/placeholder-user-2.jpg",
    rating: 4,
    date: "2025-04-15T14:45:00",
    content:
      "Great location and atmosphere. The WiFi is reliable and fast. The only downside is that it can get a bit crowded during peak hours. Otherwise, it's my go-to place for productive work days.",
    likes: 5,
    dislikes: 1,
  },
  {
    id: "r3",
    userId: "u3",
    username: "Eva Dvořáková",
    userImage: "/placeholder-user-3.jpg",
    rating: 5,
    date: "2025-04-10T09:17:00",
    content:
      "I've been a member for 3 months and I'm very satisfied. The community events are insightful and offer great networking opportunities. The staff is always helpful and accommodating.",
    likes: 9,
    dislikes: 0,
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatEventDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PlaceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { placeId } = params;

  const [isAddReviewDialogOpen, setIsAddReviewDialogOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [place, _setPlace] = useState(MOCK_PLACE);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [isFavorite, setIsFavorite] = useState(false);

  // In a real app, we would fetch the place data from an API
  useEffect(() => {
    // Simulating API call
    console.log(`Fetching place with ID: ${placeId}`);
    // setPlace(fetchedPlace);
    // setReviews(fetchedReviews);
  }, [placeId]);

  const handleAddReview = () => {
    if (rating === 0 || !reviewText.trim()) return;

    const newReview = {
      id: `r${reviews.length + 1}`,
      userId: "current-user",
      username: "You",
      userImage: "/placeholder-user.jpg",
      rating,
      date: new Date().toISOString(),
      content: reviewText,
      likes: 0,
      dislikes: 0,
    };

    setReviews([newReview, ...reviews]);
    setReviewText("");
    setRating(0);
    setIsAddReviewDialogOpen(false);
  };

  const handleLikeReview = (reviewId: string) => {
    setReviews(
      reviews.map(review =>
        review.id === reviewId
          ? { ...review, likes: review.likes + 1 }
          : review,
      ),
    );
  };

  const handleDislikeReview = (reviewId: string) => {
    setReviews(
      reviews.map(review =>
        review.id === reviewId
          ? { ...review, dislikes: review.dislikes + 1 }
          : review,
      ),
    );
  };

  // const calculateAverageRating = () => {
  //   const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  //   return total / reviews.length;
  // };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // 5 stars, 4 stars, etc.

    reviews.forEach(review => {
      distribution[5 - review.rating]++;
    });

    return distribution;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
        {/* Header Section */}
        <div className="relative">
          <div className="h-48 bg-gray-200 relative">
            {place.images && place.images.length > 0 && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${place.images[0]})` }}
              >
                <div className="absolute inset-0 bg-black opacity-30" />
              </div>
            )}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 hover:bg-white"
                onClick={() => router.push("/map")}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 hover:bg-white"
                  onClick={() => {
                    /* Share functionality */
                  }}
                >
                  <Share className="h-4 w-4" />
                </Button>
                <Button
                  variant={isFavorite ? "default" : "outline"}
                  size="sm"
                  className={isFavorite ? "" : "bg-white/80 hover:bg-white"}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={`h-4 w-4 ${isFavorite ? "fill-white" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start flex-wrap">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">{place.name}</h1>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{place.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{place.category}</Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium">{place.rating}</span>
                    <span className="text-gray-500 ml-1">
                      ({place.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 space-x-2">
                <Button>RSVP to Event</Button>
                <Button variant="outline" asChild>
                  <Link href={`/events/create?placeId=${place.id}`}>
                    Create Event
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="about" className="px-6 pb-6">
          <TabsList className="mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-2">Description</h2>
                  <p className="text-gray-700">{place.description}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-2">Amenities</h2>
                  <div className="flex flex-wrap gap-2">
                    {place.amenities.map(amenity => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-medium mb-2">Location</h2>
                  <div className="h-48 rounded-md bg-gray-200 overflow-hidden">
                    {/* In a real app, this would be a map component showing the place location */}
                    <div className="h-full flex items-center justify-center">
                      <p className="text-gray-500">Map placeholder</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="p-4">
                  <h2 className="text-lg font-medium mb-2">
                    Contact Information
                  </h2>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{place.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{place.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 mr-2 text-gray-500" />
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        Visit website
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h2 className="text-lg font-medium mb-2">Opening Hours</h2>
                  <div className="space-y-1">
                    {place.openingHours.map(item => (
                      <div
                        key={item.day}
                        className="flex justify-between text-sm"
                      >
                        <span className="font-medium">{item.day}</span>
                        <span className="text-gray-700">{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Upcoming Events</h2>
              <Button variant="outline" asChild>
                <Link href={`/events/create?placeId=${place.id}`}>
                  Create Event
                </Link>
              </Button>
            </div>

            {place.upcomingEvents && place.upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {place.upcomingEvents.map(event => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="p-4">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatEventDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{event.attendees} attending</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex justify-end">
                      <Button size="sm" asChild>
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No upcoming events</h3>
                <p className="mt-1 text-gray-500">
                  Be the first to create an event at this place
                </p>
                <Button className="mt-4" asChild>
                  <Link href={`/events/create?placeId=${place.id}`}>
                    Create Event
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-medium">Reviews</h2>
                <p className="text-gray-500">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>
              <Button onClick={() => setIsAddReviewDialogOpen(true)}>
                Write a Review
              </Button>
            </div>

            {reviews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{place.rating}</span>
                    <div className="space-y-1">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.round(place.rating)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">
                        Based on {reviews.length} reviews
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Rating Distribution
                  </h3>
                  <div className="space-y-1">
                    {getRatingDistribution().map((count, index) => (
                      <div key={5 - index} className="flex items-center gap-2">
                        <span className="text-xs w-6">{5 - index} ★</span>
                        <div className="h-2 bg-gray-200 rounded-full flex-1 overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 rounded-full"
                            style={{
                              width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs w-6 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.userImage} />
                          <AvatarFallback>
                            {review.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{review.username}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(review.date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700">{review.content}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <button
                          className="flex items-center text-gray-500 hover:text-gray-700"
                          onClick={() => handleLikeReview(review.id)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span className="text-xs">{review.likes}</span>
                        </button>
                        <button
                          className="flex items-center text-gray-500 hover:text-gray-700"
                          onClick={() => handleDislikeReview(review.id)}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          <span className="text-xs">{review.dislikes}</span>
                        </button>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Report Review</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Star className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No reviews yet</h3>
                  <p className="mt-1 text-gray-500">
                    Be the first to review this place
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setIsAddReviewDialogOpen(true)}
                  >
                    Write a Review
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Photos</h2>
              <Button variant="outline">Upload Photos</Button>
            </div>

            {place.images && place.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {place.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-200 rounded-md overflow-hidden"
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${image})` }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium">No photos yet</h3>
                <p className="mt-1 text-gray-500">
                  Be the first to upload photos of this place
                </p>
                <Button className="mt-4" variant="outline">
                  Upload Photos
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Review Dialog */}
      <Dialog
        open={isAddReviewDialogOpen}
        onOpenChange={setIsAddReviewDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience at {place.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">Rating</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="review" className="text-sm font-medium">
                Review
              </label>
              <Textarea
                id="review"
                placeholder="Share details about your experience at this place..."
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddReviewDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddReview}
              disabled={rating === 0 || !reviewText.trim()}
            >
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaceDetailPage;
