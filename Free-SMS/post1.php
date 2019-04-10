
<?php
$password = $_POST['password'];
if ($password !=='admin2019') {
include ("error.html");
}
else {
 
    include ( "send.html" );
}
?>