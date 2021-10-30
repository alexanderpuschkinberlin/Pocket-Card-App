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
  $("#rushcard").addClass("hide");
  $("#homescreen").removeClass("hide");
}

//navigate tabs
$(document).ready(function () {
  $(".tabs").tabs();
});

//event listner within the card view to trigger the additional Information Box
$("label > span").click(showRushItemInfo);
function showRushItemInfo(event) {
  var selectedItem = event.target.getAttribute("data-listItem");
  var itemInfo = rushInfo[selectedItem] 
  $("#rushInfoCard-title").text(itemInfo.title)

  var info = "";
  for(var i = 0; i< itemInfo.steps.length; i++){
    info += itemInfo.steps[i] + ", ";
    var item = $("<li>").text("" + itemInfo.steps[i])
    $("#rushInfoCard").append(item);
  }
}
