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
			document.getElementById("content_container").innerHTML = "<h3>Raumobjekte Status Report</h3>";
			for (var i = 0; i < json_response.length; i++) {
				var obj = json_response[i];
				document.getElementById("content_container").innerHTML +=('<p>' + obj + '</p>');
			}
	
		},
		error: function(xhr, status, error) {
			console.log(xhr);
			console.log(status);
			console.log(error);
		}
	}) 

}

$(document).ready(function() {
	print_home();
	document.getElementById("home_button").addEventListener("click", print_home);
	document.getElementById("db_tables_button").addEventListener("click", load_db_tables);
	document.getElementById("db_raumobjekte_button").addEventListener("click", check_ro_status);
});

function print_home() {
  document.getElementById("content_container").innerHTML = `
	<div class='row'>
		<div class='col-sm-4'>
		  <h3>Postgres and PostGIS</h3>
		  <p>This webservice provides access to the Zöbelboden database</p>
		</div>
		<div class='col-sm-4'>
		  <h3>GeoServer</h3>
		  <p><a href='http://geodaten01.umweltbundesamt.at/geoserver/web/'>GeoServer location</a></p>
		  <p>Data can be exported in different formats using GeoServer</p>
		</div>
		<div class='col-sm-4'>
		  <h3>About</h3>        
		  <p>UI to access and manage Zöbelboden Data</p>
		  <p>Layers can be edited using QGIS and pgAdmin</p>
		</div>
	  </div>
    `;
}


