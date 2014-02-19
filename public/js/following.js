$(".follow-btn").click(function () {
  var button = $(this);

  $.get("/unfollow/" + button.attr("id"), function (data) {
    button.parent().remove();
  })
})