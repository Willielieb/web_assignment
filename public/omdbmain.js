const getmoviebutton = document.getElementById('getMovie');
const movieinput = document.getElementById('movieinput');
const container = document.getElementById('omdbcontainer');
//creates the movie object
function renderMovie(data) {
    let movieContainer = document.createElement('div');
    movieContainer.classList.add('movie');

    let movietitle = document.createElement('h1');
    movietitle.classList.add('movieName');
    movietitle.innerText = data.Title;
    movieContainer.appendChild(movietitle);

    let info = document.createElement('p');
    info.classList.add('movieinfo');
    for (item in data) {
        if (item != 'Website' || item != 'Response' || item != 'Poster' || item != 'Ratings') {
            info.innerHTML += `<span class="title">${item}:<span/> ${data[item]}` + '<br>';
        } if (item == 'Poster') {
            info.innerHTML += `<a href="${data[item]}">${item}<a/> <br>`
        }
    }
    movieContainer.appendChild(info);
    container.appendChild(movieContainer);
}
//clears the movie container
function clearMovieBox() {
    container.innerText = '';
}
//gets the movie data
function getMovie(title) {
    fetch(`/omdb.html/api/omdb?t=${title}`)
        .then(response => response.json())
        .then(json => { renderMovie(json) })
        .catch(error => { console.error(error) });
}
window.addEventListener('load', () => {
    getmoviebutton.addEventListener('click', () => {
        if (movieinput.value.trim() == 0) return;
        clearMovieBox();
        getMovie(movieinput.value.trim());
    })
});