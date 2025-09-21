import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Movie, Review, Cinema, MovieSession} from '../../types';

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.MOVIES_API_BASE_URL,
    prepareHeaders: headers => {
      headers.set('Authorization', `Bearer ${process.env.MOVIES_API_KEY}`);
      return headers;
    },
  }),
  tagTypes: ['Movie', 'Review', 'Cinema', 'Session'],
  endpoints: builder => ({
    getMovies: builder.query<Movie[], {search?: string; location?: string}>({
      query: ({search, location}) => ({
        url: '/movies',
        params: {search, location},
      }),
      providesTags: ['Movie'],
    }),
    getMovieById: builder.query<Movie, string>({
      query: id => `/movies/${id}`,
      providesTags: (result, error, id) => [{type: 'Movie', id}],
    }),
    getMovieReviews: builder.query<Review[], string>({
      query: movieId => `/movies/${movieId}/reviews`,
      providesTags: (result, error, movieId) => [{type: 'Review', id: movieId}],
    }),
    getCinemas: builder.query<Cinema[], void>({
      query: () => '/cinemas',
      providesTags: ['Cinema'],
    }),
    getMovieSessions: builder.query<
      MovieSession[],
      {movieId: string; date: string}
    >({
      query: ({movieId, date}) => ({
        url: `/movies/${movieId}/sessions`,
        params: {date},
      }),
      providesTags: (result, error, {movieId}) => [
        {type: 'Session', id: movieId},
      ],
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useGetMovieReviewsQuery,
  useGetCinemasQuery,
  useGetMovieSessionsQuery,
} = moviesApi;
