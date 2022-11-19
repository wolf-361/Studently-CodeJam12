const mysql = require('mysql'); //For database interactions
const express = require('express'); //For serving the web app
const bodyParser = require('body-parser'); //For parsing the post request data

const app = express(); //Instanciate the express app

let database = mysql.createConnection({
    host: 'database',
    user: 'codejam',
    password: 'codejam',
    database: 'codejam'
});
//Define database credentials

database.connect(function (err) {
//Connect to the database with credentials defined above

    if(err) {
        console.error('An error occured while trying to connect to the database: ' + err.message);
        process.exit(1);
    }

    console.log('Connected to the database.');
});

app.use(bodyParser.json({ extended: true }));
//Allow to parse json sended from the frontend

app.get('/', (req, res) => {
//When the user access the root of the website (http://localhost:3000/)
    res.send('Quentin vas pas se tuer, Yeah !');
});

app.post('/api/register', (req, res) => {
//When a form is posted at http://localhost:3000/api/register
    console.log(req.body);
    res.send('post request received');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
