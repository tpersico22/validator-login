var express = require('express');
var router = express.Router();
let homeRouter = require("../controllers/homeController");

router.get("/", homeRouter.index);

module.exports = router;