const COUNTRIES = {
  Austria: "at",
  Belgium: "be",
  Switzerland: "ch",
  "Czech Republic": "cz",
  Germany: "de",
  "United Kingdom": "uk",
  Spain: "es",
  Finland: "fi",
  France: "fr",
  Greece: "gr",
  Hungary: "hu",
  Ireland: "ie",
  Italy: "it",
  Netherlands: "nl",
  Norway: "no",
  Poland: "pl",
  Portugal: "pt",
  Sweden: "se",
  Slovenia: "si",
};

//content for the additional info box in the RUSH Card VIEW
var rushInfo = {
  1: {
    title: "Suche beim Herz nach:",
    steps: [
      "Perikarderguss/tamponade",
      "Akute Rechtsherzbelastung",
      "Linksventrikuläre Pumpfunktion",
    ],
  },
  2: {
    title: "Suche beim Inferiore VC nach:",
    steps: ["Volumenstatus: VCI kollaptisch", "VCI > 2,5 cm", "VCI < 1,5 cm"],
  },
  3: { title: "Suche beim Morrison nach:", steps: ["Freie Flüssigkeit"] },
  4: {
    title: "Suche beim der Aorta nach:",
    steps: ["Aorta Durchmesser > 3 cm"],
  },
  5: {
    title: "Suche beim Pneumothorax nach:",
    steps: [
      "Lungengleiten",
      "B-Lines",
      "Lungenpuls",
      "M-Mode: Seashore-Sign, Barcode-Sign",
    ],
  },
  6: {
    title: "Suche beim XYZ nach:",
    steps: ["Anweisung", "Anweisung", "Anweisung"],
  },
  7: {
    title: "Suche beim XYZ nach:",
    steps: ["Anweisung", "Anweisung", "Anweisung"],
  },
  8: {
    title: "Suche beim XYZ nach:",
    steps: ["Anweisung", "Anweisung", "Anweisung"],
  },
};

$(document).ready(function () {
  $(".sidenav").sidenav({ edge: "right" });
});

// //navigate tabs
$(document).ready(function () {
  $(".tabs").tabs();
  $("#rushcard").addClass("hide");
  $("#homescreen").removeClass("hide");
});

//event listner within the card view to trigger the additional Information Box
$("label > span").click(showRushItemInfo);
function showRushItemInfo(event) {
  var selectedItem = event.target.getAttribute("data-listItem");
  var itemInfo = rushInfo[selectedItem];
  $("#rushInfoCard-title").text(itemInfo.title);

  $("#rushInfoCard").empty();
  var info = "";
  for (var i = 0; i < itemInfo.steps.length; i++) {
    info += itemInfo.steps[i] + ", ";
    var item = $("<li>").text("" + itemInfo.steps[i]);
    $("#rushInfoCard").append(item);
  }
}

//Populate COVID Country Dropdown

$("#country-selection").append(
  Object.keys(COUNTRIES).map((country) => {
    return $("<option>", {
      text: country,
      value: COUNTRIES[country],
    });
  })
);

// Initiate Dropdowns

$(document).ready(function () {
  $("select").formSelect();
});

//Toggle Spinner

function toggleSpinner() {
  var visibility = $(".spinner").css("visibility");
  if (visibility == "hidden") {
    $(".spinner").css({ visibility: "visible" });
  } else {
    $(".spinner").css({ visibility: "hidden" });
  }
}

//APIs & Logic

// Wikipedia API

const WIKIPEDIA_API_END_POINT = template`https://en.wikipedia.org/api/rest_v1/page/summary/${"searchTerm"}`;

function getSearchResultsFromWiki() {
  var inputEl = $("#search-input");
  var searchTerm = inputEl.val().replace(/\s/g, "_");
  var populatedCheck = checkInLocalStorage(searchTerm);
  if (populatedCheck) {
    return;
  }
  getWikiAPI(searchTerm);
}

function checkInLocalStorage(searchTerm) {
  searchTerm = searchTerm.toUpperCase();
  var storedResult = localStorage.getItem(searchTerm);
  if (storedResult) {
    var jsonStoredResult = JSON.parse(storedResult);
    populateSummary(jsonStoredResult);
    return true;
  }
}

function getWikiAPI(searchTerm) {
  var url = WIKIPEDIA_API_END_POINT({ searchTerm: searchTerm });
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.title == "Not found") {
        return;
      }
      console.log(data);
      populateSummary(data);
      addToLocalStorage(searchTerm, data);
    });
}

function addToLocalStorage(searchTerm, data) {
  searchTerm = searchTerm.toUpperCase();
  var stringData = JSON.stringify(data);
  localStorage.setItem(searchTerm, stringData);
}

function populateSummary(data) {
  var outputEl = $("#wiki-results");
  outputEl.html("");
  outputEl.append([
    $("<div>", { html: data.extract_html }),
    $("<a>", { text: "Read more..", href: data.content_urls.desktop.page }),
  ]);
}

/// COVID-19 API

const COVID_API_ENDPOINT = template`https://covid19-eu-data-api-gamma.now.sh/api/countries?alpha2=${"countryCode"}&days=${"days"}`;

const HEADERS_MAP = {
  cases: "Cases",
  "cases/100k pop.": "Cases /100k Pop",
  deaths: "Deaths",
  "deaths/100k pop.": "Deaths /100k Pop",
  tests: "Tests",
  hospitalized: "Hospitalized",
  intensive_care: "Intensive Care",
};

const COLUMNS_LIMIT = 5;

clearTableDiv();
//getCOVIDInfo();

function getCOVIDInfo() {
  var countryCode = getSelectedCountry() || "de";
  var days = getDaysBack();
  toggleSpinner();
  clearDataDate();
  clearTableDiv();
  getCOVIDAPIInfo(days, countryCode);
}

function getDaysBack() {
  var daysBackInput = $("#days-back");
  var daysBack = daysBackInput.val();
  if (daysBack == "") {
    daysBack = 1;
    daysBackInput.val(1);
  }
  return daysBack;
}

function getSelectedCountry() {
  var selectionDiv = $("#country-selection");
  var selectedCountry = selectionDiv.val();
  return selectedCountry;
}

function clearTableDiv() {
  $("#covid-results").html("");
}

function clearDataDate() {
  $("#date-of-data").text("");
}

function getCOVIDAPIInfo(days, countryCode) {
  var url = COVID_API_ENDPOINT({ countryCode: countryCode, days: days });
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      data = data[0];
      setDataDate(data);
      populateTable(data);
      toggleSpinner();
    });
}

function setDataDate(data) {
  $("#date-of-data").text("Date of Data: " + data.date);
}

function populateTable(data) {
  var records = data.records;
  var headers = Object.keys(records[0]);
  var locationBase = getLocationBase(headers);
  HEADERS_MAP[locationBase] = "Location";
  var tableDiv = $("#covid-results");
  var tableHeaderDiv = $("<thead>", { class: "red lighten-4" });
  var tableBodyDiv = $("<tbody>");
  var headersDiv = createTableRowDiv(headers, HEADERS_MAP, "<th>");
  tableHeaderDiv.append(headersDiv);
  console.log(locationBase);
  records.forEach((record) => {
    var recordRowDiv = createTableRowDiv(headers, record, "<td>", HEADERS_MAP);
    tableBodyDiv.append(recordRowDiv);
  });
  tableDiv.append(tableHeaderDiv);
  tableDiv.append(tableBodyDiv);
  delete HEADERS_MAP[locationBase];
}

function createTableRowDiv(headers, entry, type, reference) {
  reference = reference || entry;
  var tableRowDiv = $("<tr>");
  headers.forEach((head, i) => {
    if (i > COLUMNS_LIMIT) {
      return;
    }
    if (reference[head]) {
      var colValue = proper(entry[head]);
      var colsDiv = $(type, { text: colValue });
      tableRowDiv.append(colsDiv);
    }
  });
  return tableRowDiv;
}

function proper(value) {
  if (typeof value == "string") {
    return toTitleCase(value);
  } else if (typeof value == "number") {
    return value.toLocaleString("de-DE", { maximumFractionDigits: 0 });
  } else if (value === null) {
    return "-";
  }
}

function getLocationBase(headers) {
  if (headers.includes("lau")) {
    return "lau";
  }
  if (headers.includes("nuts_3")) {
    return "nuts_3";
  }
  if (headers.includes("nuts_2")) {
    return "nuts_2";
  }
  if (headers.includes("nuts_1")) {
    return "nuts_1";
  }
}

function template(strings, ...keys) {
  return function (...values) {
    let dict = values[values.length - 1] || {};
    let result = [strings[0]];
    keys.forEach(function (key, i) {
      let value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join("");
  };
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
