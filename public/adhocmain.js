const getDataBtn = document.getElementById('getData');
const cardcontainer = document.getElementById('card')
//renders the movie element
function renderMovie(data) {
    let output = document.createElement('div');
    output.classList.add('item');
    output.id = "omdbcontainer"
    cardcontainer.appendChild(output);

    const moviecontainer = document.getElementById('omdbcontainer');
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
    moviecontainer.appendChild(movieContainer);
}
//renders the track element
function renderTrack(data) {
    let carditem = document.createElement('div');
    carditem.classList.add('item');
    carditem.classList.add('cards');
    carditem.id = "Spotifycontainer";
    cardcontainer.appendChild(carditem);

    const trackcontainer = document.getElementById('Spotifycontainer');
    let songContainer = document.createElement('div');
    songContainer.classList.add('song');
    let info = document.createElement('p');
    info.classList.add('movieinfo');
    for (item in data.items[0]) {
        info.innerHTML += `<span class="title">${item}:<span/> ${data.items[0][item]}` + '<br>';
    }
    songContainer.appendChild(info);
    trackcontainer.appendChild(songContainer);
}
//renders the tweet element
function renderTweet(input) {
    let output = document.createElement('div');
    output.classList.add('item');
    output.id = "tweetbox"
    cardcontainer.appendChild(output);
    const tweetbox = document.getElementById('tweetbox');
    for (item in input.statuses) {
        let userhandle = `@${input.statuses[item].user.screen_name}`;
        let username = input.statuses[item].user.name;
        let tweettext = input.statuses[item].text;

        let tweetcontainer = document.createElement('div');
        tweetcontainer.classList.add('tweetContainer');

        let userhandletext = document.createElement('h2');
        userhandletext.classList.add('userhandletext');
        userhandletext.innerText = userhandle;
        tweetcontainer.appendChild(userhandletext);

        let usernametext = document.createElement('p');
        usernametext.classList.add('usernametext');
        usernametext.innerText = username;
        tweetcontainer.appendChild(usernametext);

        let tweet = document.createElement('p');
        tweet.classList.add('tweetblock');
        tweet.innerText = tweettext;
        tweetcontainer.appendChild(tweet);
        tweetbox.appendChild(tweetcontainer);
    }
}

window.addEventListener('load', () => {
    getDataBtn.addEventListener('click', () => {
        fetch('/adhoc.html/api/?')
            .then(response => {
                var id;
                for (var pair of response.headers.entries()) {
                    //console.log(pair[0] + ': ' + pair[1]);
                    if (pair[0] == 'id') {
                        id = pair[1];
                        break;
                    }
                }
                let output = response
                return { id, output };
            })
            .then((id) => {
                switch (id.id) { //switches on the set header from the server
                    case 'spotify':
                        id.output.json().then(json => { renderTrack(json) })
                        break;
                    case 'twitter':
                        id.output.json().then(json => { renderTweet(json.data.data) })

                        break;
                    case 'omdb':
                        id.output.json().then(json => { renderMovie(json) })
                        break;
                    default:
                        alert('error with request')
                        break;
                }
            })
    });
});