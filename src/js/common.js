/**
 * @file common.js Helper functions
 * @author Mihai Peteu
 * @copyright 2016 Renova Bikes.  All rights reserved.
 */
Array.prototype.contains = function(value) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] === value) {
		  return true;
		}
	}
	return false;
}
Array.prototype.containsSubkeyValue = function(key, value) {
	debugger;
	for (var i = 0; i < this.length; i++) {
		if (this[i][key] === value) {
		  return true;
		}
	}
	return false;
}
Array.prototype.unique = function(key) {
	var arr = [];
	for (var i = 0; i < this.length; i++) {
		if (!arr.contains(this[i][key])) {
			arr.push(this[i][key]);
		}
	}
	return arr; 
}
Array.prototype.pluckIfKeyValueExists = function(key, value) {
  return this.filter(function(eachObject) {
	 return eachObject[key] == value;
  });
}

function isEmptyObject(obj) {
  return $.isEmptyObject(obj); 
}

function isBlank(thisVar) {
	if (typeof thisVar !== 'undefined') {
		if (typeof thisVar === 'object') { // figure out object.length substitute} && thisVar.length) {
			return false;
		}
		else if ((typeof thisVar === 'string' || typeof thisVar === 'number') 
		  && thisVar != '') {
			return false;
		}
	}
	return true;
}

function isValidJson(input) {
	try {
		JSON.parse(input);
	} catch (e) {
		return false;
	}
	return true;
}

function flattenObject(obj) {
  var newHTML = [];
  var newHTML = $.map(obj, function(value) {
	  return(value);
  });
}

function rvStr(s) {
  return s.split('').reverse().join('');
}

function throwModalError(errorMsg) {
  alert(errorMsg);
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

function strToLowerNoSpaces(str) {
  return str.toLowerCase().replace(/ /g,"_");
}

String.prototype.ucwords = function() {
  str = this.toLowerCase();
  return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
	function($1){
		return $1.toUpperCase();
	});
}

function fileExists(fileUrl) {
  var http = new XMLHttpRequest();
  http.open('HEAD', fileUrl, false);
  http.send();
  return http.status != 404;
}

function fileExistsAjax(fileUrl) {
  $.ajax({
	url: fileUrl,
	type:'HEAD',
	error: function() {
	  return false;
	},
	success: function() {
	  return true;
	}
  });
}

function stripSpaces(str) {
	// originally / /g
	return str.toLowerCase().replace(/\W+/g,"+");
}

function clearDiv(divId, loading) {
  $('#' + divId).html('');
  if (loading) {
	$('#' + divId).html('<div class="col-md-12 opacity-80">'+
	  '<div class="loading"></div>' +
	  '</div>');
  }
}

/**
 * Return date as Y-m-d
 * @return {string} 
 */
function getTodaysDate() {
  var d = new Date(),
	month = '' + (d.getMonth() + 1),
	day = '' + d.getDate(),
	year = d.getFullYear(),
	hour = d.getHours();

  var fmtDate = {
	'day': day.toString(),
	'hour': hour.toString(),
  };

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  // Append Y-m-d component
  fmtDate.ymd = [year, month, day].join('-');

  return fmtDate;
}

/**
 * [makeAjaxRequest description]
 * @param  {[type]} postData    [description]
 * @param  {[type]} requestType [description]
 * @param  {[type]} requestUrl  [description]
 * @return {[type]}             [description]
 */
function makeAjaxRequest(postData, requestType, requestUrl) {
	var ajaxObject = { 
		type: requestType,
		url: requestUrl,
		data: postData,
		// Success callback will fire even when coupled with an external $.done
		success : function(response, status) {  // data, status, jqXHR
			debugger;
			if (status === 'success' && response) {
				if (isValidJson(response)) {
					var jsonResponse = JSON.parse(response);
					console.log(jsonResponse);
				}
				else {
		  			alert("Response is not valid JSON");
				}
			 	// Save current artist data in global cache
				CACHE['eventData'] = response;
			 	return(response);
		  	}
		  	else {
		  		alert("No data to display");
		  	}
		},
		// if the request fails, deferred.reject() is called
		error : function(code, message){
		  	// Handle error here
		  	// TODO:  change to jquery UI modal that autofades and has (X) button
		  	return Error("Unable to load Event data =(");
		}
	}; // End ajaxObject 

	console.log(ajaxObject);
	debugger;

	if (requestType == 'POST') {
		ajaxObject.async = false;
	}
	return $.ajax(ajaxObject);
} // End makeAjaxRequest()
