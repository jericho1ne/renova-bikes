<?php
require_once 'common.php';

// Changing the source type changes the URL parsing logic
$urlType = 'html';	// 'html' or 'json'

// https://docs.google.com/spreadsheets/d/1ZK1qCPPpWJXGelLctQIKGvrdPoldCJF7VxepObEKXlc/gviz/tq?tqx=out:html&gid=0

$url = 'https://docs.google.com/spreadsheets/d/1ZK1qCPPpWJXGelLctQIKGvrdPoldCJF7VxepObEKXlc/gviz/tq' . 
	'?tqx=out:' . $urlType . '&gid=0';

// Local, for testing
$url = "bike-data.html";

// Grab raw table data
$rawData =  file_get_contents($url);

// If JSON
if ($urlType == 'json') {
	$rawData = str_replace('/*O_o*/', '', $rawData);
	$rawData = str_replace('google.visualization.Query.setResponse(', '', $rawData);
	$rawData = str_replace('}]}});', '}]}}', $rawData);
}
// If HTML
else if ($urlType == 'html') {
	$doc = new DOMDocument();
	$doc->loadHTMLFile($url);

	$tableRows = $doc->getElementsByTagName("tr");
	$headerRows = [];
	$bikeData = [];

	// Go through table rows, determining the headers
	for ($i = 0; $i < $tableRows->length; $i++) {
	    $cols = $tableRows->item($i)->getElementsbyTagName("td");
	    for ($j = 0; $j < $cols->length; $j++) {
			$cellValue = trim($cols->item($j)->nodeValue);

			// Determine if header row
			if ($i == 0) {
				$headerRows[] = trim($cellValue, chr(0xC2).chr(0xA0));
			}

			// If blank header, we're done
			if ($cellValue == '') {
				break;
			}
	    }
	} // End first for loop
	
	$numCols = count($headerRows);

	// Loop through again, grabbing data through table rows, determining the headers
	for ($i = 1; $i < $tableRows->length; $i++) {
		$cols = $tableRows->item($i)->getElementsbyTagName("td");
		// pr($cols);
		for ($j = 0; $j < $numCols; $j++) {
			$cellValue = $cols->item($j)->nodeValue;
			$bikeData[$i-1][$j] = trim($cellValue);
		}
	}
	
	$tableData = [];	
	foreach ($bikeData as $key => $bike) {
		$tableData[] = array_combine($headerRows, $bike);
	}
}
					
// Go through deleting empty entries and trimming spaces
foreach ($tableData as $bikeIndex => $bike) {
	// Remove bikes that have a "hidden" display flag
	if (trim($bike['Display']) == 'n') {
		unset($tableData[$bikeIndex]);
		continue;
	}

	// SIZE
	$bikeSize = $bike['Size'];
	if (is_numeric($bikeSize)) {
		if ($bikeSize < 30) {
			$bikeSize .= "in";
		}
		else {
			$bikeSize .= "cm";
		}
	}
	$tableData[$bikeIndex]['Size'] = $bikeSize;

	// PRICE
	$bikePrice = trim($bike['Price']);
	if (stripos($bikePrice, '$') === false && strlen($bikePrice) > 2) {
		$bikePrice = '$' . $bikePrice;
	}
	else {
		$bikePrice = 'ask';
	}
	$tableData[$bikeIndex]['Price'] = $bikePrice;


	// Add a common size attribute
	$bikeSize = $bike['Size'];
	if (is_numeric($bikeSize)) {
		// Assume that frame size is in inches
		if ($bikeSize < 30) {
			// 1 in = 2.54cm, convert accordingly
			$bikeSize = floor($bikeSize * 2.54);
		}
	}
	$tableData[$bikeIndex]['SizeInCm'] = $bikeSize;

	// Create photo array from CSV string
	$photosArray = explode(',', trim($bike['Photos']));
	// Go through deleting empty entries and trimming spaces
	foreach ($photosArray as $key => $photo) {
		$tempPhotoName = trim($photo);
		$tempPhotoName = str_replace(" ", "", $tempPhotoName);
	
		// Remove the array entry if blank
		if (empty($tempPhotoName) || strlen($tempPhotoName) < 5) {
			unset($photosArray[$key]);
		}
		// Potentially valid image URL 
		else {
			// Check for missing things, like http://
			if (stripos($photo, 'http://') === false) {
				$tempPhotoName = 'http://' . $photo;
			}
			// Always save back into Photos array if valid
			$photosArray[$key] = $tempPhotoName;
		}
	} // End loop breaking down CSV photo URLs into array

	// Rekey array to be sequential
	$photosArray= array_values($photosArray);
	// unset($tableData[$key]['Photos']);
	// $tableData[$key]['Photos'] = [];
	$tableData[$bikeIndex]['Photos'] = $photosArray;
} // End loop to get images

$tableData = array_values($tableData);
$json_string = json_encode($tableData);

echo(str_replace('\u00a0', '', $json_string));
?>