/**
 * @file methods.js Builds pretty DOM elements and fills them with data
 * @author Mihai Peteu
 * @copyright 2016 Renova Bikes.  All rights reserved.
 */

/**
 * Loads given array's content into the specific dom selector
 * @param  {array} bikes Array of bike objects
 * @param  {string} targetElement Id of where this will get loaded into
 * @return nothing
 */
function loadBikes(bikes, targetElement) {	
	console.log(" >> loading bikes into " + targetElement);

	// Append imcoing data to DOM (fields below)
	// 
	// 	 Make, Model, Year, Notes, Photos
	//   Color, Country, Display, Gearing
	//   Price, Size, Style, Use, Wheelsize
	//   
	var bike = '';
	for (var i = 0; i < bikes.length; i++) {
		bike = bikes[i];

		// Create a unique element id to reference the element by
		var bikeId = 'bike-' + i;

		var bikeName = 
			bike.Make + ' ' + 
			bike.Model + 
			(bike.Year ? ' (' + bike.Year + ')' : '');

		var bikeSize = bike.Size + 
			(bike.Use ? ', ' + bike.Use : '');

		$('#item-template')
			.clone()
			.removeClass('hidden')
			.attr('data-bikeid', i)
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
}
