const express = require("express");
const dataController = require("./controllers/DataController");
const authController = require("./controllers/UserController");
const { verifyMiddleware } = require("./middlewares/authMiddleware");

const router = express.Router();

router.route("/auth/login").post(authController.loginUser);
router.route("/auth/register").post(authController.createUser);
router.route("/cities").get(dataController.getAllCities);
router.route("/store").get(dataController.getAllStores);
router.route("/store/offers").get(dataController.getOffers);
router
  .route("/auth/user")
  .get(verifyMiddleware, authController.getUser)
  .patch(verifyMiddleware, authController.updateUser);

router
  .route("/app/data")
  .get(dataController.getAppData)
  .post(dataController.createAppData);
router.route("/app/cities").get(dataController.getCities);

module.exports = router;
