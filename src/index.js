const fs = require('fs'); //For reading files
const http = require('http'); //For creating socket server
const mysql = require('mysql'); //For database interactions
const crypto = require('crypto'); //For hashing passwords and all cryptogaphic stuff
const express = require('express'); //For serving the web app$
const bodyParser = require('body-parser'); //For parsing the post request data

const register = require('./users/register'); //The register function
const login = require('./users/login'); //The login function

const { checkToken } = require('./auth'); //The checkToken function
const {newEvent, getEvents, deleteEvent} = require('./events'); //Events related functions
const {addTodo, getTodos, markDone} = require('./todos'); //Todos related functions
const { streamMusic } = require('./stream'); //Music streaming related functions

const app = express(); //Instanciate the express app

const httpServer = http.createServer(app); //Creating the http server
const io = require('socket.io')(httpServer); //For socket server

io.on('connection', (socket) => { //When a new socket connects

    console.log('New socket connected');
        
    socket.on("message", (data) => {
        if(checkToken(data.token, jwt_secret_key)) { //Check if the token is valid

            let userId = checkToken(data.token, jwt_secret_key).id; //Get the user from the token
            let user;

            database.query("SELECT * FROM Account WHERE id = ?", [userId], (err, result) => { //Get the user from the database
                if(err) throw err;
                if(result.length > 0) {
                    user = result[0];

                } else {
                    socket.emit("error", {message: "User not found"});
                }

                if(user) {
                    io.emit("new-message", {message: data.message, user: user.username, channel: data.channel});

                    database.query("INSERT INTO Message (account, username, text, channel) VALUES (?, ?, ?, ?)", [userId, user.username, data.message, data.channel], (err, result) => {
                        if(err) throw err;
                    });
                    
                } //Send the message to all the connected sockets
            });

            // io.emit("message", data); //Send the message to all the clients
        }
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });
});

app.set('view engine', 'ejs');
app.use(express.static('pictures'));
app.use(express.static('gif'));
app.use(bodyParser.json({ extended: true }));
//Allow to parse json sended from the frontend

let jwt_secret_key = "dxN3ucxNFmaPkTLdaH6GmFjip5#&X@1E8nRox*7DFHqIN%G#$b3V#osnBMwpi&s7oa9n3RfU#YWbTBmopl@V74ujhjt2Qvl9u8Mg&QAhQ3#s9dyauYjmtdFdOwmFa1bcX#*s3rvh19yFtW6xkeUe2X"

// Afficher les pages selon les liens du menu
app.get('/', (req, res) => {
    res.render('main');
});

app.get('/todolist', (req, res) => {
    res.render('todolist');
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

app.get('/audio/:sound', (req, res) => {
    streamMusic(req, res, req.params.sound);
});

app.get('/chat/get-messages/:channel', (req, res) => {
    let channel = req.params.channel;
    let messages = [];

    database.query("SELECT * FROM Message WHERE channel = ?", [channel], (err, result) => {
        if(err) throw err;
        if(result.length > 0) {
            result.forEach((message) => {
                messages.push(message);
            });
        }

        res.json(messages);
    });
});

app.post('/api/get-new-background', (req, res) => {
    
    let background;
    let newBackground;

    try {
        background = req.body.background;

    } catch (error) {
        background = "montreal-night-1.avif";
    }

    if(background == null) {
        background = "montreal-night-1.avif";
    }

    let files = fs.readdirSync('pictures');

    for(let i = 0; i < files.length; i++) {
        if(files[i] === background) {
            if(i + 1 == files.length) {
                newBackground = files[0];
    
            } else {
                newBackground = files[i + 1];
            }
        }
    }

    res.status(200).send(newBackground);
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
    addTodo(req, res, database, jwt_secret_key);
});

app.post('/api/todo/get', (req, res) => {
//When a form is posted at http://localhost:3000/api/todo/get
    getTodos(req, res, database, jwt_secret_key);
});

app.post('/api/todo/done', (req, res) => {
//When a form is posted at http://localhost:3000/api/todo/done
    markDone(req, res, database, jwt_secret_key);
});

app.listen(3000, () => {
    httpServer.listen(3001);
    console.log('Server is running on port 3000');
});
