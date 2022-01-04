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

// GET new book
router.get('/new', (req, res) => {
    res.render('new-book');
});

// POST new book
router.post('/new', asyncHandler( async (req, res) => {
    let book;
    try {
        book = await Book.create(req.body); // req has the key value pairs from the formprops that map to attributes
        res.redirect('/books/' + book.id); 
    } catch (error) {
        if (error.name === 'SequelizeValidationError'){
            book = await Book.build(req.body);
            res.render('new-book', { book, errors: error.errors });
        } else {
            throw error; // error caugh in asyncHandler's catch block
        }
    }

}));

// GET update book
router.get('/:id', asyncHandler ( async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    res.render('update-book', { book });
}));

// POST update book
router.post('/:id', asyncHandler ( async (req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if (book) {
            await book.update(req.body);
            res.redirect('/books/' + book.id);
        }
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            book = await Book.build(req.body);
            book.id = req.params.id; // to ensure correct article gets updated
            res.render('update-book', { book, errors: error.errors });
        } else {
            throw error;
        }
    }
    // res.redirect('/books/' + book.id);
}));

// delete book
router.post('/:id/delete', asyncHandler (async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect('/books');
}));

module.exports = router;