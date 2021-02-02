const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    //create new user & register
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    //authenticate & login user
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

//logout user
router.get('/logout', users.logout);

module.exports = router;