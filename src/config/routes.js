var express = require('express');
var passport = require('passport');

var router = express.Router();

// include controllers
var HomeCtrl = require('../controllers/HomeCtrl');
var UserCtrl = require('../controllers/UserCtrl');
var PoiCtrl = require('../controllers/PoiCtrl');

// static content routes
router.get('/', HomeCtrl.index);

router.get('/register', HomeCtrl.registerGet);
router.post('/register', HomeCtrl.registerPost);

router.get('/login', HomeCtrl.loginGet);
router.post('/login', passport.authenticate('local'), HomeCtrl.loginPost);

router.get('/logout', HomeCtrl.logout);

router.get('/ping', HomeCtrl.ping);

// user related routes
router.get('/users/', UserCtrl.info);
router.post('/users/favs/add/', UserCtrl.add);
router.post('/users/favs/delete/', UserCtrl.remove);

// pois related routes
router.get('/pois/', PoiCtrl.filter);
router.get('/pois/:id', PoiCtrl.info);
router.get('/pois/all/likes/', PoiCtrl.stats);


module.exports = router;