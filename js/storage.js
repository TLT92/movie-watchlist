function getWatchlist() {
  return JSON.parse(localStorage.getItem("movies")) || [];
}

function saveWatchlist(watchlist) {
  localStorage.setItem("movies", JSON.stringify(watchlist));
}

// Function to add movie to watchlist (local storage) via button
function addToWatchlist(movie) {
  const watchlist = getWatchlist();
  watchlist.push(movie);
  saveWatchlist(watchlist);
}

// Function to remove movie from watchlist (local storage) via button
function removeFromWatchlist(index) {
  const watchlist = getWatchlist();
  watchlist.splice(index, 1);
  saveWatchlist(watchlist);
}

export { getWatchlist, addToWatchlist, removeFromWatchlist }