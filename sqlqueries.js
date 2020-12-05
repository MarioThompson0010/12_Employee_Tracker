const thequeries = {
    addDepartment: {

        dept: `
        INSERT INTO department SET ?`

    },
    addRole: {
        
        role: `
        INSERT INTO role SET ?`,
        getDeptCode: `SELECT * FROM department`
    },
    addEmp: {
        role: `
        SELECT * FROM role`,
        manager: `

        SELECT *
        FROM employee emp
        `,
        insert: `
        INSERT INTO employee SET ?`
    },
    viewAllEmployees: {
        all: `
        
            SELECT emp.id AS 'Employee_ID',
            emp.first_name AS 'First_Name', 
            emp.last_name AS 'Last_Name', 
            rl.title AS 'Title', 
            rl.salary AS 'Salary', 
            dp.name AS 'Department',
            emp2.id AS 'Manager_Id',
            CONCAT(emp2.first_name, " ", emp2.last_name) AS 'Manager_Name' 
            
            FROM employee emp
            LEFT JOIN role rl ON
            emp.role_id = rl.id
            LEFT JOIN department dp ON
            rl.department_id = dp.id
            LEFT JOIN employee emp2 ON
            emp.manager_id = emp2.id

            ORDER BY emp.id
        `
    },
    viewByManager : {
        all: `

                SELECT emp.id AS 'Employee_ID',
                emp.first_name AS 'First_Name', 
                emp.last_name AS 'Last_Name', 
                rl.title AS 'Title', 
                rl.salary AS 'Salary', 
                dp.name AS 'Department',
                emp2.id AS 'Manager_Id',
                CONCAT(emp2.first_name, " ", emp2.last_name) AS 'Manager_Name' 

                FROM employee emp
                LEFT JOIN role rl ON
                emp.role_id = rl.id
                LEFT JOIN department dp ON
                rl.department_id = dp.id
                LEFT JOIN employee emp2 ON
                emp.manager_id = emp2.id
                WHERE emp.Manager_Id = ?

                ORDER BY emp.id
        
        `
    },
    viewAllDepts: {
        all:
            `
            SELECT dp.id as 'ID',
            dp.name as 'Department'
            FROM department dp
            ORDER BY dp.id
        `
    },
    viewAllRoles: {
        all:
            `
            SELECT rl.id as 'ID', 
            rl.title as 'Title',
            rl.salary as 'Salary',
            dp.name as 'Department'
            FROM role rl
            LEFT JOIN department dp ON
            rl.department_id = dp.id
            ORDER BY rl.id
        `
    },
    updateEmployeeRole: {
        update: `
            UPDATE employee emp
            SET emp.role_id = ?
            WHERE emp.id = ?
        `
    },
    updateEmployeeManager: {
        update: `
        UPDATE employee emp
        SET emp.manager_id = ?
        WHERE emp.id = ?
    `
    },
    sumSalaries: {
        salaries: `
        

                        
            
           SELECT salaryTbl.Department as 'Department', SUM(salaryTbl.Salary) AS 'SUM'
           FROM 
        
            (SELECT emp.id AS 'Employee_ID',
            emp.first_name AS 'First_Name', 
            emp.last_name AS 'Last_Name', 
            rl.title AS 'Title', 
            rl.salary AS 'Salary', 
            dp.id AS 'DeptId',
            dp.name AS 'Department',
            emp2.id AS 'Manager_Id',
            CONCAT(emp2.first_name, " ", emp2.last_name) AS 'Manager_Name' 
            
            FROM employee emp
            LEFT JOIN role rl ON
            emp.role_id = rl.id
            LEFT JOIN department dp ON
            rl.department_id = dp.id
            LEFT JOIN employee emp2 ON
            emp.manager_id = emp2.id

            ORDER BY emp.id) AS salaryTbl
            
            GROUP BY salaryTbl.DeptId
            HAVING salaryTbl.DeptId = ?

        `
    },
    deleteEmployee : {
        deleteIt: `
        

            DELETE 
            FROM employee 
            WHERE id = ?
        
        `
    }
}

module.exports = thequeries;