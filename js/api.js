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
    return null;
  }
}

async function fetchMovieDetails(movieImdbID) {
  try {
    const response = await fetch(`http://www.omdbapi.com/?apikey=daafd3c&i=${movieImdbID}`);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export { fetchMovies, fetchMovieDetails }