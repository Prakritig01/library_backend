const dotenv = require("dotenv");
dotenv.config();

const library = require('./routes/library.routes');
const author = require('./routes/author.routes');
const user = require('./routes/user.routes');
const borrowedBook = require('./routes/borrowRecord.routes')

const express = require("express");
const app = express();

require('./connections/connectMon');

app.use(express.json());
app.use(logger);

const PORT = process.env.PORT;

function logger(req, res, next) {
  console.log(req.method);
  console.log(req.url);
  next();
}

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/library", library);
app.use('/author',author);
app.use('/users',user);
app.use('/borrow',borrowedBook);



app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
