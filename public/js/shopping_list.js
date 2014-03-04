$('.glyphicon-chevron-up').click(function () {
  var span = $(this);
  var request_id = span.parent('.request').attr('id');

  $.post('/like', {id: request_id}, function (data) {
    span.text(data.likes);
  })
})

$('.btn-remove').click(function () {
  var request = $(this).parent().parent('.request')
  var id = request.attr('id');
  $.post('/remove_request', {id: id}, function (data) {
    request.hide(50, function () {
      request.remove();
    })
  })
})

$('.btn-to-pantry').click(function () {
  var request = $(this).parent().parent('.request')
  var id = request.attr('id');
  $.post('/to_pantry', {id: id}, function (data) {
    request.remove();
  })
})

$('#edit').click(function () {
  $('.btn-remove').toggle();
  $('.btn-to-pantry').toggle();
  // $('.glyphicon-chevron-up').toggle();
})

$(document).ready(function () {
  $('.btn-remove').hide();
  $('.btn-to-pantry').hide();
})