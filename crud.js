const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '1234',
  database: 'smart_factory'
});

// 데이터베이스 연결
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as ID ' + connection.threadId);
});

// 루트 엔드포인트 - 데이터 조회
app.get('/', (req, res) => {
  connection.query('SELECT * FROM your_table', (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

// 새로운 데이터 추가
app.post('/add', (req, res) => {
  const { name, email } = req.body;
  connection.query('INSERT INTO your_table (name, email) VALUES (?, ?)', [name, email], (error, results, fields) => {
    if (error) throw error;
    res.send('Data added successfully');
  });
});

// 데이터 업데이트
app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
  connection.query('UPDATE your_table SET name = ?, email = ? WHERE id = ?', [name, email, id], (error, results, fields) => {
    if (error) throw error;
    res.send('Data updated successfully');
  });
});

// 데이터 삭제
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM your_table WHERE id = ?', [id], (error, results, fields) => {
    if (error) throw error;
    res.send('Data deleted successfully');
  });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
