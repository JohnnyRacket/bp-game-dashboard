const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require('body-parser');
var path = require('path');
//Port from environment variable or default - 4001
const port = process.env.PORT || 4001;

//Setting up express and adding socketIo middleware
const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }));

const server = http.createServer(app);
const io = socketIo(server);

// in memory for now
const tables = [];
const matches = [];

//Setting up a socket with the namespace "connection" for new sockets
io.on("connection", socket => {
    console.log("New client connected");
    //A special namespace "disconnect" for when a client disconnects
    socket.on("disconnect", () => console.log("Client disconnected"));
});

app.post("/api/gamestate/:id", function (req, res, next) {
    const matchId = req.params.id;
    //if this is the edge devices first time reporting in add it to tables
    if (!tables.some(m => m.id === matchId)) tables.push(matchId);
    // first lets parse the body here
    console.log("gamestate update from table " + matchId)
    //console.log(req.body);
    let bInactiveCups = 0;
    let aInactiveCups = 0;
    let match = {};
    // figure out how many cups have been hit by each team inactive == hit
    req.body.boxes.map(o => {
        if (o.Class === "inactive bp cup") {
            // is an inactive bp cup (hit cup)
            if (o.Left < 304) {
                aInactiveCups += 1;
            } else {
                bInactiveCups += 1;
            }
        }
    });

    let locations = req.body.boxes.filter(o => {
        if (o.Class === "active bp cup") {
            return true;
        }
        return false;
    });
    // console.log(locations);
    // normalize heights on wild boxes
    locations.map(o => {
        if (o.Bottom - o.Top > 50) o.Top = o.Top - ((o.Bottom - o.Top - 50) / 2)
    })
    locations = locations.map(o => ({ x: Math.floor((o.Left / 704) * 100), y: Math.floor((o.Top / 320) * 100) }));
    locations.sort(function (a, b) {
        return a.y - b.y;
    });
    match = {
        id: matchId,
        a: {
            cups: (10 - aInactiveCups),
            name: "Team1"
        },
        b: {
            cups: (10 - bInactiveCups),
            Name: "Team2"
        },
        image: "data:image/png;base64," + req.body.image || "",
        locations: locations
    }
    io.sockets.emit("gamestate_update", match);
    res.status(200).send();
});

//health check
app.get('/health', function (req, res) {
    return res.status(200).send();
});

// table api
app.get("/api/tables", function (req, res, next) {
    res.send(tables);
});

app.post("/api/tables", function (req, res, next) {
    matches.push(req.body);// expect names for teams and players
});

// allow it to serve use our static files from the frontend build folder
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// serve our frontend index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));