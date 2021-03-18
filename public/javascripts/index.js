/*-- CONSTANTS --*/
/*-- APP'S STATE (VARIABLES) --*/

let startLoc;
let endLoc;
let options = {
  componentRestrictions: { country: "ca" },
};

/*-- CACHED ELEMENT REFERENCES --*/
const startLocInput = document.querySelector(".start");
const endLocInput = document.querySelector(".end");
const autocompleteStartLoc = new google.maps.places.Autocomplete(
  startLocInput,
  options
);
const autocompleteEndLoc = new google.maps.places.Autocomplete(
  endLocInput,
  options
);
const startCityInput = document.querySelector(".start-city");
const endCityInput = document.querySelector(".end-city");
const searchForm = document.querySelector("form");
const buttonEl = document.querySelector("form button");

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
    searchForm.submit();
  }
}

function resetStartLocation() {
  startLoc = {};
}

function resetEndLocation() {
  endLoc = {};
}
