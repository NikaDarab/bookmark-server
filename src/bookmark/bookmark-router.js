/* eslint-disable eqeqeq */
const express = require("express");
const bookmarkRouter = express.Router();
const winston = require("winston");
const logger = require("../logger");
const bodyParser = express.json();
const { v4: uuid } = require("uuid");
const { bookmarks } = require("../store");

//routing for /bookmarks (get,post)
bookmarkRouter
  .route("/bookmarks")
  //collecting at data
  .get((req, res) => {
    res.json(bookmarks);
  })
  //adding data
  .post(bodyParser, (req, res) => {
    const { title, url } = req.body;
    //validate
    if (!title) {
      logger.error("Title is required!");
      return res.status(400).send("Invalid data: title is required!");
    }
    if (!url) {
      logger.error("URL is required!");
      return res.status(400).send("Invalid data: url is required!");
    }
    //proceed
    const id = uuid();
    const bookmark = {
      id,
      title,
      url,
    };
    bookmarks.push(bookmark);
    logger.info(`Bookmark with id ${id} created!`);
    res
      .status(201)
      .location(`http://localhost:8000/card/${id}`)
      .json(bookmarks);
  });
//router for /bookmarks/:id (get,delete)
bookmarkRouter
  .route("/bookmarks/:id")
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find((b) => b.id == id);
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} is not valid.`);
      res.status(404).send("Bookmark was not found!");
    }
    res.json(bookmark);
  })
  .delete();

module.exports = bookmarkRouter;
