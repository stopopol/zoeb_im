<?php

// check status of Raumobjekte
require 'db_connect.php';

$result = pg_query($conn, 'select "AKRONYM" from  "aaRaObj_Master";');
if (!$result) {
	echo ("query_error");
}

$query_results = [];

while ($row = pg_fetch_row($result)) {
  array_push($query_results,$row[0]);
}

$RO_number = "Number of ROs: " . count($query_results);

$result_no_dupes = array_unique($query_results);
$count_no_dupes = count($query_results);

// get number of duplicates
$duplicates_count =  $count_no_dupes - count($result_no_dupes);
$duplicates_message = "Number of duplicates: " . $duplicates_count;


$report_summary = [];

array_push($report_summary, $RO_number);
array_push($report_summary, $duplicates_message);

//get values of duplicates
if ($duplicates_count > 0) {
	$dupes_arr = array_unique(array_diff_assoc($query_results, array_unique($query_results)));
	array_push($report_summary, $dupes_arr);
}


// !!! Maybe I should change the order an iterate through the layers and check for the RO in the main table

// search for ROs in layers
// get list of all layers
$layers_results = pg_query($conn, "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_schema,table_name;");
$layer_names = [];
while ($row = pg_fetch_row($layers_results)) {
  array_push($layer_names,$row[0]);
}

$test = [];
// loop through ROs
$i = 1;
foreach ($query_results as $raumobjekt) {
	foreach ($layer_names as $layer ) {
		if ($layer == "aaRaObj_Master" || $layer == "tst" || $layer == "us_gaz" || $layer == "us_lex" || $layer == "us_rules" || $layer == "spatial_ref_sys" || $layer == "stationcodes_nfnbtrees_combined" || $layer == "stationcodes_nfnbtrees" || $layer == "stationcodes_boundingboxes_polygon" || $layer == "stationcodes_boundingboxes" || $layer == "raster_overviews" || $layer == "raster_columns") {
			continue;
		}
		
		if ($layer == "im_baeche") {
			$query_string = 'SELECT "Akronym" FROM "' . $layer . '"' . " WHERE " . '"Akronym" = ' . "'" . $raumobjekt . "'";
			array_push($test, $query_string);
			$RO_is_in_layer = pg_query($conn, $query_string);
		}		
		
	}
} 

//echo json_encode($test);
echo json_encode($report_summary);

pg_close($dbconn); 


?>
