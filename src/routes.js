const express = require("express");
const router = express.Router();

const homeController = require("./controllers/homeController");
const houseController = require('./controllers/houseController');
const authController = require("./controllers/authController");

router.use(homeController);
router.use('/house', houseController);
router.use("/auth", authController);
router.get('*', (req, res) => {
  res.render('404');
});

module.exports = router;
