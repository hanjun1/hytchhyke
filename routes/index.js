const express = require("express");
const router = express.Router();
const passport = require("passport");

const indexCtrl = require("../controllers/index");

router.get("/", indexCtrl.index);
router.get(
  "/oauth2callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});
router.get("/:id/", indexCtrl.show);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

module.exports = router;
