const thequeries = {
    addDepartment: {
        dept: `INSERT INTO department SET ?`

    },
    addRole: {
        role: `INSERT INTO role SET ?`,
        getDeptCode: `SELECT * FROM department`
    },
    addEmp: {
        role: `SELECT * FROM role`,
        manager: `
        select *
        from employee emp
        `,
        insert: `INSERT INTO employee SET ?`
    },
    viewAllEmployees: {
        all: `
        
            SELECT emp.id AS 'Employee_ID',
            emp.first_name AS 'First_Name', 
            emp.last_name AS 'Last_Name', 
            rl.title AS 'Title', 
            rl.salary AS 'Salary', 
            dp.name AS 'Department',
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
    viewAllDepts : {
        all: 
        `
            SELECT dp.id as 'ID',
            dp.name as 'Department'
            FROM department dp
            ORDER BY dp.id
        `
    },
    viewAllRoles : {
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
    updateRoleTitle : {
        update: `
        
            UPDATE role rl

            INNER JOIN employee emp ON
            emp.role_id = rl.id
            INNER JOIN department dp ON
            rl.department_id = dp.id

            SET rl.title = ?  
            WHERE emp.id = ? 
        
        `
    },
   updateRoleSalary : {
    update: `
                
            UPDATE role rl

            INNER JOIN employee emp ON
            emp.role_id = rl.id
            INNER JOIN department dp ON
            rl.department_id = dp.id

            SET rl.salary = ?  
            WHERE emp.id = ? 
`
    },
    updateRoleDepartment: {
        update: `
        
            UPDATE role rl

            INNER JOIN employee emp ON
            emp.role_id = rl.id
            INNER JOIN department dp ON
            rl.department_id = dp.id

            SET rl.department_id = ?

            WHERE emp.id = ?

        `
    }
}

            // rl.title = 'dude'
            // emp.id = 2

module.exports = thequeries;