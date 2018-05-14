<?php

// check status of Raumobjekte
sleep(3);
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

$duplicates_count =  $count_no_dupes - count($result_no_dupes);
$duplicates_message = "Number of duplicates: " . $duplicates_count;


$report_summary = [];

array_push($report_summary, $RO_number);
array_push($report_summary, $duplicates_message);

if ($duplicates_count > 0) {
	$dupes_arr = array_unique(array_diff_assoc($query_results, array_unique($query_results)));
	array_push($report_summary, $dupes_arr);
}


echo json_encode($report_summary);



pg_close($dbconn); 


?>
