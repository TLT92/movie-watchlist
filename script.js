// Setup localStorage.
if (JSON.parse(localStorage.getItem("movies")) === null) {
  localStorage.setItem("movies", JSON.stringify([]));
}

const currentPath = window.location.pathname;
console.log(currentPath);
if (currentPath.includes("index")) {
  // function to get search input & add event listener it to search/submit button.
  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", getSearchInput);
};

async function getSearchInput(event) {
  event.preventDefault();

  const searchForm = document.getElementById("search-form");
  const searchFormData = new FormData(searchForm);
  const searchInput = searchFormData.get("search-input").trim();
  
  // Fetch results from API. (Do I need to "await" here? If not, why?)
  await fetchAndDisplayMovies(searchInput)
}

async function fetchAndDisplayMovies(searchInput) {
  const movies = await fetchMovies(searchInput);
  const moviesWithDetails = [];

  console.log(movies);

  // If there are no results, display that to user.
  if (!movies) {
    let noResultsContainer = document.createElement("div");
    noResultsContainer.classList.add("no-results-container");
    let messageElement = document.createElement("p");
    messageElement.textContent = "Unable to find what you're looking for. Please try another search.";
    noResultsContainer.appendChild(messageElement);

    const moviesContainer = document.getElementById("movies-container");
    moviesContainer.innerHTML = "";

    moviesContainer.append(noResultsContainer);
  } else {
    for (let i = 0; i < movies.length; i++) {
      const movieWithDetails = await fetchMovieDetails(movies[i].imdbID);
      moviesWithDetails.push(movieWithDetails);
    }

    displayMovies(moviesWithDetails);
  }
}

// function to fetch data from API
async function fetchMovies(searchInput) {
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=daafd3c&s=${searchInput}&type=movie`);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json(); 
    // Display results.
    return data.Search;

  } catch (error) {
    console.error(error.message);
    console.log(error.message);
  }
}


async function fetchMovieDetails(movieImdbID) {
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=daafd3c&i=${movieImdbID}`);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;

  } catch (error) {
    console.error(error.message);
    console.log(error.message);
  }
}

// function to handle success -> display search result(s)
function displayMovies(movies) {
  const movieElements = movies.map((movie, index) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie-el");

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
    iconContainer.append(addToWatchlistIcon);

    const addToWatchlistBtn = document.createElement("p");
    addToWatchlistBtn.classList.add("add-or-remove-btn");
    if (currentPath.includes("index")) {
      addToWatchlistBtn.textContent = "Watchlist";
      const moviesOnWatchlist = JSON.parse(localStorage.getItem("movies"));

      // Is movie is already on watchlist? If so, remove event listener & use different class.
      const contains = moviesOnWatchlist.some(item => item.imdbID === movie.imdbID);
      if (contains === true) {
        addToWatchlistContainer.classList.add("disabled-watchlist-container")
        addToWatchlistBtn.classList.add("disabled-add-button");
        iconContainer.classList.add("disabled-icon-container");
      } else {
        addToWatchlistContainer.addEventListener("click", () => addToWatchlist(movie, movies));
      }

      addToWatchlistIcon.classList.add("add-icon", "fa-solid", "fa-plus");

    } else {
      addToWatchlistIcon.classList.add("remove-icon", "fa-solid", "fa-minus");

      addToWatchlistBtn.classList.add("add-or-remove-btn");
      addToWatchlistBtn.textContent = "Remove";
      addToWatchlistContainer.addEventListener("click", () => removeFromWatchlist(index)); 
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

  console.log("Generated movie elements:", movieElements);

  // Append results to container.
  const moviesContainer = document.getElementById("movies-container");
  moviesContainer.innerHTML = "";
  moviesContainer.append(...movieElements);
}

// function to handle failure -> tell user there is no movie with that name
// Function to add movie to watchlist (local storage) via button
function addToWatchlist(movie, movies) {
  console.log(movie);
  const moviesOnWatchlist = JSON.parse(localStorage.getItem("movies"));
  moviesOnWatchlist.push(movie);
  localStorage.setItem("movies", JSON.stringify(moviesOnWatchlist));
  console.log(JSON.parse(localStorage.getItem("movies")));
  displayMovies(movies);
}

// Function to remove movie from watchlist (local storage) via button
function removeFromWatchlist(indexOfMovie) {
  const moviesOnWatchlist = JSON.parse(localStorage.getItem("movies"));
  moviesOnWatchlist.splice(indexOfMovie, 1);
  console.log(moviesOnWatchlist);

  localStorage.setItem("movies", JSON.stringify(moviesOnWatchlist));
  console.log(JSON.parse(localStorage.getItem("movies")));

  displayMovies(moviesOnWatchlist);

  if (moviesOnWatchlist.length === 0) {
    const moviesContainer = document.getElementById("movies-container");

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");

    const goSearchBtn = document.createElement("a");
    goSearchBtn.textContent = "Go & search movies!"
    goSearchBtn.classList.add("go-search-btn");
    goSearchBtn.setAttribute("href", "index.html");

    messageContainer.appendChild(goSearchBtn);

    document.getElementById("sort-container").style.display = "none";

    moviesContainer.appendChild(messageContainer);
  } else {
    displayMovies(moviesOnWatchlist);
    document.getElementById("sort-container").style.display = "flex";
  }
}


if (currentPath.includes("watchlist")) {
  const movies = JSON.parse(localStorage.getItem("movies"));

  if (movies.length === 0) {
    const moviesContainer = document.getElementById("movies-container");

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container");

    const messageElement = document.createElement("p");
    messageElement.textContent = "Your watchlist looks a little empty...";
    messageElement.classList.add("message-element");

    const iconContainer = document.createElement("div");
    iconContainer.classList.add("watchlist-search-link-icon-container");

    const addToWatchlistIcon = document.createElement("i");
    addToWatchlistIcon.classList.add("add-icon", "fa-solid", "fa-plus");

    iconContainer.appendChild(addToWatchlistIcon)

    const goSearchBtn = document.createElement("a");
    goSearchBtn.textContent = "Let's add some movies!"
    goSearchBtn.classList.add("go-search-link");
    goSearchBtn.setAttribute("href", "index.html");

    messageContainer.appendChild(messageElement);
    messageContainer.appendChild(iconContainer);
    messageContainer.appendChild(goSearchBtn);

    document.getElementById("sort-container").style.display = "none";

    moviesContainer.appendChild(messageContainer);
  } else {
    displayMovies(movies);
    document.getElementById("sort-container").style.display = "flex";
  }

  const sortMenu = document.getElementById("sort-menu");
  sortMenu.addEventListener("change", (e) => {
    const sortValue = e.target.value;
    console.log("Selected value:", sortValue);
    sortMovies(e, sortValue);
  })
};

// function to display stored movies (watchlist.html)
function displayWatchlist(movies) {
  const movieElements = movies.map((movie, index) => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie-el");

    const posterContainer = document.createElement("div");
    const poster = document.createElement("img");
    poster.src = movie.Poster;
    posterContainer.appendChild(poster);

    const movieTitle = document.createElement("h2");
    movieTitle.textContent = movie.Title;
    movieTitle.classList.add("movie-title");

    // TO DO: Add star icon (maybe via css ::before?)
    const movieRating = document.createElement("p");
    movieRating.textContent = movie.imdbRating;
    movieRating.classList.add("movie-rating");

    const titleAndRatingContainer = document.createElement("div");
    titleAndRatingContainer.classList.add("title-and-rating-container");
    titleAndRatingContainer.appendChild(movieTitle);
    titleAndRatingContainer.appendChild(movieRating);

    const movieRuntime = document.createElement("p");
    movieRuntime.textContent = movie.Runtime;
    movieRuntime.classList.add("movie-runtime");

    const movieGenres = document.createElement("p");
    movieGenres.textContent = movie.Genre;
    movieGenres.classList.add("movie-genres");

    const addToWatchlistBtn = document.createElement("button");
    addToWatchlistBtn.classList.add("remove-from-watchlist-btn");
    addToWatchlistBtn.textContent = "Remove";
    // TO DO: Check if we can just pass movie or if we should modify it first.
    addToWatchlistBtn.addEventListener("click", () => removeFromWatchlist(index));

    const runtimeGenresAndAddBtnContainer = document.createElement("div");
    runtimeGenresAndAddBtnContainer.classList.add("runtime-genres-and-add-btn-container");
    runtimeGenresAndAddBtnContainer.appendChild(movieRuntime);
    runtimeGenresAndAddBtnContainer.appendChild(movieGenres);
    runtimeGenresAndAddBtnContainer.appendChild(addToWatchlistBtn);

    const moviePlot = document.createElement("p");
    moviePlot.textContent = movie.Plot;
    moviePlot.classList.add("movie-plot");

    movieElement.appendChild(posterContainer);
    movieElement.appendChild(titleAndRatingContainer);
    movieElement.appendChild(runtimeGenresAndAddBtnContainer);
    movieElement.appendChild(moviePlot);
    return movieElement;
  })

  // Append results to container.
  const moviesContainer = document.getElementById("movies-container");
  moviesContainer.innerHTML = "";
  moviesContainer.append(...movieElements);
}

// Function to sort movies.
// TO DO: Make function take argument & work on both results & watchlist)
// TO DO: Make function work with different sorting options (that are passed as argument and/or retrieved from menu)
/* 
  Strategy for making function work with different sorting options/values:
  1. Get value of selected option.
  2. Value until first "-" is the key we need to access.
  3. Depending on value after "-" ("ascending" or "descending"): movieA - movieB or movieB - movieA
*/
function sortMovies(e, sortValue = "Year-ascending") {
  const sortAttribute = sortValue.split("-")[0];
  const sortDirection = sortValue.split("-")[1];
  console.log(sortAttribute);
  console.log(sortDirection);

  let watchlistMovies = JSON.parse(localStorage.getItem("movies"));
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

  console.log(watchlistMovies);

  displayMovies(watchlistMovies);
}

// Read more button to extend text if text is too long



