const express = require('express');
const fetch = require('node-fetch');
const parser = require('body-parser');
const cors = require('cors');
const nodeCron = require('node-cron');
require('dotenv/config');

const constants = require('./config');
const businessEntriesMapper = require('./helpers/businessEntriesMapper');
const errorHandler = require('./errors/errorHandler');
const InternalError = require('./errors/InternalError');
const businessRoutes = require('./routes/business');

const app = express();

// Middleware
app.use(parser.json());
app.use(cors());

// get data from resource and save
let businessEntries;

async function getData() {
  try {
    const data = await Promise.all(
      constants.IDS.map(async (id) => {
        const result = await fetch(`${process.env.URL}/${id}`);
        const place = await result.json();
        return place;
      }),
    );
    if (!data) throw new InternalError('Internal Server Error', 500);
    businessEntries = businessEntriesMapper(data);
    return businessEntries;
  } catch (error) {
    return error;
  }
}

app.use((req, res, next) => {
  // Make data available in request-response cycle
  // For the purposes of this example only
  // Complete solution would depend on the business requirements
  // (how often does the data change for example)
  res.locals.businessEntries = businessEntries;
  next();
});

app.use('/places', businessRoutes);

// error handler
app.use(errorHandler);

// get all data on startup;
getData();

app.listen(5000, () => {
  console.log('Server started');
  // get data at a certain interval (for example every hour),
  // the interval depends on the needs of the business
  nodeCron.schedule('0 0 */1 * * *', () => {
    getData();
  });
});
