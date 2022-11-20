var fs = require('fs');

function streamMusic(req, res, sound) {

    var music = './audio/' + sound;
    var stat = fs.statSync(music);
    range = req.headers.range;
    var readStream;
    
    if (range !== undefined) {
        // remove 'bytes=' and split the string by '-'
        var parts = range.replace(/bytes=/, "").split("-");

        var partial_start = parts[0];
        var partial_end = parts[1];

        if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
            return res.sendStatus(500);         
        }
        // convert string to integer (start)
        var start = parseInt(partial_start, 10);
        // convert string to integer (end)
        // if partial_end doesn't exist, end equals whole file size - 1
        var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
        // content length
        var content_length = (end - start) + 1;

        res.status(206).header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': content_length,
            'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
        });
        
        // Read the stream of starting & ending part
        readStream = fs.createReadStream(music, {start: start, end: end});

    } else {
        res.header({
            'Content-Type': 'audio/mpeg',
            'Content-Length': stat.size
        });
        readStream = fs.createReadStream(music);
    }

    readStream.pipe(res);
}

module.exports = { streamMusic };
