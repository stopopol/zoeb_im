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

// search for ROs in layers
// get list of all layers containing ROs
$layers_results = pg_query($conn, "select table_name from INFORMATION_SCHEMA.COLUMNS where COLUMN_NAME like '%Akronym%' order by TABLE_NAME");
$layer_names = [];
while ($row = pg_fetch_row($layers_results)) {
  array_push($layer_names,$row[0]);
}


// loop through ROs

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

array_push($report_summary, "Following ROs are not in any layer: ");

$redundant_ro_list = [];
// iterate through all ROs
foreach ($query_results as $ro ) {
	if (!in_array($ro, $list_ros_layers)) {
		//$RO_redundant_message = "Following RO is not in any layer: " . $ro;
		array_push($redundant_ro_list,$ro);
	}
}

array_push($report_summary, $redundant_ro_list);

echo json_encode($report_summary);

pg_close($dbconn); 


?>
