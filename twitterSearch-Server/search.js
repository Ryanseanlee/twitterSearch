const router = require("express").Router();

const searchAPI = require("searchapi");

//function to search tweets by keyword
router.get("/tweet", async (req, res) => {
  try {
    //uses default keyword of "TwitterDev" if query keyword is empty other wise saves to keyword variable
    let keyword = "from:TwitterDev";
    keyword = req.query.keyword;
    //calls  searchTweet function from searchAPI with the given keyword
    const results = await searchAPI.searchTweet(keyword);
    //maps results of search with a return of author_id and the tweet text
    const tweets = results.map((obj) => {
      return { id: obj.author_id, tweet: obj.text };
    });
    //place json object of tweet results into another object with amount of results returned
    const data = { resultsCount: tweets.length, results: tweets };

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

//returns information of tweet with given tweet id in body of post
//takes information from body of post and inserts they json into the db with a time stamp
router.post("/tweet/details", async (req, res) => {
  try {
    //destructuring body properties to variables
    const { selectId, count, keyword, text } = req.body;
    const details = await searchAPI.getUser(selectId);
    //gets db instance from app.locals
    const db = req.app.locals.db;
    const time = Date.now();
    //creating new object containing properties from req.body and time stamp to save in db
    const data = { keyword, count, selectId, text, time };
    //obtain correct collection from db
    const collection = db.collection("history");
    //inserts object into collection
    await collection.insertOne(data);
    res.status(201).json(details);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
