var mysql = require("mysql");
var inquirer = require("inquirer");
var myqueries = require('./sqlqueries'); //
var consoleOutputter = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employee_trackerDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {

    inquirer
        .prompt([{
            name: "actionToPerform",
            type: "list",
            message: "What would you like to do--[ADD], [VIEW], or [UPDATE]--a table? Select EXIT to end",
            choices: ["ADD", "VIEW", "UPDATE", "EXIT"]
        }])
        .then((answer) => {
            switch (answer.actionToPerform) {
                case "ADD":
                    addToTable(); //call add
                    break;
                case "VIEW": // view
                    viewTable();
                    break;
                case "UPDATE": // update
                    updateEmployee();
                    break;
                default:
                    connection.end();
                    break;
            }
        });
}

function addToTable() {
    inquirer
        .prompt([{
            name: "whichTableToAddTo",
            type: "list",
            message: "Do you want to add a [DEPARTMENT], a [ROLE], or an [EMPLOYEE]?",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]
        }])
        .then((answer) => {
            switch (answer.whichTableToAddTo) {
                case "DEPARTMENT":
                    userAddsDepartment();
                    break;
                case "ROLE":
                    userAddsRole();
                    break;
                case "EMPLOYEE":
                    userAddsEmployee();
                    break;
                default:
                    break;
            }
        });
}

function userAddsDepartment() {
    inquirer
        .prompt([
            {
                name: "userAddsDept",
                type: "input",
                message: "Type the department you would like to add, then press Enter."
            }
        ])
        .then((answer) => {
            connection.query(
                myqueries.addDepartment.dept,
                {
                    name: answer.userAddsDept
                },
                (err) => {
                    if (err) throw err;

                    console.log("Department was successfully added!");
                    start();
                }
            );
        });
}

function userAddsRole() {

    connection.query(myqueries.addRole.getDeptCode, (err, results) => {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "userAddsRole",
                    type: "input",
                    message: "Type the title you would like to add, then press Enter."
                },
                {
                    name: "userAddsSalary",
                    type: "input",
                    message: "Type the salary you would like to attach to this role, then press Enter.",
                    validate: (value) => {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "userAddsDepartment",
                    type: "list",
                    choices: () => {
                        let choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].name);
                        }
                        return choiceArray;
                    },
                    message: "What department would you like to put the role in?"
                }
            ])
            .then((answer) => {

                const deptChosen = results.find(dept => dept.name === answer.userAddsDepartment);
                connection.query(
                    myqueries.addRole.role,
                    {
                        title: answer.userAddsRole,
                        salary: answer.userAddsSalary,
                        department_id: deptChosen.id
                    },
                    (err) => {
                        if (err) throw err;

                        console.log("Role was successfully added!");
                        start();
                    }
                );
            });
    })
}

function userAddsEmployee() {

    connection.query(myqueries.addEmp.role, (err, results) => {
        if (err) throw err;
        let managers = null;

        connection.query(myqueries.addEmp.manager, (err2, results2) => {
            if (err2) throw err2;

            managers = results2;
            inquirer
                .prompt([
                    {
                        name: "userAddsFirstName",
                        type: "input",
                        message: "Type the first name, then press Enter."
                    },
                    {
                        name: "userAddsLastName",
                        type: "input",
                        message: "Type the last name, then press Enter."
                    },
                    {
                        name: "userAddsRole",
                        type: "list",
                        choices: () => {
                            let choiceArray = [];
                            for (var i = 0; i < results.length; i++) {
                                choiceArray.push(`${results[i].id.toString().padStart(3, '0')} ${results[i].title}`);
                            }
                            return choiceArray;
                        },
                        message: "What role would you like this employee to play?"
                    },
                    {
                        name: "userAddsManager",
                        type: "list",
                        choices: () => {
                            let choiceArray = [];
                            managers.forEach(element => {
                                choiceArray.push(`${element.id.toString().padStart(3, '0')} ${element.first_name} ${element.last_name}`);
                            });

                            choiceArray.push("000 No manager");
                            return choiceArray;
                        },
                        message: "Who is the manager for this employee? Leave blank if this employee has no manager."
                    }
                ])
                .then((answer) => {

                    const roleid = answer.userAddsRole.substring(0, 3);
                    const managerid = answer.userAddsManager.substring(0, 3);
                    connection.query(
                        myqueries.addEmp.insert,
                        {
                            first_name: answer.userAddsFirstName,
                            last_name: answer.userAddsLastName,
                            role_id: roleid,
                            manager_id: managerid === "000" ? null : managerid
                        },
                        (err) => {
                            if (err) throw err;

                            console.log("Employee was successfully added!");
                            start();
                        }
                    );
                });

        });
    })
}

function viewTable() {

    inquirer
        .prompt([{
            name: "whatToView",
            type: "list",
            choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"],
            message: "Select a table to view, then press Enter"

        }])
        .then((answer) => {
            switch (answer.whatToView) {
                case "DEPARTMENT":
                    viewDepartments();
                    break;
                case "ROLE":
                    viewRole();
                    break;
                case "EMPLOYEE":
                    viewEmployee();
                    break;
                default:
                    console.log("Error in table chosen. Add a table");
                    break;
            }
        });
}

function viewDepartments() {
    connection.query(myqueries.viewAllDepts.all, (err, results) => {
        if (err) throw err;
        const gotTable = consoleOutputter.getTable(results);
        console.log(gotTable);
        start();
    });
}

function viewRole() {
    connection.query(myqueries.viewAllRoles.all, (err, results) => {
        if (err) throw err;
        const gotTable = consoleOutputter.getTable(results);
        console.log(gotTable);
        start();
    });
}

function viewEmployee() {
    connection.query(myqueries.viewAllEmployees.all, (err, results) => {
        if (err) throw err;
        const gotTable = consoleOutputter.getTable(results);
        console.log(gotTable);
        start();
    });
}

function updateEmployee() {

    connection.query(myqueries.viewAllEmployees.all, (err, results) => {
        if (err) throw err;
        connection.query(myqueries.viewAllRoles.all, (err, resultsRoles) => {
            if (err) throw err;
            inquirer
                .prompt([{
                    name: "updateEmp",
                    type: "rawlist",
                    choices: () => {
                        let choiceArray = [];
                        results.forEach((element) => {
                            choiceArray.push(`ID:${element.Employee_ID.toString().padStart(3, '0')} Name:${element.First_Name} ${element.Last_Name}, Title:${element.Title}, Salary:${element.Salary}, Department:${element.Department}, Manager:${element.Manager_Name}`);
                        });

                        return choiceArray;
                    },
                    message: "Please choose which employee's role you would like to update"

                }])
                .then((gotEmp) => {
                    inquirer
                        .prompt([
                            {
                                name: "updateRole",
                                type: "list",
                                choices: () => {
                                    let choiceArray = [];

                                    for (let i = 0; i < resultsRoles.length; i++) {
                                        choiceArray.push(`ID:${resultsRoles[i].ID.toString().padStart(3, '0')}, Title:${resultsRoles[i].Title}, Salary:${resultsRoles[i].Salary}, Dept:${resultsRoles[i].Department}`);
                                    }

                                    return choiceArray;
                                },
                                message: "Which role would you like to attach to the employee instead?"
                            }
                        ])
                        .then((gotProperty) => {
                            const roleId = gotProperty.updateRole.substring(3, 6);
                            const empid = gotEmp.updateEmp.substring(3, 6);
                            connection.query(myqueries.updateEmployeeRole.update,
                                [
                                    roleId, empid
                                ],
                                (err, resultsUpdate) => {
                                    if (err) throw err;
                                    console.log("Successfully updated employee's role");
                                    start();
                                });
                        });
                });
        });
    });
}
