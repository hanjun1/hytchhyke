/* MODULE EXPORTS */
module.exports = {
  index,
  new: newTrip,
  create,
  show,
};

const googleMapToken = process.env.GOOGLE_TOKEN;
const Trip = require("../models/trip");

async function index(req, res) {
  if (Object.keys(req.query).length === 0) {
    res.render("index");
    return;
  }
  try {
    const trips = await Trip.find({
      startCity: req.query.startCity,
      endCity: req.query.endCity,
      // might need to change format of date because right now there is no time
      // associated to the date, while the model includes time
      date: req.query.date,
    });
    trips.sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
    console.log(trips);
    res.render("trips/index", { trips });
  } catch (e) {
    res.render("error", { e });
  }
}

function newTrip(req, res) {
  res.render("trips/new");
}

async function create(req, res) {
  try {
    await Trip.create({
      date: req.body.date,
      time: req.body.time,
      price: req.body.price,
      seats: req.body.seats,
      start: req.body.start,
      end: req.body.end,
    });
    res.redirect("/");
  } catch (e) {
    res.render("error", { e });
  }
}

async function show(req, res) {
  try {
    let trip = await Trip.findById(req.params.id);
    res.render("trips/show", { trip });
  } catch (e) {
    res.render("error", { e });
  }
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
