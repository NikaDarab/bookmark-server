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
  //get
  .get((req, res) => {
    res.json(bookmarks);
  })
  //adding data
  .post(bodyParser, (req, res) => {
    const { title, url, description = "", rating = 0 } = req.body;
    //validate
    if (!title || title.length === 0) {
      logger.error("Title is required!");
      return res.status(400).send("Invalid data: title is required!");
    }
    if (!url || url.length === 0) {
      logger.error("URL is required!");
      return res.status(400).send("Invalid data: url is required!");
    }
    if (rating < 0 || rating > 5) {
      logger.error("rating must be between 0-5");
      return res.status(400).send("Invalid data: rating is not in range");
    }
    //proceed
    const id = uuid();
    const bookmark = {
      id,
      title,
      url,
      description,
      rating,
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
  //get
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find((b) => b.id == id);
    //validate
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} was not found.`);
      res.status(400).send("Bookmark was not found!");
    }
    //proceed
    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex((b) => b.id == id);

    //validate
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with if ${id} was not found!`);
      res.status(400).send("Not Found!");
    }
    bookmarks.splice(bookmarkRouter, 1);
    logger.info(`Bookmark with id ${id} delete`);
    res.status(204).end();
  });

module.exports = bookmarkRouter;
