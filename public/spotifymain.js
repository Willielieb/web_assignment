const gettrackbutton = document.getElementById('getTracks');
const trackinput = document.getElementById('trackinput');
const container = document.getElementById('Spotifycontainer');
var nextsongbtn;
//creates the song element
function renderSong(data, offset) {
    let songContainer = document.createElement('div');
    songContainer.classList.add('song');

    let songName = document.createElement('h3');
    songName.classList.add('songName');
    songName.innerText = data.song;
    songContainer.appendChild(songName);

    let artist = document.createElement('p');
    artist.classList.add('artist');
    artist.innerText = data.artists;
    songContainer.appendChild(artist);

    let album = document.createElement('p');
    album.classList.add('album');
    album.innerText = data.album;
    songContainer.appendChild(album);

    let songlink = document.createElement('a');
    songlink.classList.add('songlink');
    songlink.href = data.link;
    songlink.innerText = 'Go to song';
    songContainer.appendChild(songlink);

    if (data.previewlink != null) { //does not show the preview url if it is null
        let songpreview = document.createElement('a');
        songpreview.classList.add('songlink');
        songpreview.href = data.previewlink;
        songpreview.innerText = 'Go to song preview';
        songContainer.appendChild(songpreview);
    }

    let nextsong = document.createElement('button');
    nextsong.classList.add('btnSend');
    nextsong.innerText = 'Go to the next song';
    nextsong.id = "nextsongbtn";

    nextsong.addEventListener('click', () => {
        clearSongBox();
        getTrack(trackinput.value.trim(), offset + 1); //adds 1 to the offset for the track essentially showing the next item in the list
    })

    songContainer.appendChild(nextsong);
    container.appendChild(songContainer);
}
//clears the song container
function clearSongBox() {
    container.innerText = '';
}
//gets the data from the server
function getTrack(song, offset) {
    fetch(`/spotify.html/api/spotify?trackname=${song}&offset=${offset}`)
        .then(response => response.json())
        .then(json => { renderSong(json, offset) })
        .catch(error => { console.error(error) });
}

window.addEventListener('load', () => {

    gettrackbutton.addEventListener('click', () => {
        if (trackinput.value.trim() == 0) return;
        clearSongBox();
        getTrack(trackinput.value.trim(), 0);
    })

});