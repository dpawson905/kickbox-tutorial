const express = require('express');
const router = express.Router();

const {
  asyncErrorHandler
} = require('../middleware')

const {
  getUserProfile
} = require("../controllers/users");

/* GET users listing. */
router.get('/profile/:username', asyncErrorHandler(getUserProfile));

module.exports = router;
