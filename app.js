require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
  
// Our routes go here:
app.get('/', (req, res) => {
  res.render('home');
});

//iteration 3
app.get('/artist-search', (req, res) => {
  spotifyApi
  .searchArtists(req.query.artistname)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items[0].images);
    res.render('artist-search-results', {results: data.body.artists.items});
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

//iteration 5
app.get('/songs/:id', (req, res) => {
  console.log(req.params.id);
  spotifyApi.getAlbumTracks(req.params.id)
  .then(data => {
    let results = data.body.items;
    //console.log('The received songs from the API: ', results);
    res.render('songs', {results})
  })
  .catch(err => console.log('The error while searching songs occurred: ', err));
});



//iteration 4
app.get('/albums/:id', (req, res) => {
  spotifyApi
  .getArtistAlbums(req.params.id)
  .then(data => {
    console.log('The received album from the API: ', data.body.items[0]);
    res.render('albums', {results: data.body.items});

  })
  .catch(err => console.log('The error while searching albums occurred: ', err));
});




app.listen(3005, () => console.log('My Spotify project running on port 3005 🎧 🥁 🎸 🔊'));
