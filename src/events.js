function newEvent(req, res, database) {

    if(!req.body.userId || !req.body.beginning || !req.body.ending || !req.body.title) {
    //If the request doesn't contain the userId, the beginning, the ending and the title
        res.status(400).send('Missing parameters');
        return;
    }
    
    database.query('INSERT INTO Event (account, beginning, ending, title) VALUES (?, ?, ?, ?)', [req.body.userId, req.body.beginning, req.body.ending, req.body.title], function (err, results) {
    //Insert the event in the database

        if(err) {
        //If the databse return's an error
            res.status(500).send('An error occured while trying to database: ' + err.message);
            return;
        }

        res.status(200).send('Event registered');
    });
}

function getEvents(req, res, database) {
    
        if(!req.body.userId) {
        //If the request doesn't contain the userId
            res.status(400).send('Missing parameters');
            return;
        }
    
        database.query('SELECT * FROM Event WHERE account = ?', [req.body.userId], function (err, results) {
        //Get the events from the database
    
            if(err) {
            //If the databse return's an error
                res.status(500).send('An error occured while trying to database: ' + err.message);
                return;
            }
    
            res.status(200).send(results);
        });
}

function deleteEvent(req, res, database) {
    
    if(!req.body.userId || !req.body.eventId) {
    //If the request doesn't contain the userId or the eventId
        res.status(400).send('Missing parameters');
        return;
    }

    database.query('DELETE FROM Event WHERE account = ? AND id = ?', [req.body.userId, req.body.eventId], function (err, results) {
    //Delete the event from the database

        if(err) {
        //If the databse return's an error
            res.status(500).send('An error occured while trying to database: ' + err.message);
            return;
        }

        res.status(200).send('Event deleted');
    });
}

module.exports = {newEvent, getEvents, deleteEvent};
