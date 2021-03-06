/**
 * @file gallery.js Builds pretty DOM elements and fills them with data
 * @author Mihai Peteu
 * @copyright 2016 Renova Bikes.  All rights reserved.
 */


function generateInseamSizes() {
	// 1 in = 2.54cm
	var heightMin = 48;  // 4 ft
	var heightMax = 84;   // 7 ft
	var feet;
	var inches;
	var optionHtml;

	for (var i = heightMin; i <= heightMax; i++) {
		feet = Math.floor(i / 12);
		inches = (i % 12) != 0
			? i % 12 + ' in'
			: '';

		optionHtml = 
			'<option value="' + i + '">' +
				feet + 'ft ' + inches +
			'</option>';

		$('#height-dropdown').append(optionHtml);	        	
	}

	// Inseam min / max
	var inseamMin = 20;
	var inseamMax = 38;
	var selected = '';

	for (var i = inseamMin; i <= inseamMax; i++) {
		selected = '';
		// Default to the most common inseam
		// if (i == 32) {
		// 	selected = ' selected';
		// }

		optionHtml = 
			'<option value="' + i + '">' +
				i +
			'</option>';

		$('#inseam-dropdown').append(optionHtml);	        	
	}
} // End generateInseamSizes()

function generateBikeTypes(bikes, targetElement) {
	var uses = bikes.unique('Use');

	// Clear existing content, if any
	$(targetElement).empty();

	for (var i = 0; i < uses.length; i++) {
		var bikeUse = uses[i];

		var $bikeUseDiv = $('<div>')
			.addClass('checkbox checkbox-info checkbox-circle');

		var $useInput = $('<input>')
			.attr('type', 'checkbox')
			.attr('id', bikeUse)
			.addClass('styled');

		var $useLabel = $('<label>')
			.attr('for', bikeUse)
			.html(bikeUse);

		$bikeUseDiv.append($useInput);
		$bikeUseDiv.append($useLabel);

		$(targetElement).append($bikeUseDiv);
	} // Loop through bike 'Use' values, creating checkboxes
} 

/**
 * Pull in a reusable HTML template for each bike, clone it and fill it with 
 * the incoming bike data
 * @param  {array} 	bikes - Array of bike objects
 * @param  {string} targetElement - Id of where this will get loaded into
 */
function loadBikesIntoTemplate(bikes, targetElement) {	
	// Load html template, then inject data into cloned containers
	$('#template-temp')
		.load('templates/portfolio-item.html', function(){
			// Then fill in the bike data with the ajax response payload
			loadBikes(bikes, targetElement);
		});
} // End loadBikesIntoTemplate()

/**
 * Loads given array's content into the specific dom selector
 * @param  {array} 	bikes - Array of bike objects
 * @param  {string} targetElement - Id of where this will get loaded into
 */
function loadBikes(bikes, targetElement) {	
	// Append incoming data to DOM (fields below)
	// 
	// 	 Make, Model, Year, Notes, Photos
	//   Color, Country, Display, Gearing
	//   Price, Size, Style, Use, Wheelsize
	//   
	var bike = '';
	for (var i = 0; i < bikes.length; i++) {
		bike = bikes[i];

		// Create a unique element id to reference the element by
		var bikeId = 'bike-' + bikes[i]['Id'];

		var bikeName = 
			bike.Make + ' ' + 
			bike.Model + 
			(bike.Year ? ' (' + bike.Year + ')' : '');

		var bikeSize = bike.Size + 
			(bike.Use ? ', ' + bike.Use : '');

		$('#item-template')
			.clone()
			.removeClass('hidden')
			.attr('data-bikeid', bikes[i]['Id'])
			.attr('id', bikeId)
			.appendTo(targetElement);

		// Change attributes of the most recent dynamically created element
		$(targetElement + ' #' + bikeId).find('#bike-photo-main').attr('src', bike.Photos[0]);

		$(targetElement + ' #' + bikeId).find('.portfolio-caption .bike-name')
			.removeClass('loading')
			.html(bikeName);

		$(targetElement + ' #' + bikeId).find('.portfolio-caption .bike-size')
			.removeClass('loading')
			.html(bikeSize);

		$(targetElement + ' #' + bikeId).find('.portfolio-caption .bike-price')
			.removeClass('loading')
			.html(bike.Price);
	} // End for loop through all bike items

	// If detail modal is clicked, need to load custom data
	$('.portfolio-item').on('click', function() {
		// Search for the bike's id in the global array 
		var bike = window.bikes.pluckIfKeyValueExists('Id', $(this).data('bikeid'))[0];

		$("#bikeDetails #bike-title").html(bike.Make + ' ' + bike.Model);
		$("#bikeDetails #bike-subtitle").html(bike.Price);
		$("#bikeDetails #bike-image").attr('src', bike.Photos[0]);
		$("#bikeDetails #bike-notes").html(bike.Notes);

		// Details list items
		$("#bikeDetails #bike-use").html(bike.Use);
		$("#bikeDetails #bike-wheelsize").html(bike.Wheelsize);
		$("#bikeDetails #bike-color").html(bike.Color);
		$("#bikeDetails #bike-country").html(bike.Country);
	}); 	
}
