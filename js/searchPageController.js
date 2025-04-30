import { fetchMovies, fetchMovieDetails } from './api.js';
import { getSearchInput, displayLoading, displayMovies, displayNoResults } from './ui.js';
import { addToWatchlist } from './storage.js';

async function handleSearchSubmit(event) {
  event.preventDefault();
  const searchInput = getSearchInput();
  // Fetch results from API.
  await fetchAndDisplayMovies(searchInput);
}

function handleAddToWatchlist(movie, movies) {
  addToWatchlist(movie);
  displayMovies(movies);
}

async function fetchAndDisplayMovies(searchInput) {
  // Display loading while fetching.
  displayLoading(true);
  const movies = await fetchMovies(searchInput);
  const moviesWithDetails = [];

  // If there are no results, display that to user.
  if (!movies) {
    displayLoading(false);
    displayNoResults();
  // If there are results, retrieve details for each movie from API.
  } else {
    for (let i = 0; i < movies.length; i++) {
      const movieWithDetails = await fetchMovieDetails(movies[i].imdbID);
      moviesWithDetails.push(movieWithDetails);
    }

    // Remove loading when fetching is done & display movies with details.
    displayLoading(false);
    displayMovies(moviesWithDetails);
  }
}

export { handleSearchSubmit, handleAddToWatchlist, fetchAndDisplayMovies }