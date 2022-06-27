const config = require("./config.json");
const superagent = require("superagent");

//private function to get token and returns the access token
const _getToken = async () => {
  try {
    const response = await superagent.post(
      `https://${config.consumer_key}:${config.consumer_secret}${config.url_token}`
    );
    return response.body.access_token;
  } catch (error) {
    return error;
  }
};

//function to search for tweets based off given keyword and returns data property of the json object
const searchTweet = async (keyword) => {
  try {
    const searchTweetURL = `${config.url_search}${keyword} -is:retweet&max_results=100&expansions=author_id&`;
    const url = encodeURI(searchTweetURL);
    //calls to get bearer token from api
    const token = await _getToken();
    //search for tweets with the use of the bearer token
    const search = await superagent.get(url).auth(token, { type: "bearer" });
    return search.body.data;
  } catch (error) {
    return error;
  }
};

//with given authorId this function returns data property of json object
const getUser = async (authorId) => {
  try {
    //calls to get bearer token from api
    const token = await _getToken();
    //search for tweets with the use of the bearer token
    const user = await superagent
      .get(`${config.url_user}${authorId}?user.fields=description,verified`)
      .auth(token, { type: "bearer" });
    return user.body.data;
  } catch (error) {
    return error;
  }
};

module.exports = {
  searchTweet,
  getUser,
};
