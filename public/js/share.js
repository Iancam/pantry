// share.js

var new_input = function(){
	var input = $(this);
	$(".share-email").each(remove_input);
	var re = /.+@.+/
	if (input.next().length == 0 && re.test(input.val())) {
		var new_input = '<input type="text" name="email" class="form-control share-email" placeholder="Add Emails" rows="2">';
		input.parent().append(new_input);
	}
	// if(input.val() != '') {
	// 	input.attr("name", 'email');
	// }
}
var remove_input = function() {
	// $("input[type='text'][name='email']").each(remove_input);
	var input = $(this);
	if (input.val() === "" && input.prev().length != 0 && !input.is(":focus")) {
		input.remove();
	}
}
$('#share-form').submit(function (argument) {
	var emails = $(".share-email");
	// get pantry id
	var emails_gold = []
	emails.each(function(){
		var email = $(this).val();
		if (!$(this).val() == ""){
			emails_gold.push(email);
		}
	});
	$('#sort').after('<div class="alert alert-dismissable alert-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>successfully shared! </div>');
	$.post("/share", {"emails": emails_gold});

	return false;
});

$(document).on('change', ".share-email", new_input);
$(document).on('blur', ".share-email", remove_input);