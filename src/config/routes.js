const express = require('express');
const passport = require('passport');

const router = express.Router();

// include controllers
const UserCtrl = require('../controllers/UserCtrl');
const PoiCtrl = require('../controllers/PoiCtrl');

// user related routes
router.post('/login', UserCtrl.login);
router.get('/logout', UserCtrl.logout);
router.post('/register', UserCtrl.register);
router.post('/users/favs/add', UserCtrl.addPlaceToFavs);
router.post('/users/favs/delete', UserCtrl.removePlaceFromFavs);

// pois related routes
router.get('/pois/all/cash', PoiCtrl.getAllPois);
router.get('/pois', PoiCtrl.filterPois);
router.get('/pois/:id', PoiCtrl.getPoiInfo);
router.get('/pois/all/likes', PoiCtrl.getPoiStats);

module.exports = router;