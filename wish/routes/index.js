var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("Sending main page");
    res.sendfile('main.html', { root: 'public' });
});

router.get('/login', function(req, res, next) {
    console.log("In login");
    response = { response: "logged in" };
    res.send(response);
});

router.get('/register', function(req, res, next) {
    console.log("In register");
    res.send("login");
});

router.get('/find/user', function(req, res, next) {
    console.log("In find");
    res.status(200);
});

router.get('/get/board', function(req, res, next) {
    console.log("In find");
    res.status(200);
});


module.exports = router;
