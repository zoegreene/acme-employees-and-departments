const express = require('express');
const path = require('path');
const morgan = require('morgan');
const db = require('./db');

const app = express();
app.use(require('body-parser').json());
app.use(morgan('dev'));

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API ROUTES
app.use('/api', require('./routes/api'));

// ERROR HANDLERS BELOW
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ error: err.message })
});

const init = async () => {
  try {
    await db.syncAndSeed();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

  }
  catch(err) {
    console.error(err);
  }
}

init();
