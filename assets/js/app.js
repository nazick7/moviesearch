// Initial Values
const API_KEY = "260fd7665e4a54acdb157b9fc8ca9a32";

const url = "https://api.themoviedb.org/3/search/movie?api_key=" + API_KEY;

// select DOM elements
const buttonElement = document.querySelector("#search");
const inputElement = document.querySelector("#InputValue");
const movieSearchable = document.querySelector("#movies-searchable");
const movieModal = document.querySelector("#movie-modal");
const reviewsContainer = document.querySelector(".modal__reviews");
var findedElements = [];

function movieSection(movies) {
  return movies
    .map(movie => {
      return `
                <li data-movieid="${movie.id}">${movie.title}</li>
            `;
    })
    .join("");
}

function reviewsSection(reviews) {
  return reviews
    .map(review => {
      return `
                <div class="review-item">
                    <div class="author">${review.author}</div>
                    <div class="user-review">${review.content}</div>
                </div>
            `;
    })
    .join("");
}

function generateMovieReviewsUrl(movieId) {
  return (
    "https://api.themoviedb.org/3/movie/" +
    movieId +
    "/reviews?api_key=" +
    API_KEY
  );
}

function findElemByID(id) {
  let elem = {};
  findedElements.forEach(function(item) {
    console.log(item.id + "==" + id);
    console.log(id + item.id == id);
    if (item.id == id) {
      elem = item;
    }
  });
  return elem;
}

function createMovieContainer(movies) {
  const movieElement = document.createElement("div");
  movieElement.setAttribute("class", "movie");

  const movieTemplate = `
        <section class ="section">
            <ul id="movies-list">
                ${movieSection(movies)}
            </ul> 
        </section>
        `;
  movieSearchable.innerHTML = "";
  movieElement.innerHTML = movieTemplate;
  return movieElement;
}

function getMovieReviews(movieId) {
  const reviewUrl = generateMovieReviewsUrl(movieId);

  fetch(reviewUrl)
    .then(res => res.json())
    .then(data => {
      // data.result (Movie names)
      let reviews = data.results;
      let reviewsBlock = createReviewsContainer(reviews);
      console.log("Data: ", data);
    })
    .catch(error => {
      console.log("Error: ", error);
    });
}

function createReviewsContainer(reviews) {
  const reviewsTemplate = `
        <section class ="reviews">
            <div id="reviews-list">
                ${reviewsSection(reviews)}
            </div>
        </section>
        `;

  reviewsContainer.innerHTML = reviewsTemplate;
  return reviewsContainer;
}

document.addEventListener("click", function(e) {
  if (e.target && e.target.tagName == "LI") {
    let selectedLi = e.target;
    let movieId = selectedLi.dataset.movieid;
    const titleLabel = movieModal.querySelector(".modal__title");
    const imgLabel = movieModal.querySelector(".modal__img");
    const overviesLabel = movieModal.querySelector(".modal__content");
    let selectedMovie = findElemByID(movieId);
    titleLabel.innerHTML = selectedMovie.title;
    imgLabel.innerHTML =
      '<img src="https://image.tmdb.org/t/p/w600_and_h900_bestv2/' +
      selectedMovie.poster_path +
      '">';
    overviesLabel.innerHTML = selectedMovie.overview;
    getMovieReviews(movieId);
    showModal("movie-modal");
  }
});

buttonElement.onclick = function(event) {
  event.preventDefault();
  const value = inputElement.value;

  const newUrl = url + "&query=" + value;

  fetch(newUrl)
    .then(res => res.json())
    .then(data => {
      // data.result (Movie names)
      const movies = data.results;
      const movieBlock = createMovieContainer(movies);
      movieSearchable.appendChild(movieBlock);
      findedElements = data.results;
      console.log("Data: ", data);
    })
    .catch(error => {
      console.log("Error: ", error);
    });
  console.log("Value ", value);
};
