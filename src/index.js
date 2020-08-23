import React, { Component } from 'react';
import ReactDOM from 'react-dom';
const axios = require('axios');

class App extends Component {
  constructor() {
    super()
    this.state = {
      departments: [],
      employees: []
    }
    this.destroy = this.destroy.bind(this);
    this.changeDept = this.changeDept.bind(this);
    this.displayNoDept = this.displayNoDept.bind(this);
    this.displayDepts = this.displayDepts.bind(this);
    this.addEmployee = this.addEmployee.bind(this);
  }

  async componentDidMount() {
    this.setState({ departments: (await axios.get('api/departments')).data, employees: (await axios.get('api/employees')).data });
  }

  render() {
    const { employees } = this.state;
    const { displayNoDept, displayDepts, addEmployee } = this;

    return (
    <div>
      <div>
        <h1>Acme Employees And Departments</h1>
        <p>{ employees.length } Total Employees</p>
        <button onClick={ () => addEmployee() }>Add New Employee</button>
      </div>
      <div id='all-depts'>
        <div id='no-dept' className='dept'>
          Employees Without Departments ({ employees.filter(e => e.departmentId === null).length })
          { displayNoDept() }
        </div>
          { displayDepts() }
      </div>
    </div>
    )
  }

  // show column for employees with no department
  displayNoDept() {
    const { destroy, changeDept } = this;
    const { employees } = this.state;

    return (
      <ul id='employees'>
        { employees
          .filter(employee => employee.departmentId === null)
          .map(employee => {
            return (
              <li key={ employee.id }>
                <p>{ employee.name }</p>
                <button onClick={ () => destroy(employee) }>x</button>
                <button onClick={ () => changeDept(employee, 'add') }>Assign Random Department</button>
              </li>
            )
        })}
      </ul>
    )
  }

  // show all department columns and their employees
  displayDepts() {
    const { departments, employees } = this.state;
    const { destroy, changeDept } = this;

    return (
      departments.map(department => {
        return (
        <div key={ department.id } className='dept'>
          { department.name } ({ employees.filter(e => e.departmentId === department.id).length})
          <ul id='employees'>
            { employees
              .filter(employee => employee.departmentId === department.id)
              .map(employee => {
                return (
                  <li key={ employee.id }>
                    <p>{ employee.name }</p>
                    <button onClick={ () => destroy(employee) }>x</button>
                    <button onClick={ () => changeDept(employee, 'remove') }>Remove From Department</button>
                  </li>
                )
            })}
          </ul>
        </div>
        )
      })
    )
  }

  // functionality for 'x' button
  async destroy(employee) {
    await axios.delete(`api/employees/${ employee.id }`);
    const employees = this.state.employees.filter(e => e.id !== employee.id);
    this.setState({ employees });
  }

  // functionality for "remove from department or add random department" buttons
  async changeDept(employee, action) {
    if (action === 'remove') {
      employee.departmentId = null;
    } else if (action === 'add') {
      employee.departmentId = Math.ceil(Math.random() * 5);
    }
    await axios.put(`api/employees/${employee.id}`, { departmentId: employee.departmentId });
    const employees = this.state.employees.map(e => e.id === employee.id ? employee : e);
    this.setState({ employees });
  }

  // functionality for "add new employee button"
  // adds random employee to random department
  async addEmployee() {
    const employee = (await axios.post(`api/employees`)).data;
    const employees = this.state.employees;
    employees.push(employee);
    this.setState({ employees });
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
