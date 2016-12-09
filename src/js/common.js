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
	ajaxResponse = {
		result: false,
		message: '',
		payload: ''
	};

	var ajaxObject = { 
		async: false,
		type: requestType,
		url: requestUrl,
		data: postData,
		dataFilter: function (response) {
    		if (response) {
				// Success
				if (isValidJson(response)) {
					var jsonResponse = JSON.parse(response);
					// Save current artist data in global cache
					// CACHE['responseData'] = response;
					return {
						result: true,
						message: "Data parsed successfully",
						payload: jsonResponse
					}
				}
				// Fail 
				else {
					console.warn("Response is not valid JSON");
					return {
						result: false,
						message: "There was an error encountered while parsing the response",
						payload: ""
					}
				}
			}
			else {
				console.warn("No data received");
				return {
					result: false,
					message: "There is no data to display",
					payload: ""
				}
			}
	    }, // End dataFilter
	}; // End ajaxObject

	// if (requestType == 'POST') {
	// 	ajaxObject.async = false;
	// }
	return $.ajax(ajaxObject)
		// Success callback will fire even when coupled with an external $.done
		.done(function(response, status, jqXHR) {
    		console.log( "done success" );
  		})
		.fail(function(code, message) {
			// Handle error with general failure message
			console.warn("Error code: " + code + " / Message: " + message);
		})
		.always(function() {
			// TODO:  fill in actions that should always fire
		});
} // End makeAjaxRequest()
