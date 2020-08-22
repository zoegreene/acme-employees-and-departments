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
    this.removeDept = this.removeDept.bind(this);
    this.displayNoDept = this.displayNoDept.bind(this);
    this.displayDepts = this.displayDepts.bind(this);
  }

  async componentDidMount() {
    this.setState({ departments: (await axios.get('api/departments')).data, employees: (await axios.get('api/employees')).data });
  }

  render() {
    const { employees } = this.state;
    const { displayNoDept, displayDepts } = this;

    return (
    <div>
      <div>
        <h1>Acme Employees And Departments</h1>
        <p>{ employees.length } Total Employees</p>
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

  displayNoDept() {
    const { destroy } = this;
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
              </li>
            )
        })}
      </ul>
    )
  }

  displayDepts() {
    const { departments, employees } = this.state;
    const { destroy, removeDept } = this;

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
                    <button onClick={ () => removeDept(employee) }>Remove From Department</button>
                  </li>
                )
            })}
          </ul>
        </div>
        )
      })
    )
  }

  async destroy(employee) {
    await axios.delete(`api/employees/${ employee.id }`);
    const employees = this.state.employees.filter(e => e.id !== employee.id);
    this.setState({ employees });
  }

  async removeDept(employee) {
    employee.departmentId = null;
    await axios.put(`api/employees/${employee.id}`);
    const employees = this.state.employees.map(e => e.id === employee.id ? employee : e);
    this.setState({ employees });
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
