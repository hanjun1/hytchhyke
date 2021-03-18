var express = require("express");
var router = express.Router();

let usersCtrl = require("../controllers/users");

router.get("/:id", isLoggedIn, usersCtrl.index);
router.get("/:id/new", isLoggedIn, usersCtrl.new);
router.get("/:id/drivertrips", isLoggedIn, usersCtrl.showDriverTrips);
router.get("/:id/passengertrips", isLoggedIn, usersCtrl.showPassengerTrips);
router.get("/:id/requests/sent", isLoggedIn, usersCtrl.showSentRequests);
router.get("/:id/requests/received", isLoggedIn, usersCtrl.showReceivedRequests);
router.post("/:id", isLoggedIn, usersCtrl.create);
router.post("/:id/requests", isLoggedIn, usersCtrl.createRequest);
router.put("/:id/requests/received", isLoggedIn, usersCtrl.updateReceivedRequest);
router.put("/:id/requests/sent", isLoggedIn, usersCtrl.updateSentRequest);
router.delete('/:id/passengertrips', isLoggedIn, usersCtrl.deletePassengerTrip);
router.delete('/:id/drivertrips', isLoggedIn, usersCtrl.deleteDriverTrip);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router;
