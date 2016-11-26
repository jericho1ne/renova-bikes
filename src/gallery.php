<?php
require_once 'php/common.php';
require_once 'php/getBikeData.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Refurbished and Used bikes in East Lansing">
    <meta name="author" content="Renova Bikes">

    <title>Renova Bikes Lansing - Sale List</title>

     <!-- Bootstrap Core CSS -->
    <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- Custom Fonts -->
    <link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Hind|Libre+Franklin|Oswald" rel="stylesheet">

    <!-- Theme CSS -->
    <link href="css/agency.min.css" rel="stylesheet">

    <!-- Renova Bikes Custom CSS -->
    <link href="css/main.css" rel="stylesheet">
    <link href="css/datatables.css" rel="stylesheet">
    
    <!-- Datatable required script files -->
	<script type="text/javascript" src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/jquery.dataTables.min.js"></script>
</head>

<body>
	<!-- Navigation -->
	<nav id="mainNav" class="navbar navbar-default navbar-custom navbar-fixed-top">
        <div class="container">
	        <!-- Brand and toggle get grouped for better mobile display -->
	        <div class="navbar-header page-scroll">
	            <a class="navbar-brand" href="index.html">Go Back</a>
	        </div>
	    </div>
	</nav>
	<!-- Header -->
	<div class="container herotext pad-top-50">
	    <div class="intro-text">
	        <div class="intro-heading">Featured Bikes</div>
	        <div class="intro-lead-in">Complete Builds</div>
	    </div>
	</div>

	<!-- Bike Listings -->
	<div class="container-full margin-top-20">
		<table id="bikesForSale" class="border-collapse responsive nowrap border-bottom w100p">
			<thead class="">
				<?php 
					$skipDisplay = [
						'Photos', 
						'Notes', 
						'Use', 
						'Country', 
						'Wheelsize', 
						'Style',
						'Display'
					];

					foreach ($headerRows as $header) {
						if (in_array($header, $skipDisplay)) {
							continue;
						}
						$hiddenClasses = '';
						if ($header == 'Gearing') {
							$hiddenClasses = 'hidden-xs';
						}
						echo 
							'<th class="left h50 bg-header '.$hiddenClasses.'">' . 
								'<span class="gray left text-sm">'.
									'<a href="#">'.$header.'</a></span>' . 
							'</th>';
					}
				?>
			</thead>
			<tbody>
				<?php 
					foreach ($tableData as $i => $bike) {
						// Don't show hidden bikes 
						if (trim(strtolower($bike['Display'])) == "n") {
							continue;
						}
						echo '<tr>';
						
						//
						// PHOTOS
						// 
						// If no photos exist, default to a placeholder
						$firstPhoto = '<span class="not-available">- n/a -</span>';			


						// At least one photo in string
						if (count($bike['Photos']) && isset($bike['Photos'][0])) {
							$firstPhoto = '<img src="' . trim($bike['Photos'][0]) . '" class="bike-photo">';
						}

						//
						// SIZE
						// 
						$bikeSize = $bike['Size'];
						if (is_numeric($bikeSize)) {
							if ($bikeSize < 30) {
								$bikeSize .= "in";
							}
							else {
								$bikeSize .= "cm";
							}
						}

						// Set up information for pop up modal
						$bikeName =  $bike['Make'] . ' ' . $bike['Model'] . ' '. $bike['Year'];

						//
						// PRICE
						// 
						$bikePrice = trim($bike['Price']);

						if (stripos($bikePrice, '$') === false && strlen($bikePrice) > 2) {
							$bikePrice = '$' . $bikePrice;
						}
						else {
							$bikePrice = 'ask';
						}

						// Photo (links to carousel popup)
						echo 
							'<td class="bike-header-cell w10p left">' . 
								'<a href="#bikeDetailModal" class="portfolio-link" ' . 
									'data-toggle="modal" '.
									'data-name="' . $bikeName . '" '.
									'data-price="' . $bikePrice . '" '.
								'>' .
									$firstPhoto . 
								'</a>' .

							'</td>';

						// Make / Model
						echo 
							'<td class="left w10p pad-left-4 nowrap" data-sort="' . $bike['Make'] . $bike['Model'] . '">' . 
								'<span class="text-bike-maker">' . $bike['Make'] . '</span>' . 
								'<span class="text-sm">' . $bike['Model'] . '</span>' . 
								'<span class="text-sm">' . $bike['Year'] . '</span>' . 
							'</td>';

						// Use
						echo 
							'<td class="left w5p" data-sort="' . $bike['Use'] .'">' . 
								'<span class="text-sm">' . $bike['Use'] . '</span>' . 
							'</td>';

						// Size
						echo 
							'<td class="left w5p" data-sort="' . $bikeSize .'">' . 
								'<span class="text-sm">' . $bikeSize . '</span>' . 
							'</td>';

						// Gearing
						echo 
							'<td class="left w5p hidden-xs" data-sort="' . $bike['Gearing'] .'">' . 
								'<span class="text-sm">' . $bike['Gearing'] . '</span>' . 
							'</td>';

						// Price
						echo 
							'<td class="left w5p" data-sort="' . $bikePrice . '">' . 
								'<span class="text-md">' . $bikePrice . '</span>' . 
							'</td>';
					}
				?>
			</tbody>
		</table>
	</div>

	<!-- Bootstrap Core JavaScript -->
    <script src="vendor/bootstrap/js/bootstrap.min.js"></script>
	
	<!-- Bootstrap Theme JavaScript -->
    <script src="js/agency.min.js"></script>
</body>

<script>
var tableData = <?=json_encode($tableData)?>;
var headerRows = <?=json_encode($headerRows)?>;

// console.log(tableData);
// console.log(headerRows);

$(document).ready(function() {
    $('#bikesForSale').DataTable({
        "bPaginate": true,
        "pagingType": "simple",      // Prev and Next buttons only 
        "pageLength": 20,
        "initComplete": function () {
        },
        "lengthChange": false,
        //  "lengthMenu": [[10, 20, 40, -1], [10, 20, 40, "All"]],
        //"dom": '<"top"ifl<"clear">>rt<"bottom"p<"clear">>',
        // f=search, p=pagination
        "dom": '<"top"iflp>rt<"bottom"lp><"clear">',
        
        // Alternating row color
        "asStripeClasses": [ 'even-bgcolor', 'odd-bgcolor' ],

        "order": [[ 3, "desc" ]],
        "aoColumnDefs": [
            { 'bSortable': true, 'aTargets': [ 1, 2, 3, 4 ] }
        ],
        "autoWidth": false,
        "language": {
            //  "lengthMenu": "_MENU_ per pg",
            "sSearch": "search by any field",     // Search input box label
            "zeroRecords": "Nothing found.",
            "info": "",  // Default:  "Page _PAGE_ of _PAGES_",
            "infoEmpty": "No bikes available for sale",
            "infoFiltered": ""
        }
    });
});
</script>

</html>

