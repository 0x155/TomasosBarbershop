//Creates XMLHttpRequest object based on the browser
function createXmlHttpRequestObject(){
	var xmlhttp;
	//ActiveXObject is for IE5 and 6
	if(window.ActiveXObject){
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	//Other browsers use XMLHttpRequest
	else{
		xmlhttp = new XMLHttpRequest();
	}

	return xmlhttp;
}

function customerSearch(){
	var xmlhttp = createXmlHttpRequestObject();
	var nameEntered = document.getElementById("customer_name").value;

	xmlhttp.onreadystatechange = function(){
		if((xmlhttp.readyState === 4) && (xmlhttp.status === 200)){
			document.getElementById("customer_search_results").innerHTML = xmlhttp.responseText;
		}
	}
	//path to php file is relative to index.php page
	xmlhttp.open("GET", "get_customer_data.php?name="+nameEntered, true);
	xmlhttp.send();

}