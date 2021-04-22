CREATE DATABASE company_db;

USE company_db;

CREATE TABLE employee (
	id integer not null auto_increment,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    role_id integer,
    manager_id integer,
    primary key(id)
);
CREATE TABLE role (
	id integer not null auto_increment,
    title varchar(30),
    salary decimal(10, 2),
    department_id integer,
    primary key(id)
);
CREATE TABLE department(
	id integer not null auto_increment,
    name varchar(30),
    primary key(id)
);