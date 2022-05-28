const express = require('express');
const router = express.Router();

const {
  userIndexPage
} = require("../controllers/users");

/* GET users listing. */
router.post('/register', userIndexPage);

module.exports = router;
