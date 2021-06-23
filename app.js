const mongoose = require("mongoose");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();

const contactsRouter = require("./api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Not found",
  });
});

app.use((err, req, res, _) => {
  const { code = 500, message = "Server error" } = err;
  res.status(code).json({
    status: "fail",
    code,
    message,
  });
});

const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST;

mongoose
  .connect(DB_HOST, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    app.listen(PORT || 3000, () =>
      console.log("Database connection successful")
    )
  )
  .catch((error) => {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  });

module.exports = app;
