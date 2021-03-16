module.exports = {
  index,
  new: newTrip,
  create,
  showDriverTrips,
  showPassengerTrips,
  createRequest,
  showRequests,
};

const Review = require("../models/review");
const Trip = require("../models/trip");
const Request = require("../models/request");

async function index(req, res) {
  await req.user.execPopulate("reviews");
  res.render("users/index", {
    user: req.user,
  });
}

function newTrip(req, res) {
  res.render("users/new", {
    user: req.user,
  });
}

async function create(req, res) {
  try {
    await Trip.create({
      date: req.body.date,
      time: req.body.time,
      price: req.body.price,
      seats: req.body.seats,
      start: req.body.start,
      startCity: req.body.startCity,
      end: req.body.end,
      endCity: req.body.endCity,
      driver: req.body.driver,
    });
    res.redirect(`/users/${req.params.id}`);
  } catch (e) {
    res.render("error", { message: "error", e });
  }
}

async function showDriverTrips(req, res) {
  try {
    let trips = await Trip.find({
      driver: req.params.id,
    });
    trips.sort((a, b) => {
      return b.time.localeCompare(a.time);
    });
    res.render("users/showtrip", {
      trips,
      user: req.user,
      title: "driver",
    });
  } catch (e) {
    res.render("error", { message: "error", e });
  }
}

async function showPassengerTrips(req, res) {
  try {
    let trips = await Trip.find({
      passenger: req.user.id,
    });
    console.log(trips);
    trips.sort((a, b) => {
      return b.time.localeCompare(a.time);
    });
    res.render("users/showtrip", {
      trips,
      user: req.user,
      title: "passenger",
    });
  } catch (e) {
    res.render("error", { message: "error", e });
  }
}

async function createRequest(req, res) {
  try {
    await Request.create({
      trip: req.body.trip,
      text: req.body.text,
      from: req.body.from,
      to: req.body.to,
      read: req.body.read,
      status: req.body.status,
      timestamp: new Date(),
    });
    res.render("users/request", {
      user: req.user,
    });
  } catch (e) {
    res.render("error", { message: "error", e });
  }
}

async function showRequests(req, res) {
  try {
    let requestsReceived = await Request.find({
      to: req.user.id,
    })
      .populate("trip")
      .populate("to");
    let requestsSent = await Request.find({
      from: req.user.id,
    })
      .populate("trip")
      .populate("to");
    // requestsReceived.sort((a, b) => {
    //   return b.timestamp.localeCompare(a.timestamp);
    // });
    // requestsSent.sort((a, b) => {
    //   return b.timestamp.localeCompare(a.timestamp);
    // });
    console.log(requestsSent);
    res.render("users/requests/index", {
      requestsReceived,
      requestsSent,
      user: req.user,
    });
  } catch (e) {
    res.render("error", { message: "error", e });
  }
}
