$('.btn-remove').click(function () {
  var item = $(this).parent('.item')
  var id = item.attr('id');
  $.post('/remove_item', {id: id}, function (data) {
    item.remove();
  })
})