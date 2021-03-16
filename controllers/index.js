/* MODULE EXPORTS */
module.exports = {
  index,
  show,
};

const Trip = require("../models/trip");

async function index(req, res) {
  if (Object.keys(req.query).length === 0) {
    res.render("index", {
      user: req.user,
      name: req.query.name,
    });
    return;
  }
  try {
    const trips = await Trip.find({
      date: req.query.date,
      startCity: req.query.startCity,
      endCity: req.query.endCity,
    });
    trips.sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
    res.render("trips/index", {
      trips,
      user: req.user,
      name: req.query.name,
    });
  } catch (e) {
    res.render("error", { e });
  }
}

async function show(req, res) {
  try {
    let trip = await Trip.findById(req.params.id).populate("driver");
    res.render("trips/show", {
      trip,
      user: req.user,
    });
  } catch (e) {
    res.render("error", { e });
  }
}
