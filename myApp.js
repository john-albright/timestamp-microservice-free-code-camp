var express = require('express');
app = express();

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
    var currentTime = time;
    var unixTime = time.getTime();
    res.json({"unix": unixTime, "time": currentTime.toUTCString()});
});

// Display the time entered by the user after the path /api
app.get('/api/:time', (req, res) => {
    // Extract the number entered after the time
    var enteredTime = req.params.time;

    // Try to parse the string entered
    var parsed = Date.parse(enteredTime);

    // If parsed is a number, treat the entered value as a valid UTC time
    // If parsed is NaN, treat the entered value as a valid unix time
    if (!isNaN(parsed)) {
        var utc = new Date(enteredTime);
        var unix = utc.getTime();
    } else {
        unix = new Number(enteredTime); 
        utc = new  Date(unix);
    }

    // Debug statement to see the original values and conversions
    console.log(`entered time: ${enteredTime} current time: ${utc} unix time: ${unix}`);

    // Send an error JSON object if the date is still invalid
    // Otherwise, send the time in unix and utc format
    if (utc == "Invalid Date") {
        res.json({"error": utc});
    } else {
        res.json({'unix': unix, 'utc': utc.toUTCString()});
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