// share.js

var new_input = function(){
	var input = $(this);
	console.log(input.val());
	$(".share-email").each(remove_input);
	var re = /.+@.+\..+/
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
$('#share-form').submit(function () {
	var emails = $(".share-email");
	// get pantry id
	var emails_gold = []
	emails.each(function(){
		var email = $(this).val();
		if (!$(this).val() == ""){
			emails_gold.push(email);
		}
	});
	$.ajax({
        type: "POST",
        url: "/share",
        data: {"emails": emails_gold}
    });
	$('#shareModal').modal('hide');
	return false;
});

$(document).on('keyup', ".share-email", new_input);
$(document).on('blur', ".share-email", remove_input);