import { displayWatchlist } from './ui.js';
import { getWatchlist } from './storage.js';
import { sortMovies } from './watchlistPageController.js';

const moviesOnWatchlist = getWatchlist();

const moviesContainer = document.getElementById("movies-container");
const sortContainer = document.getElementById("sort-container");

if (moviesOnWatchlist.length === 0) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");

  const messageElement = document.createElement("p");
  messageElement.textContent = "Your watchlist looks a little empty...";
  messageElement.classList.add("message-element");

  const iconContainer = document.createElement("div");
  iconContainer.classList.add("watchlist-search-link-icon-container");

  const addToWatchlistIcon = document.createElement("i");
  addToWatchlistIcon.classList.add("add-icon", "fa-solid", "fa-plus");

  iconContainer.appendChild(addToWatchlistIcon);

  const goSearchBtn = document.createElement("a");
  goSearchBtn.textContent = "Let's add some movies!";
  goSearchBtn.classList.add("go-search-link");
  goSearchBtn.setAttribute("href", "index.html");

  messageContainer.appendChild(messageElement);
  messageContainer.appendChild(iconContainer);
  messageContainer.appendChild(goSearchBtn);

  sortContainer.style.display = "none";
  moviesContainer.appendChild(messageContainer);
} else {
  displayWatchlist(moviesOnWatchlist);
  sortContainer.style.display = "flex";
}

const sortMenu = document.getElementById("sort-menu");
sortMenu.addEventListener("change", (e) => {
  const sortValue = e.target.value;
  sortMovies(e, sortValue);
});