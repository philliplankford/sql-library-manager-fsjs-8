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
router.get('/', asyncHandler( async (req, res) => {
  const books = await Book.findAll();
  console.log(books);
  res.render('layout', { books });
}));

router.get('/new', (req, res) => {
    res.render('new-book');
});

router.post('/new', asyncHandler( async (req, res) => {
    const article = await Book.create(req.body); // req has the key value pairs from the formprops that map to attributes
    res.redirect('/books/' + article.id);
}));

router.get('/:id', (req, res, next) => {});

router.post('/:id', (req, res, next) => {});

router.post('/:id/delete', (req, res, next) => {});



module.exports = router;