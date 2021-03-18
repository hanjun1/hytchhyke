module.exports = {
  index,
  new: newTrip,
  create,
  showDriverTrips,
  showPassengerTrips,
  createRequest,
  showReceivedRequests,
  showSentRequests,
  updateSentRequest,
  updateReceivedRequest,
  deletePassengerTrip,
  deleteDriverTrip,
};

const Review = require("../models/review");
const Trip = require("../models/trip");
const Request = require("../models/request");
const { TooManyRequests } = require("http-errors");

async function index(req, res) {
  res.render("users/show", {
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
    res.render("error", { message: "There's an error!", error: e });
  }
}

async function showDriverTrips(req, res) {
  try {
    let trips = await Trip.find({
      driver: req.params.id,
    }).populate("driver");
    trips.sort((a, b) => {
      return b.time.localeCompare(a.time);
    });
    res.render("users/trips/index", {
      trips,
      user: req.user,
      title: "driver",
    });
  } catch (e) {
    res.render("error", { message: "There's an error!", error: e });
  }
}

async function showPassengerTrips(req, res) {
  try {
    let trips = await Trip.find({
      passenger: req.user.id,
    }).populate("driver");
    trips.sort((a, b) => {
      return b.time.localeCompare(a.time);
    });
    res.render("users/trips/index", {
      trips,
      user: req.user,
      title: "passenger",
    });
  } catch (e) {
    res.render("error", { message: "There's an error!", error: e });
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
    res.render("users/requests/show", {
      user: req.user,
    });
  } catch (e) {
    res.render("error", { message: "There's an error!", error: e });
  }
}

async function showReceivedRequests(req, res) {
  try {
    let requestsReceived = await Request.find({
      to: req.user.id,
    })
      .populate("trip")
      .populate("from");
    requestsReceived.sort((a, b) => {
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
    res.render("users/requests/index", {
      sent: false,
      requestsReceived,
      user: req.user,
    });
  } catch (e) {
    res.render("error", { message: "There's an error!", error: e });
  }
}

async function showSentRequests(req, res) {
  try {
    let requestsSent = await Request.find({
      from: req.user.id,
    })
      .populate("trip")
      .populate("to");
    requestsSent.sort((a, b) => {
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
    res.render("users/requests/index", {
      sent: true,
      requestsSent,
      user: req.user,
    });
  } catch (e) {
    res.render("error", { message: "There's an error!", error: e });
  }
}

async function updateReceivedRequest(req, res) {
  try {
    let request = await Request.findById(req.body.request)
      .populate("trip")
      .populate("from");
    if (req.body.option === "accept") {
      request.status = "Accepted";
      request.trip.passenger.push(request.from);
      request.trip.seats = request.trip.seats - 1;
    } else {
      request.status = "Declined";
    }
    await request.trip.save();
    await request.save();
    res.redirect(`/users/${req.params.id}/requests/received`);
  } catch (e) {
    res.render("error", { message: "There's an error!", error: e });
  }
}

async function updateSentRequest(req, res) {
  try {
    let request = await Request.findById(req.body.request);
    request.status = "Cancelled";
    await request.save();
    res.redirect(`/users/${req.params.id}/requests/sent`);
  } catch (e) {
    res.render("error", { message: "There's an error!", error: e });
  }
}

async function deletePassengerTrip(req, res) {
  try {
    let trip = await Trip.findById(req.body.tripId).populate("passenger");
    trip.seats -= 1;
    console.log(req.user.id);
    for (let i = 0; i < trip.passenger.length; i++) {
      if (trip.passenger[i].id === req.user.id) {
        console.log("hello");
        trip.passenger.splice(i, 1);
        break;
      }
    }
    await trip.save();
    res.redirect(`/users/${req.params.id}/passengertrips`);
  } catch (e) {
    res.render("error", { message: "There's an error!", error: e });
  }
}

async function deleteDriverTrip(req, res) {
  try {
    await Request.findOneAndDelete({
      trip: req.body.tripId,
    }).populate("trip");
    await Trip.findByIdAndDelete(req.body.tripId);
    res.redirect(`/users/${req.params.id}/drivertrips`);
  } catch (e) {
    res.render("error", { message: "There's an error!", error: e });
  }
}
