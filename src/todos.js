const jwt = require('jsonwebtoken');

const { checkToken } = require('./auth');

function addTodo (req, res, database, jwt_secret_key) {

    if(!req.body.userId || !req.body.text) {
    //If the request doesn't contain the userId or the text
        res.status(400).send('Missing parameters');
        return;
    }

    if(!checkToken(req.body.userId, jwt_secret_key)) {
    //If the token is invalid
        res.status(401).send('Invalid token');
        return;
    }

    let userId = checkToken(req.body.userId, jwt_secret_key).id;

    database.query('INSERT INTO Todo (account, text) VALUES (?, ?)', [userId, req.body.text], function (err, results) {
    //Insert the todo in the database

        if(err) {
        //If the databse return's an error
            res.status(500).send('An error occured while trying to database: ' + err.message);
            return;
        }

        res.status(200).send(String(results.insertId));
    });
}

function getTodos(req, res, database, jwt_secret_key) {

    if(!req.body.userId) {
    //If the request doesn't contain the userId
        res.status(400).send('Missing parameters');
        return;
    }

    if(!checkToken(req.body.userId, jwt_secret_key)) {
    //If the token is invalid
        res.status(401).send('Invalid token');
        return;
    }

    let userId = checkToken(req.body.userId, jwt_secret_key).id;

    database.query('SELECT * FROM Todo WHERE account = ? AND done = 0', userId, function (err, results) {
    //Get the todos from the database

        if(err) {
        //If the databse return's an error
            res.status(500).send('An error occured while trying to database: ' + err.message);
            return;
        }

        res.status(200).send(results);
    });
}

function markDone(req, res, database, jwt_secret_key) {

    if(!req.body.userId || !req.body.todoId) {
    //If the request doesn't contain the userId or the todoId
        res.status(400).send('Missing parameters');
        return;
    }

    if(!checkToken(req.body.userId, jwt_secret_key)) {
    //If the token is invalid
        res.status(401).send('Invalid token');
        return;
    }

    let userId = checkToken(req.body.userId, jwt_secret_key).id;

    database.query('UPDATE Todo SET done = 1 WHERE account = ? AND id = ?', [userId, req.body.todoId], function (err, results) {
    //Mark the todo as done in the database

        if(err) {
        //If the databse return's an error
            res.status(500).send('An error occured while trying to database: ' + err.message);
            return;
        }

        res.status(200).send('Todo marked as done');
    });
}

module.exports = {addTodo, getTodos, markDone};
