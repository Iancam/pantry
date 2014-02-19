$(".follow-btn").click(function () {
  var button = $(this);

  if (button.text() == "Follow") {

    $.get("/follow/" + button.attr("id"), function (data) {
      button.prev(".follow-count").text(data.num_followers);
      button.text("Unfollow");
    })

  } else {

    $.get("/unfollow/" + button.attr("id"), function (data) {
      button.prev(".follow-count").text(data.num_followers);
      button.text("Follow");
    })

  }
})

