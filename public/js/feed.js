$(".vote-btn").click(function () {
  var button = $(this);
  var id = button.parent(".story").attr("id");

  if (button.text() == "Vote") {
    $.getJSON("/upvote/" + id, function (data) {
      console.log(data);
      button.text("Unvote");
      button.prev(".vote-count").text(data.story.upvotes);
    })

  } else {

    $.getJSON("/unvote/" + id, function (data) {
      console.log(data);
      button.text("Vote");
      button.prev(".vote-count").text(data.story.upvotes);
    })

  }
})

// $("#search").keyup(function () {

//     if ($(this).val()) {

//       $.getJSON("http://localhost:3000/search/" + $(this).val(), function (data) {
//         var stories = data.results;
//         console.log(stories);
//         $(".story").each(function (index) {
//           if (contains_id(($(this).attr("id"), stories))) {
//             console.log("message");
//             $(this).show();
//           } else {
//             $(this).hide();
//           }
//         })
//       })

//     } else {
//       $(".story").each(function (index) {
//         $(this).show();
//       })
//     }

// })