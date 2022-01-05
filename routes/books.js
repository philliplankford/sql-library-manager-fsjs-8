const express = require('express');
const router = express.Router();

const Book = require("../models").Book;
const { Op } = require("sequelize");

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
    // when a page is clicked in the view it will go to this route and rerender based on the query string
    const maxAmount = 15;
    const currentPage = req.query.page ? req.query.page : 0;
    const offset = currentPage * maxAmount;
    const { count, rows } = await Book.findAndCountAll({
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit: 15
    });
    const allPages = Math.ceil( count / maxAmount );
    res.render('layout', { books: rows, allPages });
}));

// GET searched book 
router.get('/search', asyncHandler( async (req, res) => {
    const maxAmount = 15;
    const currentPage = req.query.page ? req.query.page : 0;
    const offset = currentPage * maxAmount;

    const searchQuery = req.query.search;// ? req.query.search : '';

    const { count, rows } = await Book.findAndCountAll({
        order: [['createdAt', 'DESC']],
        // https://sequelize.org/master/manual/model-querying-basics.html
        where: {
            [Op.or]: [
                {title: {[Op.like]: `%${searchQuery}%`}},
                {author: {[Op.like]: `%${searchQuery}%`}},
                {genre: {[Op.like]: `%${searchQuery}%`}},
                {year: {[Op.like]: `%${searchQuery}%`}}
            ]
        },
        offset: offset,
        limit: 15
    });
    const allPages = Math.ceil( count / maxAmount );
    res.render('layout', { books: rows, allPages, searchQuery });
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
        res.redirect('/books'); // res.redirect('/books/' + book.id); 
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
router.get('/:id', asyncHandler ( async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        res.render('update-book', { book });
    } else {
        const err = new Error(); 
        err.status = 404; 
        err.message = "The book you're looking for does not exist!";
        next(err);
    }
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
}));

// delete book
router.post('/:id/delete', asyncHandler (async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect('/books');
}));

module.exports = router;