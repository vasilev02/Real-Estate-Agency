const router = require("express").Router();
const houseService = require("../services/houseService.js");
const isAuthenticated = require("../middlewares/isAuthenticated");

const getCreatePage = (req, res) => {
  res.render("house/create");
};

const getRentHousePage = (req, res) => {
  houseService
    .getAll()
    .then((houses) => {
      res.render("aprt-for-recent", { houses });
    })
    .catch(() => res.status(500).end());
};

const getDetailsPage = (req, res) => {
  houseService
    .getOne(req.params.houseId)
    .then(async (house) => {
      const namesResult = await houseService.getNames(house.rentedHome);
      const names = namesResult.join(", ").toString();
      
      const hasPieces = house.availablePieces > 0 ? true : false;
      const hasTenants = house.rentedHome.length > 0 ? true : false;

      console.log(res.locals.user)
      const isRented = false;

      if (res.locals.user) {

        isRented = await houseService.isRentedByCurrentUser(
          house.rentedHome,
          res.locals.user._id
        );

        const isOwner = res.locals.user._id == house.owner;
        res.render("house/details", {
          house,
          isOwner,
          isLogged: true,
          names,
          isRented,
          hasPieces,
          hasTenants,
        });
      } else {
        res.render("house/details", { house, hasTenants, isLogged: false, names, isRented });
      }
    })
    .catch(() => res.status(500).end());
};

const createHouse = async (req, res) => {
  const house = req.body;

  try {
    await houseService.create(house, req.user._id);
    res.redirect("/");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getEditPage = (req, res) => {
  houseService
    .getOne(req.params.houseId)
    .then((house) => {
      const isOwner = res.locals.user._id == house.owner;
      if (!isOwner) {
        res.redirect("/");
      }

      res.render("house/edit", { house });
    })
    .catch(() => res.status(500).end());
};

const editHouse = async (req, res) => {
  const house = req.body;

  try {
    await houseService.updateOne(req.params.houseId, house);
    res.redirect("/");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const rentHouse = async (req, res) => {
  const houseId = req.params.houseId;
  const house = await houseService.getOne(houseId);

  house.rentedHome.push(res.locals.user._id);
  house.availablePieces = house.availablePieces - 1;

  try {
    await houseService.updateOne(houseId, house);
    res.redirect("/house/details/" + houseId);
  } catch (error) {
    console.log(error);
  }
};

router.get("/create", isAuthenticated, getCreatePage);
router.get("/rent", getRentHousePage);
router.get("/details/:houseId", getDetailsPage);

router.get("/delete/:houseId", isAuthenticated, async (req, res) => {
  await houseService.deleteOne(req.params.houseId);
  res.redirect("/");
});

const getSearchPage = (req, res) => {
  houseService
    .searchHouses(req.query)
    .then((houses) => {
      res.render("search", { houses });
    })
    .catch(() => res.status(500).end());
};

router.get("/edit/:houseId", isAuthenticated, getEditPage);

router.post("/create", isAuthenticated, createHouse);

router.post("/edit/:houseId", isAuthenticated, editHouse);

router.get("/rent/:houseId", isAuthenticated, rentHouse);

router.get("/search", isAuthenticated, getSearchPage);

module.exports = router;
