var rushInfo = {
  1: {title: "Info when clicked 1", steps: ["Step1", "Step2"]},
  2: "Info when clicked 2",
  3: "Info when clicked 3",
  4: "Info when clicked 4",
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

//event listner within the card view
$("label > span").click(showRushItemInfo);
function showRushItemInfo(event) {
  var selectedItem = event.target.getAttribute("data-listItem");
  var itemInfo = rushInfo[selectedItem] 
  console.log(itemInfo);
  var info = "";
  for(var i = 0; i< itemInfo.steps.length; i++){
    info += itemInfo.steps[i] + ", ";
    var item = $("<li>").text("dummy" + itemInfo.steps[i])
    $("#rushInfoCard").append(item);
  }
}
