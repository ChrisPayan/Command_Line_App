DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;


CREATE TABLE department(
	id integer not null auto_increment,
    name varchar(30),
    primary key(id)
);

CREATE TABLE role (
	id integer not null auto_increment,
    title varchar(30),
    salary decimal(10, 2),
    department_id integer,
    FOREIGN KEY(department_id) REFERENCES department(id),
    primary key(id)
);
CREATE TABLE employee (
	id integer not null auto_increment,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    role_id integer,
	FOREIGN KEY(role_id) REFERENCES role(id),
    manager_id integer,
    FOREIGN KEY(manager_id) REFERENCES employee(id),
    primary key(id)
);
Select * From role;
SELECT name, id as value FROM department;
SELECT role.title , role.salary , name  FROM role LEFT JOIN department ON department_id = department.id;

SELECT CONCAT(employee.first_name,' ', employee.last_name) AS Employee, 
role.title AS Position, department.name AS Department, role.salary AS Salary, 
CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
FROM employee
LEFT JOIN employee manager on manager.id = employee.manager_id
INNER JOIN role ON (role.id = employee.role_id)
INNER JOIN department ON (department.id = role.department_id)
ORDER BY department;