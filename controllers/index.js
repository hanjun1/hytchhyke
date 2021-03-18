/* MODULE EXPORTS */
module.exports = {
  index,
  show,
};

const Trip = require("../models/trip");
const Request = require("../models/request");
const token = process.env.GOOGLE_TOKEN;
const distanceBaseUrl =
  "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&";
const fetch = require("node-fetch");

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
      seats: { $gt: 0 },
    });
    trips.sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
    for (let trip of trips) {
      let distance;
      distance = await calculateDistance(req.query.start, trip.start);
      trip.startDistance = distance.distance.text;
      distance = await calculateDistance(req.query.end, trip.end);
      trip.endDistance = distance.distance.text;
      distance = await calculateDistance(trip.start, trip.end);
      let time = new Date(trip.date + " " + trip.time).getTime();
      time = (time / 1000 + distance.duration.value) * 1000;
      let newTime = new Date(time);
      trip.arrivalTime = newTime.getHours() + ":" + newTime.getMinutes();
    }
    res.render("index-search", {
      trips,
      date: req.query.date,
      user: req.user,
      name: req.query.name,
      searchStart: req.query.start,
      searchEnd: req.query.end,
    });
  } catch (e) {
    res.render("error", { message: "There's an error!", error: e });
  }
}

async function show(req, res) {
  try {
    let trip = await Trip.findById(req.params.id).populate("driver");
    let request;
    if (req.user) {
      request = await Request.find({
        trip: req.params.id,
        from: req.user.id,
      }).populate("trip");
    }
    res.render("show", {
      request,
      trip,
      user: req.user,
      searchStart: req.params.searchStart,
      searchEnd: req.params.searchEnd,
    });
  } catch (e) {
    res.render("error", { message: "There's an error!", error: e });
  }
}

async function calculateDistance(searchStart, tripStart) {
  let res = await fetch(
    distanceBaseUrl +
      "origins=" +
      searchStart +
      "&destinations=" +
      tripStart +
      "&key=" +
      token
  );
  let result = await res.json();
  return result.rows[0].elements[0];
}
