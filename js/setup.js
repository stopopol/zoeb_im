/**
 * setup.js
 *
 * loads layers
 *
 */
 
function load_db_tables() {

	$.ajax({
		type: "POST",
		url: 'php/db_getTables.php',
		success: function(response) {

			var json_response = JSON.parse(response);
			document.getElementById("content_container").innerHTML = "<h3>Current tables in database</h3>";
			for (var i = 0; i < json_response.length; i++) {
				var obj = json_response[i];
				console.log(obj);
				document.getElementById("content_container").innerHTML +=('<a class="dropdown-item" href="#" id=' + obj + ' >' + obj + '</a>');
			}
			
		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
		}
		
	}) 

}

function check_ro_status() {

	$.ajax({
		type: "POST",
		url: 'php/db_checkRO.php',
		success: function(response) {

			var json_response = JSON.parse(response);
		
			var number_of_duplicates = json_response["number_duplicates"];
			var list_of_duplicates = json_response["list_duplicates"];
		
			var ros_not_in_main_table = json_response["ros_not_in_main_table"];	
			console.log(ros_not_in_main_table);
			var number_ros_not_in_main_table = Object.keys(ros_not_in_main_table).length;
			var total_issues = number_of_duplicates + number_ros_not_in_main_table;
			
			if (number_of_duplicates == 0) {
				var status_duplicate = '<p style="color:green; text-align: center;">✓</p>';
			} 
			else {
				var status_duplicate = '<p style="color:red; text-align: center;">✕</p>';
			}
	
			if (number_ros_not_in_main_table == 0) {
				var status_ros_not_in_main_table = '<p style="color:green; text-align: center;">✓</p>';
			}
			else {
				var status_ros_not_in_main_table = '<p style="color:red; text-align: center;">✕</p>';
			}
			
			
			document.getElementById("content_container").innerHTML = "<h3>Status Report - Raumobjekte</h3><small class='text-muted'>This report is automatically generated based on all tables containing an 'Akronym' column</small>";
			if (total_issues > 0) {
				if (total_issues == 1) {
					document.getElementById("content_container").innerHTML += "<br><br><p style='color:orange;'>You're almost there. 1 issue is left.</p>";
				}
				else {
					document.getElementById("content_container").innerHTML += "<br><br><p style='color:red;'>Oh no! There's a total of " + total_issues + " issues :(</p>";
				}
			}
			else {
				document.getElementById("content_container").innerHTML += "<p style='color:green;'>Looks good. No issues were found :)</p>";
			}
			document.getElementById("content_container").innerHTML += '<table class="table"> <thead><tr> <th scope="col">Issue Type</th> <th scope="col">Issue count</th> <th scope="col">"Akronym" of each RO</th> <th scope="col">Status</th></tr> </thead> <tbody><tr> <th scope="row">Duplicates in the main table</th> <td>' + number_of_duplicates + '</td> <td>' + JSON.stringify(list_of_duplicates, null, 2) + '</td> <td>' + status_duplicate + '</td></tr><tr> <th scope="row">List of ROs that are not in the main table, but were found in a layer</th> <td>'+ number_ros_not_in_main_table + '</td> <td>'+ JSON.stringify(ros_not_in_main_table, null, 2) + '</td> <td>'+ status_ros_not_in_main_table + '</td></tr> </tbody></table>';
				/*
				document.getElementById("content_container").innerHTML += '
				<table class="table">
				  <thead>
					<tr>
					  <th scope="col">Issue Type</th>
					  <th scope="col">Issue Count</th>
					  <th scope="col">"Akronym" of each RO</th>
					  <th scope="col">Status</th>
					</tr>
				  </thead>
				  <tbody>
					<tr>
					  <th scope="row">Duplicates in the main table</th>
					  <td>' + number_of_duplicates + '</td>
					  <td>' + JSON.stringify(list_of_duplicates, null, 2) + '</td>
					  <td>' + status_duplicate + '</td>
					</tr>
					<tr>
					  <th scope="row">List of ROs that are not in any layer, but in the main table</th>
					  <td>'+ number_ros_not_in_layers +'</td>
					  <td>'+ JSON.stringify(ros_not_in_layers, null, 2) + '</td>
					  <td>'+ status_ros_not_in_layers + '</td>
					</tr>
					<tr>
					  <th scope="row">List of ROs that are not in the main table, but were found in a layer</th>
					  <td>'+ number_ros_not_in_main_table + '</td>
					  <td>'+ JSON.stringify(ros_not_in_main_table, null, 2) + '</td>
					  <td>'+ status_ros_not_in_main_table + '</td>
					</tr>
				  </tbody>
				</table>
				';
				*/

		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
		}
	}) 

}

/*
	`
	<div class="jumbotron text-center">
	  <h1>Welcome to the Zöbelboden Data Pit</h1>
	  <p>This is a testing and development instance for managing geospatial data</p> 
	</div>
	<div class='row'>
		<div class='col-sm-4'>
		  <h3>Postgres and PostGIS</h3>
		  <p>This webservice provides access to the Zöbelboden database</p>
		</div>
		<div class='col-sm-4'>
		  <h3>GeoServer</h3>
		  <p>Data can be exported in different formats using GeoServer</p>
		</div>
		<div class='col-sm-4'>
		  <h3>About</h3>        
		  <p>UI to access and manage Zöbelboden Data</p>
		  <p>Layers can be edited using QGIS and pgAdmin</p>
		</div>
	  </div>
    `;
*/


function print_home() {
	document.getElementById("content_container").innerHTML = '<div class="jumbotron text-center"> <h1>Welcome to the Zöbelboden Data Pit</h1> <p>This is a testing and development instance for managing geospatial data</p> </div><div class="row"><div class="col-sm-4"> <h3>Postgres and PostGIS</h3> <p>This webservice provides access to the Zöbelboden database</p></div><div class="col-sm-4"> <h3>GeoServer</h3> <p>Data can be exported in different formats using GeoServer</p></div><div class="col-sm-4"> <h3>About</h3> <p>UI to access and manage Zöbelboden Data</p> <p>Layers can be edited using QGIS and pgAdmin</p></div> </div>';
}

$(document).ready(function() {
	print_home();
	
	document.getElementById("home_button").addEventListener("click", print_home);
	document.getElementById("db_tables_button").addEventListener("click", load_db_tables);
	document.getElementById("db_raumobjekte_button").addEventListener("click", check_ro_status);
});