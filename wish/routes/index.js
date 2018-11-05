var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("Sending main page");
    res.sendfile('main.html', { root: 'public' });
});

router.get('/login', function(req, res, next) {
    console.log("In login");
    res.status(200);
});

router.get('/register', function(req, res, next) {
    console.log("In register");
    res.send("login");
});

router.get('/find', function(req, res, next) {
    console.log("In find");
    res.status(200);
});

router.get('/home', function(req, res, next) {
    console.log("In home");
    res.status(200);
});


module.exports = router;
