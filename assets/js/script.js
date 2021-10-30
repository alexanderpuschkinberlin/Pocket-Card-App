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
  $("#rushcard").addClass("hide");
  $("#homescreen").removeClass("hide");
}

//navigate tabs
$(document).ready(function () {
  $(".tabs").tabs();
});


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
  var outputEl = $("#results");
  outputEl.append([
    $("<div>", { html: data.extract_html }),
    $("<a>", { text: "Read more..", href: data.content_urls.desktop.page })
  ])

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