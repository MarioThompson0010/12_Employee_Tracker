var mysql = require("mysql");
var inquirer = require("inquirer");
var myqueries = require('./sqlqueries'); //

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
            message: "What would you like to do--[ADD], [VIEW], or [UPDATE]--a table?",
            choices: ["ADD", "VIEW", "UPDATE"]
        }])
        .then((answer) => {
            switch (answer.actionToPerform) {
                case "ADD":
                    addToTable(); //call add
                    break;
                case "VIEW": // view
                    break;
                case "UPDATE": // update
                    break;
                default: console.log("Error in action to perform");
                    break;
            }

            if (answer.actionToPerform === "ADD") {
                // call ADD
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
                    break;
                case "EMPLOYEE":
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
                    name: answer.whichTableToAddTo
                },
                (err) => {
                    if (err) throw err;

                    console.log("Department was successfully added!");
                    start();
                }
            );
        });
}
