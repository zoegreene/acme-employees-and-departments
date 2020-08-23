const Sequelize = require('sequelize');
const faker = require('faker');

const { STRING, INTEGER } = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_emp');

const Employee = db.define('employee', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    unique: true
  },
  departmentId: {
    type: INTEGER,
    allowNull: true
  }
});

const Department = db.define('department', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    unique: true
  }});

const syncAndSeed = async () => {
  await db.sync({ force: true });
  await Promise.all([
    Department.create({ name: 'FINANCE' }),
    Department.create({ name: 'HUMAN RESOURCES'}),
    Department.create({ name: 'MARKETING'}),
    Department.create({ name: 'SALES'}),
    Department.create({ name: 'STRATEGY'}),
    createEmployees()
  ]);
}

const createEmployees = async () => {
  const employees = [];
  for (let i = 0; i < 50; i++) {
    employees.push(Employee.create({ name: faker.name.firstName(), departmentId: generateRandomDept() }));
  }
  return employees;
}

const generateRandomDept = () => {
  return Math.ceil(Math.random() * 5);
}

Employee.belongsTo(Department);

module.exports = {
  models: {
    db, Employee, Department
  },
  syncAndSeed
}
