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
  res.render('layout', { books });
}));

router.get('/new', (req, res) => {
    res.render('new-book');
});

router.post('/new', asyncHandler( async (req, res) => {
    const book = await Book.create(req.body); // req has the key value pairs from the formprops that map to attributes
    res.redirect('/books/' + book.id);
}));

router.get('/:id', asyncHandler ( async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', { book });
}));

// update
router.post('/:id', asyncHandler ( async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect('/books/' + book.id);
}));

// delete
router.post('/:id/delete', (req, res) => {});



module.exports = router;