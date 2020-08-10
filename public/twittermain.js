const gettweetbutton = document.getElementById('getTweets');
const tweetbox = document.getElementById('tweetbox');
const tweetinput = document.getElementById('usernameinput');
const amountoftweets = document.getElementById('amountoftweets');
//creates the tweet element for each tweet recieved
function processTwitterInfo(tweet) {
    for (item in tweet.data.statuses) {
        console.log(tweet.data.statuses[item].user.screen_name);
        renderTweet(`@${tweet.data.statuses[item].user.screen_name}`, tweet.data.statuses[item].user.name, tweet.data.statuses[item].text);
    }
}
//creates the tweet element
function renderTweet(userhandle, username, tweettext) {
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
//clears the tweet container
function clearTweetBox() {
    tweetbox.innerHTML = '';
}
//gets the data from the server
function getTweet(name, amount) {
    fetch(`twitter.html/api/twitter?username=${name}&amount=${amount}`)
        .then(res => res.json())
        .then(json => {
            clearTweetBox();
            processTwitterInfo(json);
        })
        .catch(error => {
            clearTweetBox();
            renderTweet('error', 'error', 'error');
            console.log(error);
        });
}

window.addEventListener('load', () => {
    gettweetbutton.addEventListener('click', () => {
        let name = tweetinput.value.trim();
        let amount = amountoftweets.value;
        if (name.length == 0) return;
        if (amount < 1)
            amount = 1;
        getTweet(name, amount);
    });

});