const thequeries = {
    addDepartment : {
       dept:  `INSERT INTO department SET ?`
        
    },
    addRole : {
        role: `INSERT INTO role SET ?`,
        getDeptCode : `SELECT * FROM department`
    },
    addEmp : {
        role : `SELECT * FROM role`,
        manager: `
        select *
        from employee emp
        `,
        insert: `INSERT INTO employee SET ?`
    }
}

module.exports = thequeries;