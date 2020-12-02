DROP DATABASE IF EXISTS  employee_trackerDB;

CREATE DATABASE employee_trackerDB;


USE employee_trackerDB;

CREATE TABLE employee (
    id int AUTO_INCREMNT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id int,
    manager_id int,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id int AUTO_INCREMNT,
    title VARCHAR(30),
    salary decimal,
    department_id int
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id int AUTO_INCREMNT,
    name VARCHAR(30)
    PRIMARY KEY (id)
);