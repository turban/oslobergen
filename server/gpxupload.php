<?php

mb_internal_encoding("UTF-8");
mb_http_output("UTF-8");

require_once 'cartodb.class.php';
require_once 'config.php';

date_default_timezone_set($timezone);

$cartodb = new CartoDBClient($cartodb_config);

if (!$cartodb->authorized) {
  error_log("uauth");
  print 'There is a problem authenticating, check the key and secret.';
  exit();
}

if ($_FILES["file"]["error"] > 0) {
  echo "Error: " . $_FILES["file"]["error"] . "<br>";
} else {
  echo "Upload: " . $_FILES["file"]["name"] . "<br>";
  echo "Type: " . $_FILES["file"]["type"] . "<br>";
  echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
  echo "Stored in: " . $_FILES["file"]["tmp_name"] . "<br><br>";

  $gpx = simplexml_load_file($_FILES["file"]["tmp_name"]);

  $sql = '';

  foreach ($gpx->trk as $trk) {
  	$seg = '0';
	foreach ($trk->trkseg as $trkseg) {
		foreach ($trkseg->trkpt as $trkpt) {
			$attrs = $trkpt->attributes();
			$lat = $attrs["lat"];
			$lon = $attrs["lon"];
			$point = "SRID=4326;POINT($lon $lat)";
			$timestamp = strtotime($trkpt->time);
			$sql .= "INSERT INTO gpx (name, trkseg, the_geom, latitude, longitude, elevation, time, timestamp) VALUES('$trk->name', $seg, '$point', $lat, $lon, $trkpt->ele, '$trkpt->time', $timestamp);";
		}
		$seg++;
	}
  }

  $response = $cartodb->runSql($sql);
  print_r($response);
}

?>

