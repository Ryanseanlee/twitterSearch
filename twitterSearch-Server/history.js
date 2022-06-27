const router = require("express").Router();

//returns entire json object from mongo of previous searches
router.get("/search", async (req, res) => {
  try {
    const db = req.app.locals.db;
    const collection = db.collection("history");

    const all = await collection.find({}).toArray();

    res.json(all);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
