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
  var request = $(this).parent().parent(".request");
  var id = request.attr("id");
  
  var request_name = request.find(".request-name").html();
  var request_category = request.find(".request-category").html();

  $("#itemModal").modal();
  $("#item-modal-name").val(request_name);
  $("#item-modal-category").val(request_category);

  $("#item-modal-save").click(function () {
    $.post("/remove_request", {id: id}, function (data) {
      request.hide(50, function () {
        request.remove();
      })
    })
  })
})




$(".glyphicon-calendar").click(function () {
  $("#datepicker").datepicker("show");
})

$("#datepicker").datepicker({
  minDate: new Date()
});

$('#edit').click(function () {
  $('.btn-remove').toggle();
  $('.btn-to-pantry').toggle();
})

$(document).ready(function () {
  $('.btn-remove').hide();
  $('.btn-to-pantry').hide();
})