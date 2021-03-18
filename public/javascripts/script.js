/*-- CONSTANTS --*/

/*-- APP'S STATE (VARIABLES) --*/

let startLoc;
let endLoc;
let options = {
  componentRestrictions: { country: "ca" },
};

/*-- CACHED ELEMENT REFERENCES --*/

let startLocInput = document.getElementById("start");
let endLocInput = document.getElementById("end");
let startCityInput = document.getElementById("startCity");
let endCityInput = document.getElementById("endCity");
let buttonEl = document.querySelector(".newtrip-button-container button");
let newRideForm = document.querySelector("form");
const autocompleteStartLoc = new google.maps.places.Autocomplete(
  startLocInput,
  options
);
const autocompleteEndLoc = new google.maps.places.Autocomplete(
  endLocInput,
  options
);

/*-- EVENT LISTENERS --*/

startLocInput.addEventListener("change", resetStartLocation);
endLocInput.addEventListener("change", resetEndLocation);

autocompleteStartLoc.addListener("place_changed", () => {
  startLoc = autocompleteStartLoc.getPlace();

  if (!startLoc.geometry || !startLoc.geometry.location) {
    // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
    return;
  }
});

autocompleteEndLoc.addListener("place_changed", () => {
  endLoc = autocompleteEndLoc.getPlace();

  if (!endLoc.geometry || !endLoc.geometry.location) {
    // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
    return;
  }
});

buttonEl.addEventListener("click", validateInputs);

/*-- MAIN FUNCTIONS --*/

function validateInputs() {
  if (
    startLoc.hasOwnProperty("place_id") &&
    endLoc.hasOwnProperty("place_id")
  ) {
    startLoc.address_components.forEach((comp) => {
      if (comp.types.includes("locality")) {
        startCityInput.value = comp.long_name;
      }
    });
    endLoc.address_components.forEach((comp) => {
      if (comp.types.includes("locality")) {
        endCityInput.value = comp.long_name;
      }
    });
    newRideForm.submit();
  }
}

function resetStartLocation() {
  startLoc = {};
}

function resetEndLocation() {
  endLoc = {};
}
// when pressing the button, change the input values to stringifed arrays
