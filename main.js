const express = require("express");
const app = express();
const fs = require('fs').promises;
const Twit = require("twit"); //the twit node module
var config = require("./Twitter/config");//authentication file
const url = require('url');
const twitterApi = new Twit(config);
const requestpro = require('request-promise');
var SpotifyWebApi = require("spotify-web-api-node");
const credentials = require('./Spotify/auth'); //authentication file
var spotifyApi = new SpotifyWebApi(credentials);


app.use(express.static('./public')); //this "hosts" everything in my "public" folder
//this sets "app"'s port to listen to and includes a callback to show it is running
app.listen(5050, () => {
    console.log('running on port 5050 (ctrl+click(http://localhost:5050/))');
    console.log('to view the web page click the link above');
    console.log('this will allow you to use the APIs');
});

//Twitter
//this sends the client data if this url gets shown
app.get('/twitter.html/api/twitter?', (request, response) => {
    var q = url.parse(request.url, true).query; //breaks the url down into an object of strings
    var amountOfTweets = q.amount >= 20 ? 20 : q.amount; //sets the amount of tweets, if it is greater than 20, it returns 20 else it returns the number of tweets
    var params = {
        q: `from:${q.username}`,
        count: amountOfTweets,
    }; //parameters for the search

    twitterApi.get("search/tweets", params) // uses the api to search for tweets with the parameters set
        .then(data => {
            response.json(data); //responds with the data converted to json
        }).catch(error => {
            response.end(error)
        }
        )
});

//omdb
//this sends the client data if this url gets shown
app.get('/omdb.html/api/omdb?', (request, response) => {
    var q = url.parse(request.url, true).query; //breaks the url down into an object of strings
    var params = { uri: 'http://www.omdbapi.com/', qs: { apikey: 'b1e88414', t: `${q.t}` } }; //parameters for the search

    requestpro(params) // uses the api to search for movies with the parameters set
        .then(res => {
            response.end(res); //responds with the data
        }).catch(error => {
            console.error(error);
        })
})

//spotify
//this sends the client data if this url gets shown
app.get('/spotify.html/api/spotify?', (request, response) => {
    var q = url.parse(request.url, true).query;

    spotifyApi.clientCredentialsGrant() //uses the credentials to grant a token for access to the data
        .then(data => { spotifyApi.setAccessToken(data.body['access_token']); }) //sets the access token to the object
        .then(() => {
            spotifyApi.searchTracks(`track:${q.trackname}`, { limit: 1, offset: q.offset }) // uses the api to search for tweets with the parameters set
                .then(data => {
                    var artists = data.body.tracks.items[0].artists.map(artist => artist.name).join(','); //combines all the artists on the song into one string
                    let outputdata = {
                        'artists': artists,
                        'song': data.body.tracks.items[0].name,
                        'album': data.body.tracks.items[0].album.name,
                        'link': data.body.tracks.items[0].external_urls.spotify,
                        'previewlink': data.body.tracks.items[0].preview_url,
                        'nextsong': data.body.tracks.next,
                        'id': data.body.tracks.items[0].id
                    } //sets the output data
                    response.json(outputdata); //responds with the data converted to json
                });
        })
        .catch(err => {
            console.error('error: ', err)
        });
});

//adhoc query
//this sends the client data if this url gets shown
app.get('/adhoc.html/api/?', (request, response) => {
    fs.readFile('random.txt') //reads the file found in the same directory
        .then(data => data.toString()) //converts the data into a string
        .then(query => url.parse(query, true)) //converts the url string into an object 
        .then(out => {
            if (out.host.includes('spotify')) {
                spotifyApi.clientCredentialsGrant()
                    .then(data => { spotifyApi.setAccessToken(data.body['access_token']); })
                    .then(() => {
                        spotifyApi.searchTracks(out.query.q, { limit: 1, offset: 0 })
                            .then(data => {
                                response.set('id', 'spotify'); //sets the header with a custom uri for future use
                                response.json(data.body.tracks)
                            })
                            .catch(error => { console.log(error) })
                    })
            }
            else {
                if (out.host.includes('twitter')) {
                    twitterApi.get("search/tweets", out.query)
                        .then(data => { response.set('id', 'twitter'); response.send({ data }) })
                        .catch(error => { response.end(error) })
                }
                else {
                    if (out.host.includes('omdb')) {
                        var params = { uri: 'http://www.omdbapi.com/', qs: { apikey: 'b1e88414', t: `${out.query.t}` } };
                        requestpro(params)
                            .then(res => { response.set('id', 'omdb'); response.send(res) })
                            .catch(error => { console.error(error) })
                    }
                    else {
                        esponse.end('Query not useable');
                    }
                }
            }
        }
        ).catch(error => { console.log(error) })
})
