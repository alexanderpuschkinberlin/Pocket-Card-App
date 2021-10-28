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
