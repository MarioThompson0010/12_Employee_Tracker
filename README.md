# 12_Employee_Tracker

## Link to app and Screenshots:
[Link to Employee Tracker](https://hidden-hollows-43738.herokuapp.com/)
![Screenshot 1](https://github.com/MarioThompson0010/11_Note_Taker/blob/main/screenshots/Home_Page.PNG)
![Screenshot 1](https://github.com/MarioThompson0010/11_Note_Taker/blob/main/screenshots/Notes_Page.PNG)

List of technologies used: npm, inquirer, Javascript, Nodejs, Mysql

## Description: Employee Tracker 

This program allows you to view employees, their roles, or all departments.  It also allows you to update an employee, a role, or a department.  You can also add any one of the three afore-mentioned.  You can also delete an employee.

You can also view the sum total earnings of each employee within one department.  You get to choose the department.

The program uses a SQL database to store persistent information.  The interface is inquirer.  

## How to run the program:

1) Open an integrated terminal in the directory of the employeeTracker.js file
2) Type "npm i" to install the dependencies
3) Type "node employeeTracker.js"
4) Answer the questions and/or prompts

* You have the option to perform all viewing and maintenance except deleting roles and departments.
Note that to see the sum of salaries by department, you have to drill into viewing the roles.  So, if you want to view that, just select "VIEW", then "ROLES", and the rest of the prompts should guide you through clearly.

## How to test this app

Create a bunch of departments first, then roles, then employees. View them all. Update the roles. Update the manager of a selected employee.  Delete an employee.  After each add, update, or delete, view a list of whatever you changed.

View the sum of employees' earnings by selecting "VIEW", then "ROLES".  The rest of the prompts will guide you through.
