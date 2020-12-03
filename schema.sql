DROP DATABASE IF EXISTS  employee_trackerDB;

CREATE DATABASE employee_trackerDB;


USE employee_trackerDB;

CREATE TABLE employee (
    id int AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id int NOT NULL,
    manager_id int,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id int AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary decimal(8, 2) NOT NULL,
    department_id int NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id int AUTO_INCREMENT,
    name VARCHAR(30) UNIQUE NOT NULL,
    PRIMARY KEY (id)
);