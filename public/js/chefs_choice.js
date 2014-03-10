$(document).ready(function () {
  $.get("/random_recipe", function (query_string) {
    console.log (query_string);

    $.ajax({                                                                            
      type: 'GET',
      url: query_string,
      dataType: 'jsonp',
      success: function (json) {
        console.log (json);
      },
      error: function(e) {
       console.log(e); 
      }                                       
    });

  });
})