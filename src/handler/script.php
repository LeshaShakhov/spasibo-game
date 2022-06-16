<?php
 
@date_default_timezone_set("Europe/Moscow");
$dbhost="localhost";
$dbuser="u0580651_default";
$dbpassword="v_JOU6_a";
$dbname="u0580651_default";
$mysql_conn = mysqli_connect($dbhost, $dbuser, $dbpassword, $dbname);
mysqli_set_charset($mysql_conn,"utf8");

$name = $_POST['name'];
$email = $_POST['email'];
$city = $_POST['city'];
$date = date('Y-m-d H:i:s');

$sql = "insert into from_formsend values ('$date', '$name','$email', '$city')";
$res=mysqli_query($mysql_conn, $sql);

?>

