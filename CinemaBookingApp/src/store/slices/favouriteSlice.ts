import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Movie} from '../../types';

interface FavouriteState {
  favouriteMovies: Movie[];
}

const initialState: FavouriteState = {
  favouriteMovies: [],
};

export const favouriteSlice = createSlice({
  name: 'favourite',
  initialState,
  reducers: {
    addFavourite: (state, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      const existingIndex = state.favouriteMovies.findIndex(
        m => m.id === movie.id,
      );

      if (existingIndex === -1) {
        state.favouriteMovies.push(movie);
        console.log('💖 FavouriteSlice: Added movie to favourites:', movie.title);
      }
    },
    removeFavourite: (state, action: PayloadAction<string>) => {
      const movieId = action.payload;
      const existingIndex = state.favouriteMovies.findIndex(
        m => m.id === movieId,
      );

      if (existingIndex !== -1) {
        const removedMovie = state.favouriteMovies[existingIndex];
        state.favouriteMovies.splice(existingIndex, 1);
        console.log('💔 FavouriteSlice: Removed movie from favourites:', removedMovie.title);
      }
    },
    toggleFavourite: (state, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      const existingIndex = state.favouriteMovies.findIndex(
        m => m.id === movie.id,
      );

      if (existingIndex === -1) {
        state.favouriteMovies.push(movie);
        console.log('💖 FavouriteSlice: Toggled ON - Added movie to favourites:', movie.title);
      } else {
        state.favouriteMovies.splice(existingIndex, 1);
        console.log('💔 FavouriteSlice: Toggled OFF - Removed movie from favourites:', movie.title);
      }
    },
    clearFavourites: state => {
      state.favouriteMovies = [];
      console.log('🗑️ FavouriteSlice: Cleared all favourites');
    },
  },
});

export const {
  addFavourite,
  removeFavourite,
  toggleFavourite,
  clearFavourites,
} = favouriteSlice.actions;

// Selectors
export const selectFavouriteMovies = (state: {favourite: FavouriteState}) =>
  state.favourite.favouriteMovies;

export const selectIsFavourite = (movieId: string) => (state: {favourite: FavouriteState}) =>
  state.favourite.favouriteMovies.some(movie => movie.id === movieId);

export default favouriteSlice.reducer;