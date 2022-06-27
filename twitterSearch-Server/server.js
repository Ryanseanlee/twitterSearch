const cors = require("cors");
const express = require("express");

const MongoClient = require("mongodb").MongoClient;

const config = require("./config.json");

const search = require("./search");
const history = require("./history");

const app = express();
const port = 8888;

//mount functions
app.use(cors());
app.use(express.json());

app.use("/search", search);

app.use("/history", history);

const url = `mongodb+srv://${config.username}:${config.password}@${config.cluster}/${config.database}?retryWrites=true&w=majority`;

// create a new mongo client instance
const client = new MongoClient(url);

// connect ot the url provided
client.connect((err) => {
  // if there is an error then throw because our server depends on our database
  if (err) {
    throw new Error("Failed to connect to MongoDB");
  }
  // storing the database instance in the app.locals object to reference in search.js and history.js
  app.locals.db = client.db();

  // start the server after connecting to mongo
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
});
