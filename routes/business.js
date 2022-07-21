const express = require('express');

const NotFoundError = require('../errors/NotFoundError');
const InternalError = require('../errors/InternalError');
const BadRequestError = require('../errors/BadRequestError');

const router = express.Router();

// returns all business entries with search
router.get('/', (req, res, next) => {
  const { businessEntries } = res.locals;
  try {
    if (!businessEntries) throw new InternalError('Internal Server Error', 500);

    const searchQuery = req.query.search;
    const searchString = searchQuery ? searchQuery.toLowerCase() : '';
    const filteredPlaces = searchString
      ? businessEntries.filter((el) => el.name.toLowerCase().includes(searchString)
        || el.address.toLowerCase().includes(searchString))
      : businessEntries;

    const mappedData = filteredPlaces.map((el) => ({
      id: el.id,
      name: el.name,
      address: el.address,
    }));

    res.json(mappedData);
  } catch (error) {
    next(error);
  }
});

// returns one business entry depending on the id
router.get('/:id', async (req, res, next) => {
  const { businessEntries } = res.locals;
  try {
    if (!businessEntries) throw new InternalError('Internal Server Error', 500);

    const result = businessEntries.find((el) => el.id === req.params.id);

    if (!result) throw new NotFoundError('Not content found according to your request', 404);

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// handle invalid routes
router.get('*', async (req, res, next) => {
  try {
    throw new BadRequestError('Bad Request', 400);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
