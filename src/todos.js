function addTodo (req, res, database) {

    if(!req.body.userId || !req.body.text) {
    //If the request doesn't contain the userId or the text
        res.status(400).send('Missing parameters');
        return;
    }

    database.query('INSERT INTO Todo (account, text) VALUES (?, ?)', [req.body.userId, req.body.text], function (err, results) {
    //Insert the todo in the database

        if(err) {
        //If the databse return's an error
            res.status(500).send('An error occured while trying to database: ' + err.message);
            return;
        }

        res.status(200).send('Todo registered');
    });
}

function getTodos(req, res, database) {

    if(!req.body.userId) {
    //If the request doesn't contain the userId
        res.status(400).send('Missing parameters');
        return;
    }

    database.query('SELECT * FROM Todo WHERE account = ?', [req.body.userId], function (err, results) {
    //Get the todos from the database

        if(err) {
        //If the databse return's an error
            res.status(500).send('An error occured while trying to database: ' + err.message);
            return;
        }

        res.status(200).send(results);
    });
}

function markDone(req, res, database) {

    if(!req.body.userId || !req.body.todoId) {
    //If the request doesn't contain the userId or the todoId
        res.status(400).send('Missing parameters');
        return;
    }

    database.query('UPDATE Todo SET done = 1 WHERE account = ? AND id = ?', [req.body.userId, req.body.todoId], function (err, results) {
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
