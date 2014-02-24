// share.js



var new_input = function(){
	var input = $(this);
	$("input[type='text'][name='email']").each(remove_input);
	var re = /.+@.+/
	if (input.next().length == 0 && re.test(input.val())) {
		var new_input = '<input type="text" name="email" class="form-control" placeholder="Add Emails" rows="2">';
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
	var emails = $("input[type='text'][name='email']");
	var eamils_gold = []
	emails.each(function(){
		var email = $(this).val();
		if (!$(this).val() == ""){
			eamils_gold.push(email);
		}
	});
	$('#sort').after('<div class="alert alert-dismissable alert-success"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>successfully shared! </div>');
	$.post("/share", {"emails": eamils_gold});

	return false;
});

$(document).on('change', "input[type='text'][name='email']", new_input);
$(document).on('blur', "input[type='text'][name='email']", remove_input);