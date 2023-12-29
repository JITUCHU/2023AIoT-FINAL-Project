//mysql 접속 객체 모듈화 부분
var mysql = require('mysql2');//pip install mysql2
var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'smart_factory'
});
db.connect();

module.exports = db;