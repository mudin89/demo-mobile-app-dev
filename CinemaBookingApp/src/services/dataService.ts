import {Movie, Review, FoodItem, Cinema} from '../types';

// Import local JSON data
import moviesData from '../data/movies.json';
import reviewsData from '../data/reviews.json';
import foodData from '../data/food.json';
import cinemasData from '../data/cinemas.json';

class DataService {
  // Movies
  async getMovies(): Promise<Movie[]> {
    console.log(
      '📽️ Loading movies from local JSON...',
      moviesData.length,
      'movies found',
    );
    return moviesData as Movie[];
  }

  async getMovieById(id: string): Promise<Movie | null> {
    console.log('🎬 Loading movie by ID:', id);
    const movie = (moviesData.find(movie => movie.id === id) as Movie) || null;
    console.log('🎬 Movie found:', movie ? movie.title : 'Not found');
    return movie;
  }

  async searchMovies(query: string): Promise<Movie[]> {
    console.log('🔍 Searching movies with query:', query);
    const filteredMovies = moviesData.filter(
      movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.casts.some(cast =>
          cast.toLowerCase().includes(query.toLowerCase()),
        ) ||
        movie.directors.some(director =>
          director.toLowerCase().includes(query.toLowerCase()),
        ),
    ) as Movie[];
    console.log('🔍 Search results:', filteredMovies.length, 'movies found');
    return filteredMovies;
  }

  // Reviews
  async getMovieReviews(movieId: string): Promise<Review[]> {
    console.log('⭐ Loading reviews for movie:', movieId);
    const reviews = reviewsData.filter(
      review => review.movieId === movieId,
    ) as Review[];
    console.log('⭐ Reviews found:', reviews.length, 'reviews');
    return reviews;
  }

  async getAllReviews(): Promise<Review[]> {
    console.log(
      '⭐ Loading all reviews...',
      reviewsData.length,
      'reviews found',
    );
    return reviewsData as Review[];
  }

  // Food & Beverages
  async getFoodItems(): Promise<FoodItem[]> {
    console.log(
      '🍿 Loading food items from local JSON...',
      foodData.length,
      'items found',
    );
    return foodData as FoodItem[];
  }

  async getFoodItemsByCategory(category: string): Promise<FoodItem[]> {
    console.log('🍿 Loading food items by category:', category);
    const filteredItems = foodData.filter(
      item => item.category.toLowerCase() === category.toLowerCase(),
    ) as FoodItem[];
    console.log('🍿 Items found:', filteredItems.length, 'items');
    return filteredItems;
  }

  async getFoodItemById(id: string): Promise<FoodItem | null> {
    console.log('🍿 Loading food item by ID:', id);
    const item = (foodData.find(item => item.id === id) as FoodItem) || null;
    console.log('🍿 Food item found:', item ? item.name : 'Not found');
    return item;
  }

  // Cinemas
  async getCinemas(): Promise<Cinema[]> {
    console.log(
      '🏢 Loading cinemas from local JSON...',
      cinemasData.length,
      'cinemas found',
    );
    return cinemasData as Cinema[];
  }

  async getCinemaById(id: string): Promise<Cinema | null> {
    console.log('🏢 Loading cinema by ID:', id);
    const cinema =
      (cinemasData.find(cinema => cinema.id === id) as Cinema) || null;
    console.log('🏢 Cinema found:', cinema ? cinema.name : 'Not found');
    return cinema;
  }

  async getCinemasByMovie(movieId: string): Promise<Cinema[]> {
    console.log('🏢 Loading cinemas showing movie:', movieId);
    const cinemas = cinemasData.filter(cinema =>
      cinema.availableMovies.includes(movieId),
    ) as Cinema[];
    console.log('🏢 Cinemas found:', cinemas.length, 'cinemas');
    return cinemas;
  }

  async getMoviesByCinema(cinemaId: string): Promise<Movie[]> {
    console.log('🏢 Loading movies for cinema:', cinemaId);
    const cinema = cinemasData.find(c => c.id === cinemaId);

    if (!cinema) {
      console.log('🏢 Cinema not found');
      return [];
    }

    const movies = moviesData.filter(movie =>
      cinema.availableMovies.includes(movie.id),
    ) as Movie[];
    console.log('🏢 Movies found:', movies.length, 'movies');
    return movies;
  }

  // Mock movie sessions (since we don't have a sessions.json yet)
  async getMovieSessions(movieId: string, cinemaId?: string): Promise<any[]> {
    console.log(
      '🎫 Generating mock sessions for movie:',
      movieId,
      'at cinema:',
      cinemaId,
    );

    // Generate mock sessions for the next 7 days
    const sessions = [];
    const today = new Date();

    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() + day);

      // Generate 3-4 sessions per day
      const times = ['10:00', '14:30', '18:00', '21:30'];

      times.forEach((time, index) => {
        const sessionDate = new Date(date);
        const [hours, minutes] = time.split(':');
        sessionDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        // Calculate end time (assuming 2.5 hour movie duration)
        const endTime = new Date(sessionDate);
        endTime.setHours(endTime.getHours() + 2, endTime.getMinutes() + 30);

        sessions.push({
          id: `session-${movieId}-${day}-${index}`,
          movieId,
          cinemaId: cinemaId || 'cinema-1',
          hallId: `${Math.floor(Math.random() * 5) + 1}`,
          date: sessionDate.toISOString().split('T')[0], // Just the date part
          startTime: sessionDate.toISOString(),
          endTime: endTime.toISOString(),
          price: 18.5, // Standard price matching MovieSession interface
          // Additional fields for display (not part of MovieSession interface)
          time,
          hall: `Hall ${Math.floor(Math.random() * 5) + 1}`,
          priceRange: {
            standard: 18.5,
            premium: 22.5,
          },
          availableSeats: Math.floor(Math.random() * 50) + 100, // Random available seats
        });
      });
    }

    console.log('🎫 Generated sessions:', sessions.length, 'sessions');
    return sessions;
  }
}

export const dataService = new DataService();
