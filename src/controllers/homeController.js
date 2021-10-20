const router = require('express').Router();
const houseService = require("../services/houseService");

const getHomePage = (req, res) => {

  houseService
  .getLastThreeHouses()
  .then((houses) => {
    res.render("home/home", { houses });
  })
  .catch(() => res.status(500).end());
}

// const getAboutPage = (req, res) => {
//   res.render('about');
// }

router.get('/', getHomePage);
// router.get('/about', getAboutPage);

module.exports = router;