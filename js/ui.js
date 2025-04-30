import { getWatchlist } from './storage.js';
import { handleAddToWatchlist } from './searchPageController.js';
import { handleRemoveFromWatchlist } from './watchlistPageController.js';

function getSearchInput() {
  const searchForm = document.getElementById("search-form");
  const searchFormData = new FormData(searchForm);
  const searchInput = searchFormData.get("search-input").trim();

  return searchInput;
}

function displayNoResults() {
  let noResultsContainer = document.createElement("div");
  noResultsContainer.classList.add("no-results-container");
  let messageElement = document.createElement("p");
  messageElement.textContent = "Unable to find what you're looking for. Please try another search.";
  noResultsContainer.appendChild(messageElement);

  const moviesContainer = document.getElementById("movies-container");
  moviesContainer.innerHTML = "";

  moviesContainer.append(noResultsContainer);
}

function displayMovies(movies) {
  const movieElements = movies.map((movie) => {
  const movieElement = document.createElement("div");
  movieElement.classList.add("movie-el");

  const posterContainer = document.createElement("div");
  const poster = document.createElement("img");
  poster.classList.add("movie-poster");
  poster.src = movie.Poster;
  poster.onerror = () => {
    poster.src = "";
    posterContainer.classList.add("missing-movie-poster");
    posterContainer.textContent = "No poster found";
  };
  posterContainer.appendChild(poster);

  const movieTitle = document.createElement("h2");
  movieTitle.textContent = movie.Title;
  movieTitle.classList.add("movie-title");

  const movieRatingIcon = document.createElement("i");
  movieRatingIcon.classList.add("movie-rating-icon", "fa-solid", "fa-star");

  const movieRating = document.createElement("p");
  movieRating.textContent = movie.imdbRating;
  movieRating.classList.add("movie-rating");

  const movieInfoContainer = document.createElement("div");
  movieInfoContainer.classList.add("movie-info-container");

  const titleAndRatingContainer = document.createElement("div");
  titleAndRatingContainer.classList.add("title-and-rating-container");
  titleAndRatingContainer.appendChild(movieTitle);
  titleAndRatingContainer.appendChild(movieRatingIcon);
  titleAndRatingContainer.appendChild(movieRating);

  const movieRuntime = document.createElement("p");
  movieRuntime.textContent = movie.Runtime;
  movieRuntime.classList.add("movie-runtime");

  const movieGenres = document.createElement("p");
  movieGenres.textContent = movie.Genre;
  movieGenres.classList.add("movie-genres");

  const addToWatchlistContainer = document.createElement("div");
  addToWatchlistContainer.classList.add("add-to-watchlist-container");

  const iconContainer = document.createElement("div");
  iconContainer.classList.add("icon-container");

  const addToWatchlistIcon = document.createElement("i");
  addToWatchlistIcon.classList.add("add-icon", "fa-solid", "fa-plus");
  iconContainer.append(addToWatchlistIcon);

  const addToWatchlistBtn = document.createElement("p");
  addToWatchlistBtn.classList.add("add-or-remove-btn");
  addToWatchlistBtn.textContent = "Watchlist";
  
  const moviesOnWatchlist = getWatchlist();
  // Is movie is already on watchlist? If so, remove event listener & use different class.
  const contains = moviesOnWatchlist.some(item => item.imdbID === movie.imdbID);
  if (contains === true) {
    addToWatchlistContainer.classList.add("disabled-watchlist-container");
    addToWatchlistContainer.classList.remove("add-to-watchlist-container");
    addToWatchlistBtn.classList.add("disabled-add-button");
    iconContainer.classList.add("disabled-icon-container");
  } else {
    addToWatchlistContainer.addEventListener("click", () => handleAddToWatchlist(movie, movies));
  }

  addToWatchlistContainer.appendChild(iconContainer);
  addToWatchlistContainer.appendChild(addToWatchlistBtn);

  const runtimeGenresAndAddBtnContainer = document.createElement("div");
  runtimeGenresAndAddBtnContainer.classList.add("runtime-genres-and-add-btn-container");
  runtimeGenresAndAddBtnContainer.appendChild(movieRuntime);
  runtimeGenresAndAddBtnContainer.appendChild(movieGenres);

  runtimeGenresAndAddBtnContainer.appendChild(addToWatchlistContainer);

  const moviePlot = document.createElement("p");
  moviePlot.textContent = movie.Plot;
  moviePlot.classList.add("movie-plot");

  movieInfoContainer.appendChild(titleAndRatingContainer);
  movieInfoContainer.appendChild(runtimeGenresAndAddBtnContainer);
  movieInfoContainer.appendChild(moviePlot);

  movieElement.appendChild(posterContainer);
  movieElement.appendChild(movieInfoContainer);

  return movieElement;
})

  // Append results to container.
  const moviesContainer = document.getElementById("movies-container");
  moviesContainer.innerHTML = "";
  moviesContainer.append(...movieElements);
}

// function to display stored movies (watchlist.html)
function displayWatchlist(movies) {
  const movieElements = movies.map((movie, index) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie-el");

    const movieInfoContainer = document.createElement("div");
    movieInfoContainer.classList.add("movie-info-container");

    const posterContainer = document.createElement("div");
    const poster = document.createElement("img");
    poster.classList.add("movie-poster");
    poster.src = movie.Poster;
    posterContainer.appendChild(poster);

    const movieTitle = document.createElement("h2");
    movieTitle.textContent = movie.Title;
    movieTitle.classList.add("movie-title");


    const movieRatingIcon = document.createElement("i");
    movieRatingIcon.classList.add("movie-rating-icon", "fa-solid", "fa-star");

    const movieRating = document.createElement("p");
    movieRating.textContent = movie.imdbRating;
    movieRating.classList.add("movie-rating");

    const titleAndRatingContainer = document.createElement("div");
    titleAndRatingContainer.classList.add("title-and-rating-container");
    titleAndRatingContainer.appendChild(movieTitle);
    titleAndRatingContainer.appendChild(movieRatingIcon);
    titleAndRatingContainer.appendChild(movieRating);

    const movieRuntime = document.createElement("p");
    movieRuntime.textContent = movie.Runtime;
    movieRuntime.classList.add("movie-runtime");

    const movieGenres = document.createElement("p");
    movieGenres.textContent = movie.Genre;
    movieGenres.classList.add("movie-genres");

    const removeFromWatchlistContainer = document.createElement("div");
    removeFromWatchlistContainer.classList.add("remove-from-watchlist-container");
    removeFromWatchlistContainer.addEventListener("click", () => handleRemoveFromWatchlist(index));

    const iconContainer = document.createElement("div");
    iconContainer.classList.add("icon-container");
    const removeFromWatchlistIcon = document.createElement("i");
    removeFromWatchlistIcon.classList.add("remove-icon", "fa-solid", "fa-minus");

    iconContainer.append(removeFromWatchlistIcon);
    removeFromWatchlistContainer.append(iconContainer);

    const removeFromWatchlistBtn = document.createElement("p");
    removeFromWatchlistBtn.textContent = "Remove";
    removeFromWatchlistBtn.classList.add("add-or-remove-btn");
    removeFromWatchlistContainer.append(removeFromWatchlistBtn);

    const runtimeGenresAndAddBtnContainer = document.createElement("div");
    runtimeGenresAndAddBtnContainer.classList.add("runtime-genres-and-add-btn-container");
    runtimeGenresAndAddBtnContainer.appendChild(movieRuntime);
    runtimeGenresAndAddBtnContainer.appendChild(movieGenres);
    runtimeGenresAndAddBtnContainer.appendChild(movieGenres);
    runtimeGenresAndAddBtnContainer.appendChild(removeFromWatchlistContainer);

    const moviePlot = document.createElement("p");
    moviePlot.textContent = movie.Plot;
    moviePlot.classList.add("movie-plot");

    movieInfoContainer.appendChild(titleAndRatingContainer);
    movieInfoContainer.appendChild(runtimeGenresAndAddBtnContainer);
    movieInfoContainer.appendChild(moviePlot);

    movieElement.appendChild(posterContainer);
    movieElement.appendChild(movieInfoContainer);

    return movieElement;
  })

  // Append results to container.
  const moviesContainer = document.getElementById("movies-container");
  moviesContainer.innerHTML = "";
  moviesContainer.append(...movieElements);
}

function displayLoading(state) {
  let containerEl = document.getElementById("movies-container");
  containerEl.innerHTML = "";

  if (state === true) {
    containerEl.classList.add("before-search");

    const loadingIcon = document.createElement("i");
    loadingIcon.classList.add("fa-solid", "fa-hourglass-start");

    const loadingEl = document.createElement("p");
    loadingEl.textContent = "Searching for movies.";

    containerEl.appendChild(loadingIcon);
    containerEl.appendChild(loadingEl);

    for (let i = 1; i < 30; i++) {
      setTimeout(function() {
        if (loadingEl.textContent === "Searching for movies.") {
          loadingEl.textContent = "Searching for movies..";
          loadingIcon.className = "";
          loadingIcon.classList.add("fa-solid", "fa-hourglass-half");
        } else if (loadingEl.textContent === "Searching for movies..") {
          loadingEl.textContent = "Searching for movies...";
          loadingIcon.className = "";
          loadingIcon.classList.add("fa-solid", "fa-hourglass-end");
        } else if (loadingEl.textContent === "Searching for movies...") {
          loadingEl.textContent = "Searching for movies.";
          loadingIcon.className = "";
          loadingIcon.classList.add("fa-solid", "fa-hourglass-start");
        }
      }, i * 1000);
    }

  } else {
    containerEl.classList.remove("before-search");
  }
}

export { getSearchInput, displayNoResults, displayMovies, handleAddToWatchlist, displayWatchlist, displayLoading }