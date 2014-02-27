$('.btn-remove').click(function () {
  var item = $(this).parent('.item')
  var id = item.attr('id');
  $.post('/remove_item', {id: id}, function (data) {
    item.remove();
  })
})

$('#edit').click(function () {
  $('.btn-remove').toggle(50);
})

$(document).ready(function () {
  $('.btn-remove').hide();
})