var mysql = require("mysql"); // we'll be using mysql
var inquirer = require("inquirer"); // we use prompts 
var myqueries = require('./sqlqueries'); // we'll be querying the database
var consoleOutputter = require("console.table"); // we'll prettify the output a bit

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
            message: "What would you like to do--[ADD], [VIEW], [UPDATE], or [DELETE]--a table? Select EXIT to end",
            choices: ["ADD", "VIEW", "UPDATE", "DELETE", "EXIT"]
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
                case "DELETE":
                    deleteEmployee();
                    break;
                default:
                    connection.end();
                    break;
            }
        });
}

//
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
                        type: "rawlist",
                        choices: () => {
                            let choiceArray = [];
                            choiceArray.push("000 No manager");

                            managers.forEach(element => {
                                choiceArray.push(`${element.id.toString().padStart(3, '0')} ${element.first_name} ${element.last_name}`);
                            });

                            return choiceArray;
                        },
                        message: "Who is the manager for this employee? Select zero if this employee has no manager."
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

    inquirer
        .prompt([
            {
                name: "whatToView",
                type: "list",
                choices: ["View all Roles", "View Sum"],
                message: "[View all Roles] or [View Sum] of salaries of employees for a given department"
            }
        ])
        .then(answer => {
            switch (answer.whatToView) {
                case "View all Roles":
                    connection.query(myqueries.viewAllRoles.all, (err, results) => {
                        if (err) throw err;
                        const gotTable = consoleOutputter.getTable(results);
                        console.log(gotTable);
                        start();
                    });
                    break;
                case "View Sum":
                    connection.query(myqueries.viewAllDepts.all, (err, results) => {
                        if (err) throw err;

                        inquirer
                            .prompt([
                                {
                                    name: "chooseDeptToGroupBy",
                                    type: "list",
                                    choices: () => {
                                        deptOptions = [];

                                        for (let i = 0; i < results.length; i++) {
                                            deptOptions.push(`ID:${results[i].ID.toString().padStart(3, '0')}, ${results[i].Department}`)
                                        }

                                        if (deptOptions.length < 1) {
                                            deptOptions.push("No departments available");
                                        }

                                        return deptOptions;
                                    },
                                    message: "Choose the department you want to group by"
                                }
                            ])
                            .then(answer => {
                                connection.query(myqueries.sumSalaries.salaries, [answer.chooseDeptToGroupBy.substring(3, 6)],
                                    (err, results) => {
                                        if (err) throw err;
                                        const gotTable = consoleOutputter.getTable(results);
                                        console.log(gotTable);
                                        start();
                                    });
                            });
                    });
                    break;
                default:
                    break;
            }
        });
}

function viewEmployee() {

    connection.query(myqueries.viewAllEmployees.all, (err, results) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "viewByEmployeeOrManager",
                    type: "list",
                    message: "Do you want to [View All Employees] or [View Employees by Manager]?",
                    choices: ["[View All Employees]", "[View Employees by Manager]"]
                }
            ])
            .then(answer => {
                switch (answer.viewByEmployeeOrManager) {
                    case "[View All Employees]":
                        const gotTable = consoleOutputter.getTable(results);
                        console.log(gotTable);
                        start();
                        break;
                    case "[View Employees by Manager]":
                        inquirer
                            .prompt([
                                {
                                    name: "viewByManager",
                                    type: "list",
                                    message: "Select a manager you want to search by.",
                                    choices: () => {
                                        arrayToDisplayEmps = [];

                                        for (let i = 0; i < results.length; i++) {
                                            if (results[i].Manager_Id !== null) {
                                                const foundMan = results.find(element => element.Employee_ID === results[i].Manager_Id);
                                                const foundString = arrayToDisplayEmps.find(element =>
                                                    foundMan.Employee_ID.toString().padStart(3, '0') === element.substring(3, 6));

                                                if (foundString === undefined || foundString === null) {
                                                    arrayToDisplayEmps.push(returnEmployeeInStringFormat(foundMan));
                                                }
                                            }

                                        }

                                        if (arrayToDisplayEmps.length < 1) {
                                            arrayToDisplayEmps.push("No managers found. Press Enter");
                                        }

                                        return arrayToDisplayEmps;
                                    }
                                }
                            ])
                            .then(answer => {
                                if (answer.viewByManager.includes("No managers found")) {
                                    start();
                                }
                                else {
                                    const manid = answer.viewByManager.substring(3, 6);
                                    connection.query(myqueries.viewByManager.all, [manid], (err, resultSet) => {
                                        if (err) throw err;
                                        const gotTable = consoleOutputter.getTable(resultSet);
                                        console.log(gotTable);
                                        start();
                                    });
                                }
                            });
                        break;
                    default:
                        break;
                }
            });
    });
}

function deleteEmployee(){
    connection.query(myqueries.viewAllEmployees.all, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "deleteEmp",
                    type: "rawlist",
                    choices: () => {
                        arrayEmps = [];
                        results.forEach(elem => {
                            arrayEmps.push(returnEmployeeInStringFormat(elem));
                        });

                        return arrayEmps;
                    },
                    message: "Which employee would you like to delete?"
            }
            
        ])
        .then(answer => {
            const empToDelete = answer.deleteEmp.substring(3, 6);
            connection.query(myqueries.deleteEmployee.deleteIt, [empToDelete], (err, result) => {
                if (err) throw err;
                console.log("Deletion successful!");
                start();
            });
        });
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
                        return utilityReturnEmpChoice(results);
                    },
                    message: "Which employee would you like to update?"

                }])
                .then((gotEmp) => {
                    inquirer
                        .prompt([
                            {
                                name: "RoleOrManager",
                                type: "list",
                                choices: ["Employee Role", "Employee Manager"],
                                message: "Select which one you want to update"
                            }
                        ])
                        .then(gotEmpOrMan => {
                            switch (gotEmpOrMan.RoleOrManager) {
                                case "Employee Role":
                                    updateRole(gotEmp, resultsRoles);
                                    break;
                                case "Employee Manager":
                                    updateManager(gotEmp, results);
                                    break;
                                default:
                                    break;
                            }
                        });
                });
        });
    });
}

function updateRole(gotEmp, resultsRoles) {

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
}

function updateManager(gotEmp, listOfEmps) {
    inquirer
        .prompt([
            {
                name: "updateMan",
                type: "rawlist",
                choices: () => {
                    const eligibleManagers = determineCircularManager(listOfEmps, gotEmp); //   utilityReturnEmpChoiceFilter(listOfEmps, gotEmp);
                    let optionsEligibleManagers = [];
                    optionsEligibleManagers.push("No manager");
                    for (let i = 0; i < eligibleManagers.length; i++) {
                        optionsEligibleManagers.push(returnEmployeeInStringFormat(eligibleManagers[i]));
                    }

                    if (optionsEligibleManagers.length < 2) {
                        console.log("There are no employees who can be this employee's manager. Press Enter.");
                    }

                    return optionsEligibleManagers;
                },

                message: "Choose the manager"
            }
        ])
        .then((answer) => {
            let params = [null, gotEmp.updateEmp.substring(3, 6)];

            if (!answer.updateMan.includes("No manager")) {
                params[0] = answer.updateMan.substring(3, 6);
            }
            connection.query(myqueries.updateEmployeeManager.update, params, (err, updatedMan) => {
                if (err) throw err;
                console.log("success updating an employee's manager");
                start();
            })
        })
}

function utilityReturnEmpChoice(results) {
    let choiceArray = [];
    results.forEach((element) => {
        choiceArray.push(returnEmployeeInStringFormat(element));
    });

    return choiceArray;
}

// make sure user can't do something that doesn't make sense--you can't have employees as managers of each other.
function determineCircularManager(results, emp) {
    managers = [];
    let found = false;

    const empid = emp.updateEmp.substring(3, 6);
    const empint = parseInt(empid);

    for (let i = 0; i < results.length; i++) {
        const elem = results[i];

        const inelem = elem.Employee_ID; //
        let manId = elem.Manager_Id; // 
        if (empint === inelem || empint === manId) {
            continue;
        }

        let useit = true;
        while (empint !== manId && manId !== null) {
            const foundelem = results.find(element => {

                return element.Employee_ID === manId;
            });

            manId = foundelem.Manager_Id; // 

            if (manId === empint) {
                useit = false;
                break;
            }

        }

        if (useit) {
            managers.push(elem);
        }
    }

    return managers;
}

function getManagerID(gotman) {
    const index = gotman.indexOf("Manager ID:");
    const endindex = index + "Manager ID:".length; //11;
    const manId = gotman.substring(endindex, endindex + 3);
    return manId;
}

function returnEmployeeInStringFormat(element) {
    return `ID:${element.Employee_ID.toString().padStart(3, '0')} Name:${element.First_Name} ${element.Last_Name}, Title:${element.Title}, Salary:${element.Salary}, Department:${element.Department}, Manager ID:${element.Manager_Id !== null ? element.Manager_Id.toString().padStart(3, '0') : null}, Manager:${element.Manager_Name}`;
}