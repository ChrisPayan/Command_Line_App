const mysql = require('mysql');
const inquirer = require('inquirer');
require("console.table");

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password1',
  database: 'company_db',
});

function commandline() {
inquirer
.prompt([
    {
      type: "list",
      name: "mainOption",
      message: "What would you like to do?",
      choices: [
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "View All Department",
          "View All Roles",
          "View All Employees",
          "Update Employee Role",
          "Exit"
      ]
    }
])
.then((answer) => {
  switch (answer.mainOption) {
    case 'Add a Department':
      inquirer
      .prompt([
        {
          type: "input",
          message: "What is the department Name?",
          name: "department",
        }
      ])
      .then((answer) => {
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: answer.department,
          },
          (err, res) => {
            if(err) throw err;
            return commandline();
          }
        );
      });
      break;
    case 'Add a Role':
      connection.query(
        "SELECT name, id as value FROM department;",
        (err, departmentList) => {
          if(err) throw err;
          inquirer
            .prompt([
              {
                type: "input",
                message: "Enter Role title:",
                name: "title",
              },
              {
                type: "input",
                message: "Enter Role salary:",
                name: "salary",
              },
              {
                type: "list",
                message: "Select Department:",
                name: "department",
                choices: departmentList,
              }
            ])
            .then((res) => {
              connection.query(
                "INSERT INTO role SET ?",
                {
                  title: res.title,
                  salary: res.salary,
                  department_id: res.department,
                },
                (err, res) => {
                  if(err) throw err;
                  return commandline();
                }
              )
            })
        }
      )
      break;

    case 'Add an Employee':
      connection.query(
        "SELECT CONCAT(first_name,' ',last_name) AS name, id AS value FROM employee;",
        (err, employeeList) => {
          connection.query(
            "SELECT title as name, id as value from role;",
            (err, roleList) => {
              if(err) throw err;
              inquirer
                .prompt([
                  {
                    type: "input",
                    message: "Enter Employee First Name:",
                    name: "firstName",
                  },
                  {
                    type: "input",
                    message: "Enter Employee Last Name:",
                    name: "lastName",
                  },
                  {
                    type: "list",
                    message: "Enter Employee Role:",
                    name: "role",
                    choices: roleList,
                  },
                  {
                    type: "list",
                    message: "Who is this employees manager?",
                    name: "manager",
                    choices: employeeList.concat({
                      name: "None",
                      value: null,
                    }),
                  },
                ])
                .then((res) => {
                  connection.query(
                    "INSERT INTO employee SET ?;", 
                    {
                      first_name: res.firstName,
                      last_name: res.lastName,
                      role_id: res.role,
                      manager_id: res.manager,
                    },
                    (err, res) => {
                      if(err) throw err;
                      return commandline();
                    }
                  );
                });
            } 
          )
        }
      )
      break;

    case 'View All Department':
      connection.query(
        "SELECT name as Department From department",
        (err, res) => {
          if(err) throw err;
          console.table(res);
          return commandline();
        }
      );
      break;

    case 'View All Roles':
      connection.query(
        "SELECT role.title AS title , role.salary AS Salary , name AS Department FROM role LEFT JOIN department ON department_id = department.id;",
        (err, res) => {
          if(err) throw err;
          console.table(res);
          return commandline();
        }
      );
      break;

    case 'View All Employees':
      connection.query(
        "SELECT CONCAT(employee.first_name,' ', employee.last_name) AS Employee, role.title AS Position, department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id);",
        (err, res) => {
          if(err) throw err;
          console.table(res);
          return commandline();
        }
      );
      break;

    case 'Update Employee Role':
        connection.query(
          "SELECT CONCAT(first_name,' ',last_name) AS name, id as value FROM employee;",
          (err, employeeList) => {
            connection.query(
              "SELECT title as name, id as value from role;",
              (err, roleList) => {
                if(err) throw err;
                inquirer
                  .prompt ([
                    {
                      type: "list",
                      message: "Choose and Employee",
                      name: "employee",
                      choices: employeeList,
                    },
                    {
                      type: "list",
                      message: "Choose a Role",
                      name: "role",
                      choices: roleList,
                    },
                  ])
                  .then((res) => {
                    connection.query(
                      "UPDATE employee SET ? WHERE ?;",
                      [{ role_id: res.role }, { id: res.employee }],
                    );
                    return commandline();
                  });
              }
            );
          }
        )
      break;

    case 'Exit':
      connection.end();

      break;

    default:
      console.log(`Invalid action: ${answer.action}`);
      break;
  }
});
}

commandline();
