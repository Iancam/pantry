$('.glyphicon-chevron-up').click(function () {
  var span = $(this);
  var request_id = span.parent('.request').attr('id');

  $.post('/like', {id: request_id}, function (data) {
    span.text(data.likes);
  })
})

$('.btn-remove').click(function () {
  var request = $(this).parent('.request')
  var id = request.attr('id');
  $.post('/remove_request', {id: id}, function (data) {
    request.remove();
  })
})
