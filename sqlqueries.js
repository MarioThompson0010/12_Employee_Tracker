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
        
            SELECT emp.first_name AS 'First Name', 
            emp.last_name AS 'Last Name', 
            rl.title AS 'Title', 
            rl.salary AS 'Salary', 
            dp.name AS 'Department',
            CONCAT(emp2.first_name, " ", emp2.last_name) AS 'Manager''s Name' 
            
            FROM employee emp
            LEFT JOIN role rl ON
            emp.role_id = rl.id
            LEFT JOIN department dp ON
            rl.department_id = dp.id
            LEFT JOIN employee emp2 ON
            emp.manager_id = emp2.id
        `
    },
    viewAllDepts : {
        all: 
        `
            SELECT *
            FROM department
        `
    }
}

module.exports = thequeries;