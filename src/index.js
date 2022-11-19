const mysql = require('mysql');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

let connection = mysql.createConnection({
    host: 'database',
    user: 'codejam',
    password: 'codejam',
    database: 'codejam'
});

connection.connect(function(err) {
    if (err) {
      return console.error('An error occured while trying to connect to the database: ' + err.message);
    }
  
    console.log('Connected to the database.');
  });


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

