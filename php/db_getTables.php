<?php 

require 'db_connect.php';

$result = pg_query($conn, "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_schema,table_name;");
if (!$result) {
	echo ("query_error");
}

$array = [];

while ($row = pg_fetch_row($result)) {
  array_push($array,$row[0]);
}

echo json_encode($array);

pg_close($dbconn); 
