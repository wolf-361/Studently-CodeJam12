const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function login(req, res, database, jwt_secret_key) {
//This function is called when a form is posted at http://localhost:3000/api/login
//It takes the request, the response and the database connection as parameters

    if(!req.body.username || !req.body.password) {
    //If the request doesn't contain the username and the password
        res.status(400).send('Missing parameters');
        return;
    }

    database.query('SELECT * FROM Account WHERE username = ?', [req.body.username], function (err, results) {
    //Check if the username exists

        if(err) {
            res.status(500).send('An error occured while trying to the database: ' + err.message);
            return;
        }

        if(results.length == 0) {
            res.status(400).send('Username or password incorrect');
            return;
        }

        if(results[0].password_hash != crypto.createHmac('sha256', req.body.password).digest('hex')) {
            res.status(400).send('Username or password incorrect');
            return;
        }

        const token = jwt.sign({"id": results[0].id}, jwt_secret_key, {
            algorithm: "HS256",
            expiresIn: 4800,
        });

        res.status(200).send(token);
    });
}

module.exports = login;
