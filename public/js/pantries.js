// pantries.js
var new_input = function(){
	var input = $(this);
	$(".share-email").each(remove_input);
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

var parse_emails = function () {
	var emails = $(".share-email");
	var emails_gold = []
	emails.each(function(){
		var email = $(this).val();
		if (!$(this).val() == ""){
			emails_gold.push(email);
		}
	});
	return emails_gold;
}

function share_callback (results) {
	console.log(results);
}

function addPantry (results) {
	var html = Handlebars.templates.pantry_min()
	console.log(results);
}

$('#new-pantry-form').submit(function () {
	var emails = parse_emails();
	var name = $('#pantry_name').val();
	$.post('/create_pantry',
	{name: name,
	invited_emails: emails_gold});

	return false;
});