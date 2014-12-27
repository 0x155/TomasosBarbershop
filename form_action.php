$_GET[] = array containing values if used GET method
$_POST[] = same but for POST
$_REQUEST[] = contains values of both GET and POST combined

$employee = $_GET["employee"];

<?php
	echo $_GET["employee"];
?>

isset(_$POST["employee"]); will check if the employee index contains a value

if a field could have multiple values selected (multi-list box), then use [] in the name of the field
<select name="choicesSelected[]" id="choices"></select>
$choicesArray = $_GET["choicesSelected"];