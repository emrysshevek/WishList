var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uuidv4 = require('uuid/v4');

mongoose.connect('mongodb://localhost/wishlistDB', { useNewUrlParser: true }); //Connects to a mongo database called "commentDB"

var userSchema = mongoose.Schema({ //Defines the Schema for this database
    token: String,
    username: String,
    password: String,
    boards: [String]
});
var boardSchema = mongoose.Schema({ //Defines the Schema for this database
    owner: String,
    boardName: String,
    password: String,
    settings: { hasPassword: Boolean, hide: Boolean },
    items: [String]
});
var itemSchema = mongoose.Schema({ //Defines the Schema for this database
    board: String,
    picture: String,
    title: String,
    description: String,
    link: String,
    enabled: Boolean
});

var User = mongoose.model('User', userSchema); //Makes an object from that schema as a model
var Board = mongoose.model('Board', boardSchema);
var Item = mongoose.model('Item', itemSchema);

var db = mongoose.connection; //Saves the connection as a variable to use
db.on('error', console.error.bind(console, 'connection error:')); //Checks for connection errors
db.once('open', function() { //Lets us know when we're connected
    console.log('Connected');
});

var testUser = new User({ username: "masonfp", password: "password", boards: ["board1"] });
var testBoard = new Board({ owner: "masonfp", boardName: "board1", password: "password", settings: { hasPassword: true, hide: false }, items: ["item1"] });
var testItem = new Item({
    board: "board1",
    picture: "https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiVorvBq8reAhWnllQKHeM0Bq4QjRx6BAgBEAU&url=https%3A%2F%2Fwww.today.com%2Ffood%2Fskittles-myth-are-red-yellow-green-all-same-flavor-t121718&psig=AOvVaw2EThyNk-P3XlXnMtIbhzYT&ust=1541956970724424",
    title: "skittles",
    description: "yummy test candy",
    link: "https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwiVorvBq8reAhWnllQKHeM0Bq4Qjhx6BAgBEAM&url=https%3A%2F%2Fwww.today.com%2Ffood%2Fskittles-myth-are-red-yellow-green-all-same-flavor-t121718&psig=AOvVaw2EThyNk-P3XlXnMtIbhzYT&ust=1541956970724424"
});

// testUser.save(function(err, user) {
//     if (err) return console.error(err);
//     console.log(user);
// });
// testBoard.save(function(err, board) {
//     if (err) return console.error(err);
//     console.log(board);
// });
// testItem.save(function(err, item) {
//     if (err) return console.error(err);
//     console.log(item);
// });

/* GET main page. */
router.get('/', function(req, res, next) {
    console.log ("Sending main page");
    res.sendfile('main.html', { root: 'public' });
});

// /* GET home page.*/
// router.get('/home', function(req, res, next) {
//     console.log("Sending home page");
//     res.sendfile('home.html', { root: 'public' });
// });

/* GET list page. */
router.get('/', function(req, res, next) {
    console.log("Sending list page");
    res.sendfile('list.html', { root: 'public' });
});

router.post('/login', function(req, res, next) {
    console.log("In login");
    var username = req.body.username;
    var password = req.body.password;
    console.log("username: " + username + " password: " + password);
    User.findOne({ username: username, password: password }, function(err, user) {
        if (err) {
            console.log(err);
            console.log("ERROR");
        }
        if (user) {
            var token = uuidv4();
            console.log(token);
            user.token = token;
            res.send({ success: true, token: token });
        }
        else {
            res.send({ success: false })
        }
        console.log(user);
    })
    // response = { response: "logged in" };
    // res.send(response);
});

router.post('/register', function(req, res, next) {
    // TODO: finish this route
    console.log("In register");
    console.log("In login");
    var username = req.body.username;
    var password = req.body.password;
    console.log("username: " + username + " password: " + password);
    User.findOne({ username: username }, function(err, user) {
        if (err) {
            console.log(err);
            console.log("ERROR");
        }
        if (!user) {
            var token = uuidv4();
            var newUser = new User({ username: username, password: password, token: token })
            newUser.save(function(err, user) {
                if (err) return console.error(err);
                console.log(user);
            });
            console.log(token);
            res.send({ success: true, token: token });
        }
        else {
            res.send({ success: false })
        }
        console.log(user);
    })
    // response = { response: "logged in" };
    // res.send(response);
    res.status(200);
});

router.get('/user', function(req, res, next) {
    console.log("In get user");
    var query = req.query.q;
    console.log(query);
    res.status(200);
});

router.post('/user', function(req, res, next) {
    console.log("In find");
    res.status(200);
});

router.put('/user', function(req, res, next) {
    console.log("In find");
    res.status(200);
});

router.delete('/user', function(req, res, next) {
    console.log("In find");
    res.status(200);
});

router.get('/board', function(req, res, next) {
    console.log("In get board");
    var owner = req.query.owner;
    var board = req.query.board;
    console.log("Owner: " + owner + " Board: " + board);
    var findParams = {};
    if (owner) {
        findParams.owner = owner;
    }
    if (board) {
        findParams.boardName = board;
    }
    console.log(findParams);
    Board.find(findParams, function(err, boards) {
        if (err) {
            console.log(err);
            console.log("ERROR");
        }
        res.send(boards);
    });
});

router.post('/board', function(req, res, next) {
    console.log("In find");
    res.status(200);
});

router.put('/board', function(req, res, next) {
    console.log("In find");
    res.status(200);
});

router.delete('/board', function(req, res, next) {
    console.log("In find");
    res.status(200);
});

router.get('/item', function(req, res, next) {
    console.log("In find");
    res.status(200);
});

router.post('/item', function(req, res, next) {
    console.log("In find");
    res.status(200);
});

router.delete('/item', function(req, res, next) {
    console.log("In find");
    res.status(200);
});

router.put('/item', function(req, res, next) {
    console.log("In find");
    res.status(200);
});

var getBoards = function(owner, boardName){
    
}


module.exports = router;
