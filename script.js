const movies = document.querySelector('.movies');
const movieInput = document.querySelector('.input');
const btnPrevious = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');

const modal = document.querySelector('.modal');
const modalImg = document.querySelector('.modal__img');
const btnCloseModal = document.querySelector('.modal__close');
const displayedMovies = document.querySelector('.movies');

const htmlBody = document.querySelector('body');
const btnTheme = document.querySelector('.btn-theme');

let initialTheme;
let fullListMovies;

let currentPage = 0;

function fillElements() {
    fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false').then(response => {
        const promiseBody = response.json();

        promiseBody.then(body => {
            fullListMovies = body.results;

            updatePage(fullListMovies).forEach(item => {
                createMoviesContent(item);
            });
        });
    });
}

function createMoviesContent(item) {
    const movie = document.createElement('div');
    movie.classList.add('movie');

    movie.setAttribute('data', 'id');
    movies.append(movie);

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie__info', 'flex-row', 'justify-between', 'align-center');
    movie.append(movieInfo);

    const movieTitle = document.createElement('span');
    movieTitle.classList.add('movie__title');

    const movieRating = document.createElement('span');
    movieRating.classList.add('movie__rating', 'flex-row', 'align-center');

    const img = document.createElement('img');

    img.src = '../assets/estrela.svg';
    img.alt = 'Estrela';
    movieRating.append(img);

    movie.dataset.id = item.id;
    movie.style.backgroundImage = item.poster_path ? `url('${item.poster_path}')` : `url('../assets/noimage.jpg')`;
    movieTitle.textContent = item.title.length > 10 ? `${item.title.slice(0, 10)}...` : item.title;
    movieRating.insertAdjacentText('beforeend', item.vote_average);

    movieInfo.append(movieTitle, movieRating);
}

function updatePage(arr) {
    console.log(arr);
    const pageZero = arr.slice(0, 5);
    const pageOne = arr.slice(5, 10);
    const pageTwo = arr.slice(10, 15);
    const pageThree = arr.slice(15, 20);

    if (currentPage === 0) return pageZero;
    if (currentPage === 1) return pageOne;
    if (currentPage === 2) return pageTwo;
    if (currentPage === 3) return pageThree;
}

function clearCurrentMovies() {
    const movieElements = document.querySelectorAll('.movie');

    movieElements.forEach(item => item.remove());
}

function searchMovie(input) {
    if (input.value !== '') {
        const promise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${input}`);

        promise.then(response => {
            const promiseRes = response.json();

            promiseRes.then(body => {
                fullListMovies = body.results;
                clearGenreTags();

                updatePage(fullListMovies).forEach(item => {
                    console.log(item);
                    createMoviesContent(item);
                });
            });
        });
    } else {
        clearCurrentMovies();
        fillElements();
    }
};

function fillHighlight() {
    const promise = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR')

    promise.then(response => {
        const promiseRes = response.json();

        promiseRes.then(body => {
            const highlightVideoImg = document.querySelector('.highlight__video');
            const highlightLink = document.querySelector('.highlight__video-link');
            const highlightTitle = document.querySelector('.highlight__title');
            const highlightRating = document.querySelector('.highlight__rating');
            const highlightGenres = document.querySelector('.highlight__genres');
            const highlightLaunch = document.querySelector('.highlight__launch');
            const highlightDescription = document.querySelector('.highlight__description');


            const promiseVideo = fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');

            promiseVideo.then(response => {
                const promiseVideoRes = response.json();

                promiseVideoRes.then(body => {
                    highlightLink.href = `https://www.youtube.com/watch?v=${body.results[0].key}`;
                });
            });

            highlightVideoImg.style.backgroundImage = `url(${body.backdrop_path})`;
            highlightTitle.textContent = body.title;
            highlightRating.textContent = body.vote_average;
            highlightGenres.textContent = body.genres.length > 3 ? body.genres.slice(0, 3).map(genre => genre.name).join(', ') : body.genres.map(genre => genre.name).join(', ');

            const releaseDate = new Date(`${body.release_date}T00:00`);
            const formatDate = new Intl.DateTimeFormat('pt-br', { dateStyle: 'long' }).format(releaseDate);

            highlightLaunch.textContent = formatDate;
            highlightDescription.textContent = body.overview;
        });
    });
}

function openModal(movie) {
    const modalTitle = document.querySelector('.modal__title');
    const modalDescription = document.querySelector('.modal__description');
    const modalRating = document.querySelector('.modal__average');
    const modalGenres = document.querySelector('.modal__genres');

    const promise = fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movie.dataset.id}?language=pt-BR`);

    promise.then(response => {
        const promiseRes = response.json();

        promiseRes.then(body => {
            modalImg.src = body.backdrop_path;
            modalTitle.textContent = body.title;
            modalDescription.textContent = body.overview ? body.overview : `Nenhuma sinopse disponível.`;
            modalRating.textContent = body.vote_average;

            clearGenreTags();

            body.genres.forEach(genre => {
                const genreSpan = document.createElement('span');
                genreSpan.classList.add('modal__genre');

                genreSpan.textContent = genre.name;

                modalGenres.insertAdjacentElement('beforeend', genreSpan);
            });
        });
    });
}

function clearGenreTags() {
    const clearGenres = document.querySelectorAll('.modal__genre');

    clearGenres.forEach(item => item.remove());
}

function setLightTheme() {
    initialTheme = 'light';
    btnTheme.src = initialTheme === 'light' ? './assets/light-mode.svg' : './assets/dark-mode.svg';
    btnPrevious.src = initialTheme === 'light' ? './assets/seta-esquerda-preta.svg' : './assets/seta-esquerda-branca.svg';
    btnNext.src = initialTheme === 'light' ? './assets/seta-direita-preta.svg' : './assets/seta-direita-branca.svg';

    htmlBody.style.setProperty('--background-color', initialTheme === 'light' ? '#fff' : '#242424');
    htmlBody.style.setProperty('--highlight-color', initialTheme === 'light' ? '#fff' : '#454545');
    htmlBody.style.setProperty('--shadow', initialTheme === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)');
    htmlBody.style.setProperty('--text-color', initialTheme === 'light' ? '#000' : '#fff');
    htmlBody.style.setProperty('--detail-text-color', initialTheme === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)');
    htmlBody.style.setProperty('--input-color', initialTheme === 'light' ? '#000' : '#fff');
}

function setDarkTheme() {
    initialTheme = 'dark';
    btnTheme.src = initialTheme === 'light' ? './assets/light-mode.svg' : './assets/dark-mode.svg';
    btnPrevious.src = initialTheme === 'light' ? './assets/seta-esquerda-preta.svg' : './assets/seta-esquerda-branca.svg';
    btnNext.src = initialTheme === 'light' ? './assets/seta-direita-preta.svg' : './assets/seta-direita-branca.svg';

    htmlBody.style.setProperty('--background-color', initialTheme === 'dark' ? '#242424' : '#fff');
    htmlBody.style.setProperty('--highlight-color', initialTheme === 'light' ? '#fff' : '#454545');
    htmlBody.style.setProperty('--shadow', initialTheme === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)');
    htmlBody.style.setProperty('--text-color', initialTheme === 'light' ? '#000' : '#fff');
    htmlBody.style.setProperty('--detail-text-color', initialTheme === 'light' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)');
    htmlBody.style.setProperty('--input-color', initialTheme === 'light' ? '#000' : '#fff');
}

fillElements();
fillHighlight();
setLightTheme();

movieInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && movieInput.value) {
        clearCurrentMovies();
        currentPage = 0;

        searchMovie(movieInput.value);
    } else if (event.key === 'Enter' && !movieInput.value) {
        clearCurrentMovies();
        fillElements();
    }
});

btnPrevious.addEventListener('click', () => {
    clearCurrentMovies();

    if (currentPage === 0) {
        currentPage = 3;
        updatePage(fullListMovies).forEach(item => {
            createMoviesContent(item);
        });
    } else {
        currentPage--;
        updatePage(fullListMovies).forEach(item => {
            createMoviesContent(item);
        });
    }
});

btnNext.addEventListener('click', () => {
    clearCurrentMovies();

    if (currentPage === 3) {
        currentPage = 0;
        updatePage(fullListMovies).forEach(item => {
            createMoviesContent(item);
        });
    }
    else {
        currentPage++;
        updatePage(fullListMovies).forEach(item => {
            createMoviesContent(item);
        });
    }
});

displayedMovies.addEventListener('click', (event) => {
    modal.classList.remove('hidden');

    openModal(event.target);
});

btnCloseModal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modal.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modalImg.addEventListener('click', (event) => {
    event.stopPropagation();
});

btnTheme.addEventListener('click', () => {
    if (initialTheme === 'light') {
        setDarkTheme();
    } else {
        setLightTheme();
    }
});