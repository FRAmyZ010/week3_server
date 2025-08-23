const mysql = require('mysql2');
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'week4_expenses'
})
module.exports = connection;