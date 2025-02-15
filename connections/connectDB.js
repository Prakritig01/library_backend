const mongodb = require('mongodb');
const MONGO_URI = process.env.MONGO_URI

const client = new mongodb.MongoClient(MONGO_URI);
client
  .connect()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

const db = client.db("test");

module.exports = db;