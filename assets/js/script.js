//content for the additional info box in the RUSH Card VIEW
var rushInfo = {
  1: {title: "Suche beim Herz nach:", steps: ["Perikarderguss/tamponade", "Akute Rechtsherzbelastung", "Linksventrikuläre Pumpfunktion"]},
  2: {title: "Suche beim Inferiore VC nach:", steps: ["Volumenstatus: VCI kollaptisch", "VCI > 2,5 cm", "VCI < 1,5 cm"]},
  3: {title: "Suche beim Morrison nach:", steps: ["Freie Flüssigkeit"]},
  4: {title: "Suche beim der Aorta nach:", steps: ["Aorta Durchmesser > 3 cm"]},
  5: {title: "Suche beim Pneumothorax nach:", steps: ["Lungengleiten", "B-Lines", "Lungenpuls", "M-Mode: Seashore-Sign, Barcode-Sign"]},
  6: {title: "Suche beim XYZ nach:", steps: ["Anweisung", "Anweisung", "Anweisung"]},
  7: {title: "Suche beim XYZ nach:", steps: ["Anweisung", "Anweisung", "Anweisung"]},
  8: {title: "Suche beim XYZ nach:", steps: ["Anweisung", "Anweisung", "Anweisung"]},
}


$(document).ready(function () {
  $(".sidenav").sidenav({ edge: "right" });
});

//Switch from Homescreen to Card Screen
$("#rush").click(openCard);

function openCard(event) {
  $(".brand-logo").text("RUSH Protocol");
  $("#rushcard").removeClass("hide");
  $("#homescreen").addClass("hide");
}

//Close Card, when I click the button
$("#close").click(closeCard);
function closeCard() {
  $(".brand-logo").text("Pocket Card App");
  console.log("hello");
  $("#rushcard").addClass("hide");
  $("#homescreen").removeClass("hide");
}

//navigate tabs
$(document).ready(function () {
  $(".tabs").tabs();
  $(".brand-logo").text("RUSH Protocol");
  $("#rushcard").addClass("hide");
  $("#homescreen").removeClass("hide");


});

//event listner within the card view to trigger the additional Information Box
$("label > span").click(showRushItemInfo);
function showRushItemInfo(event) {
  var selectedItem = event.target.getAttribute("data-listItem");
  var itemInfo = rushInfo[selectedItem] 
  $("#rushInfoCard-title").text(itemInfo.title)

  $("#rushInfoCard").empty();
  var info = "";
  for(var i = 0; i< itemInfo.steps.length; i++){
    info += itemInfo.steps[i] + ", ";
    var item = $("<li>").text("" + itemInfo.steps[i])
    $("#rushInfoCard").append(item);
  }
}


//APIs & Logic

// Wikipedia API

const WIKIPEDIA_API_END_POINT = template`https://en.wikipedia.org/api/rest_v1/page/summary/${'searchTerm'}`

function getSearchResultsFromWiki() {
  var inputEl = $("#search-input");
  var searchTerm = inputEl.val().replace(/\s/g, "_");
  getWikiAPI(searchTerm)
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
    });
}

function populateSummary(data) {
  var outputEl = $("#wiki-results");
  outputEl.html("");
  outputEl.append([
    $("<div>", { html: data.extract_html }),
    $("<a>", { text: "Read more..", href: data.content_urls.desktop.page })
  ])

}


// COVID-19 API

const COVID_API_ENDPOINT = template`https://covid19-eu-data-api-gamma.now.sh/api/countries?alpha2=${"countryCode"}&days=${"days"}`

getCOVIDInfo();

function getCOVIDInfo() {
  var countryCode = "de";
  var days = 1;
  var url = COVID_API_ENDPOINT({ countryCode: countryCode, days: days });
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      //populateSummary(data);
    });
}

function template(strings, ...keys) {
  return (function (...values) {
    let dict = values[values.length - 1] || {};
    let result = [strings[0]];
    keys.forEach(function (key, i) {
      let value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  });
}