import { displayWatchlist } from './ui.js';
import { removeFromWatchlist, getWatchlist } from './storage.js';

function handleRemoveFromWatchlist(movieIndex) {
  removeFromWatchlist(movieIndex);
  const updatedWatchlist = getWatchlist();
  displayWatchlist(updatedWatchlist);
}

function sortMovies(e, sortValue = "Year-ascending") {
  const sortAttribute = sortValue.split("-")[0];
  const sortDirection = sortValue.split("-")[1];

  let watchlistMovies = getWatchlist();
  watchlistMovies.sort((movieA, movieB) => {
    const a = movieA[sortAttribute];
    const b = movieB[sortAttribute];
  
    // Check how we need to sort (numbers or strings, ascending or descending)
    if (typeof a === "number") {
      return sortDirection === "ascending" ? a - b : b - a;
    } else {
      // Use localeCompare for strings (alphabetical sorting)
      return sortDirection === "ascending" 
        ? a.localeCompare(b) 
        : b.localeCompare(a); // Lexicographical sorting
    }
  });

  displayWatchlist(watchlistMovies);
}

export { handleRemoveFromWatchlist, sortMovies } 