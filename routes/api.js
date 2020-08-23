const express = require('express');
const faker = require('faker');

const router = express.Router();
const db = require('../db');
const { Department, Employee } = db.models;

router.get('/employees', async (req, res, next) => {
  try {
    const employees = await Employee.findAll();
    res.send(employees);
  }
  catch(err) {
    next(err)
  }
});

router.get('/departments', async (req, res, next) => {
  try {
    const departments = await Department.findAll();
    res.send(departments);
  }
  catch(err) {
    next(err)
  }
});

router.delete('/employees/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    await employee.destroy();
    res.sendStatus(204);
  }
  catch(err) {
    next(err)
  }
});

router.put('/employees/:id', async (req, res, next) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    await employee.update(req.body);
    res.send(employee);
  }
  catch(err) {
    next(err)
  }
});

router.post('/employees', async (req, res, next) => {
  try {
    const randDept = Math.ceil(Math.random()  * 5);
    const randName = faker.name.firstName();
    const employee = await Employee.create({ name: randName, departmentId: randDept });
    res.send(employee);
  }
  catch(err) {
    next(err)
  }
});

module.exports = router;


