const express = require('express');
const path = require('path');
const morgan = require('morgan');
const db = require('./db');
const { Department, Employee } = db.models;

const app = express();
app.use(require('body-parser').json());
app.use(morgan('dev'));

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/employees', async (req, res, next) => {
  try {
    const employees = await Employee.findAll();
    res.send(employees);
  }
  catch(err) {
    next(err)
  }
});

app.get('/api/departments', async (req, res, next) => {
  try {
    const departments = await Department.findAll();
    res.send(departments);
  }
  catch(err) {
    next(err)
  }
});

app.delete('/api/employees/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    await employee.destroy();
    res.sendStatus(204);
  }
  catch(err) {
    next(err)
  }
});

app.put('/api/employees/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    await employee.update(req.body);
    res.send(employee);
  }
  catch(err) {
    next(err)
  }
});


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
