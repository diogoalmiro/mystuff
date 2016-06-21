/**
 * Send.js is an object to make the use of XMLHttpRequest easier.
 * 
 * > Send
 * Object {}
 * 	Request : (method, url, callback[, progress])
 *	setForm : (formElement, callback[, progress])
 *	setOnclick : (element, method, url, callback)
 * 
 * Usage:
 * 	var request = new Send.Request("GET","/",function(response, status){...}, function(e){...})
 * 	request.send( formData )
 * 
 * 		The callback function will be called when the XMLHttpRequest readyState == 4
 * 			The parameters are the responseText and status
 * 		While XMLHttpRequest.upload.onprogress(e) the progress function is called
 * 
 * 
 * 	setForm(formElement, function(response, status){...}, function(e){...})
 * 		
 * 		Make sure that formElement.method and formElement.action are defined;
 * 		calls the XMLHttpRequest.send when formElement is submited
 * 		when after calling the callback resets the formElement
 * 		
 * 	setOnclick(element, method, url, function(response, status){...})
 * 		
 * 		Creates a reuest and sends it when the element is clicked
 * 
 * Diogo Almiro 2016
 */
var Send = (function(){

	function Request(method, url, callback, progress){
		var req = new XMLHttpRequest();
		req.open(method, url, true);

		req.onreadystatechange = function() {
			if( req.readyState == 4 )
				callback( req.responseText, req.status );
		}
		if( req.upload && progress )
			req.upload.onprogress = function(e) {
				progress(e);
			}

		this.send = function(formData){
			req.send( formData );
		}
	}
	
	function setFormSubmition(formElement, callback, progress){
		formElement.onsubmit = function() {
			 new Request(
				formElement.method,
				formElement.action,
				function(res, status){
					callback(res, status);
					formElement.reset();
				},
				progress
			).send(new FormData(this));
			return false;
		}
	}

	function setOnclick(element, method, url, callback) {
		element.onclick = function(){
			new Request(method, url, callback).send();
			return false;
		}
	} 

	return {
		Request : Request,
		setFormSubmition : setFormSubmition,
		setOnclick : setOnclick
	};

})()

