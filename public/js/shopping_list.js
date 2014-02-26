$('.glyphicon-chevron-up').click(function () {
  var span = $(this);
  var request_id = span.parent('.request').attr('id');

  $.post('/like', {id: request_id}, function (data) {
    span.text(data.likes);
  })
})
