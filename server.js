const express = require('express');
const morgan = require('morgan');
const faker = require('faker');

const app = express();
app.use(require('body-parser').json());

const init = async () => {
  try {
    //await db.syncAndSeed();
    const PORT = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${PORT}...`));

  }
  catch(err) {
    console.error(err);
  }

}

init();
