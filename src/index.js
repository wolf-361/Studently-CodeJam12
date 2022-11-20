const mysql = require('mysql'); //For database interactions
const crypto = require('crypto'); //For hashing passwords and all cryptogaphic stuff
const express = require('express'); //For serving the web app
const bodyParser = require('body-parser'); //For parsing the post request data

const register = require('./users/register'); //The register function
const login = require('./users/login'); //The login function

const {newEvent, getEvents, deleteEvent} = require('./events'); //Events related functions
const {addTodo, getTodos, markDone} = require('./todos'); //Todos related functions

const app = express(); //Instanciate the express app
app.set('view engine', 'ejs');

let jwt_secret_key = "dxN3ucxNFmaPkTLdaH6GmFjip5#&X@1E8nRox*7DFHqIN%G#$b3V#osnBMwpi&s7oa9n3RfU#YWbTBmopl@V74ujhjt2Qvl9u8Mg&QAhQ3#s9dyauYjmtdFdOwmFa1bcX#*s3rvh19yFtW6xkeUe2X"

// Afficher les pages selon les liens du menu
app.get('/', (req, res) => {
    res.render('main');
});

app.get('/todolist', (req, res) => {
    res.render('todolist');
});

app.get('/calendar', (req, res) => {
    res.render('calendar');
});

app.get('/chat', (req, res) => {
    res.render('chat');
});

app.get('/meditation', (req, res) => {
    res.render('meditation');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

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


app.post('/api/register', (req, res) => {
//When a form is posted at http://localhost:3000/api/register
    register(req, res, database, jwt_secret_key);
});

app.post('/api/login', (req, res) => {
//When a form is posted at http://localhost:3000/api/login
    login(req, res, database, jwt_secret_key);
});

app.post('/api/event/new', (req, res) => {
//When a form is posted at http://localhost:3000/api/event/new')
    newEvent(req, res, database);
});

app.post('/api/event/get', (req, res) => {
//When a form is posted at http://localhost:3000/api/event/get
    getEvents(req, res, database);
});

app.post('/api/event/delete', (req, res) => {
//When a form is posted at http://localhost:3000/api/event/delete
    deleteEvent(req, res, database);
});

app.post('/api/todo/add', (req, res) => {
//When a form is posted at http://localhost:3000/api/todo/add
    addTodo(req, res, database);
});

app.post('/api/todo/get', (req, res) => {
//When a form is posted at http://localhost:3000/api/todo/get
    getTodos(req, res, database);
});

app.post('/api/todo/done', (req, res) => {
//When a form is posted at http://localhost:3000/api/todo/done
    markDone(req, res, database);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
