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

$result_no_dupes = array_unique($query_results);
$count_no_dupes = count($query_results);

// get number of duplicates
$duplicates_count =  $count_no_dupes - count($result_no_dupes);

// get values of duplicates
$dupes_arr = array_unique(array_diff_assoc($query_results, array_unique($query_results)));

// search for ROs in layers
// get list of all layers containing ROs
$layers_results = pg_query($conn, "select table_name from INFORMATION_SCHEMA.COLUMNS where COLUMN_NAME LIKE 'Akronym' order by TABLE_NAME");
$layer_names = [];
while ($row = pg_fetch_row($layers_results)) {
  array_push($layer_names,$row[0]);
}

// get all ROs in every layer
// build query string
$query_string = "";
foreach ($layer_names as $layer ) {
	$query_string = $query_string . 'SELECT "Akronym" FROM "' . $layer . '" UNION ';
}
$query_string = substr($query_string, 0, -7);
$query_string = $query_string . ";";

$ROs_results = pg_query($conn, $query_string);

$list_ros_layers = [];
while ($row = pg_fetch_row($ROs_results)) {
  array_push($list_ros_layers,$row[0]);
}

// Check for all ROs that are in any layer, but not in the main table
$ROs_not_in_maintable = [];
foreach ($list_ros_layers as $ro) {
	if (!in_array($ro, $query_results)) {
		array_push($ROs_not_in_maintable,$ro);
	}
}

$report_summary = [];

$report_summary["number_ros"] 				= count($query_results);
$report_summary["number_duplicates"] 		= $duplicates_count; 
$report_summary["list_duplicates"] 			= array_values($dupes_arr);
$report_summary["ros_not_in_main_table"] 	= $ROs_not_in_maintable;

echo json_encode($report_summary);

pg_close($dbconn); 