var express = require("express");
var router = express.Router();

let usersCtrl = require("../controllers/users");

router.get("/:id", isLoggedIn, usersCtrl.index);
router.get("/:id/new", isLoggedIn, usersCtrl.new);
router.get("/:id/drivertrips", isLoggedIn, usersCtrl.showDriverTrips);
router.get("/:id/passengertrips", isLoggedIn, usersCtrl.showPassengerTrips);
router.get("/:id/requests", isLoggedIn, usersCtrl.showRequests);
router.post("/:id", isLoggedIn, usersCtrl.create);
router.post("/:id/requests", isLoggedIn, usersCtrl.createRequest);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router;
