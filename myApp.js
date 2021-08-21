var express = require('express');
app = express();
const dateformat = require('dateformat');

// Display the index page for GET requests to the root (/) path
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

// Mount the middleware to serve the styles sheet in the public folder
app.use("/public", express.static(__dirname + "/public"));

// Display the current time and its unix conversion for GET requests to the path /api
// Use JSON notation! 
app.get('/api', (req, res) => {
    var time = new Date();
    var currentTime = time.toString();
    var unixTime = time.getTime();
    res.json({"unix": unixTime, "time": currentTime});
});

// Display the time entered by the user after the path /api
app.get('/api/:time', (req, res) => {
    // Extract the number entered after the time
    var enteredTime = req.params.time;

    // Assume that the date was written in YYYY-MM-DD form 
    var currentTime = new Date(enteredTime);
    var unixTime = currentTime.getTime();
    console.log(`entered time: ${enteredTime} current time: ${currentTime} unix time: ${unixTime}`);

    if (!unixTime) {
        //enteredTime += 'T00:00:00.000Z';
        unixTime = new Number(enteredTime);
        currentTime = new Date(unixTime);
    }

    // Debug statement to see the original values and conversions
    console.log(`entered time: ${enteredTime} current time: ${currentTime} unix time: ${unixTime}`);

    // Send an error JSON object if the date is still invalid
    // Otherwise, send the time in unix and utc format
    if (currentTime == "Invalid Date") {
        res.json({"error": currentTime});
    } else {
        res.json({'unix': unixTime, 'utc': currentTime.toUTCString()});
    }
});

// Print to the console information about all requests made 
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} ${req.ip}`);
    next();
});

// Get the port or assign it to 3000 if there is none 
var port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Node is listening on port ${port}...`));