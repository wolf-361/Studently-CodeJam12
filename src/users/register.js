const crypto = require('crypto');
const jwt = require('jsonwebtoken');

function register(req, res, database, jwt_secret_key) {
//This function is called when a form is posted at http://localhost:3000/api/register
//It takes the request, the response and the database connection as parameters

    if(!req.body.username || !req.body.password || !req.body.email) {
    //If the request doesn't contain the username, the password and the email
        res.status(400).send('Missing parameters');
        return;
    }

    database.query('SELECT * FROM Account WHERE username = ? OR email = ?', [req.body.username, req.body.email], function (err, results) {
    //Check if the username and email adress are already taken

        if(err) {
            res.status(500).send('An error occured while trying to the database: ' + err.message);
            return;
        }

        if(results.length > 0) {
            res.status(400).send('Username or email already taken');
            return;
        }

        let hashedPassword = crypto.createHmac('sha256', req.body.password).digest('hex');

        database.query('INSERT INTO Account (username, password_hash, email) VALUES (?, ?, ?)', [req.body.username, hashedPassword, req.body.email], function (err, results) {
        //Insert the user in the database
            if(err) {
                res.status(500).send('An error occured while trying to database: ' + err.message);
                return;
            }

            const token = jwt.sign({"id": results.insertId}, jwt_secret_key, {
                algorithm: "HS256",
                expiresIn: 4800,
            });

            res.status(200).send(token);
        });
    });
}

module.exports = register;
