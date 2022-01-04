const express = require('express');
const router = express.Router();

const Book = require("../models").Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler( async (req, res, next) => {
  const books = await Book.findAll();
  res.render('layout');
}));

router.get('/new', (req, res, next) => {
    res.render('new-book');
});

router.post('/new', (req, res, next) => {});

router.get('/:id', (req, res, next) => {});

router.post('/:id', (req, res, next) => {});

router.post('/:id/delete', (req, res, next) => {});



module.exports = router;