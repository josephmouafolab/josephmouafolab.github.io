<?php
	include ( "NexmoMessage.php" );
	/**
	 * To send a message
	 *
	 */
	 // Step 0: variables
	$sender = $_POST['from'];
	$gsm = $_POST['votre_destinataire'];
	$message = $_POST['message'];
	// Step 1: message
	$nexmo_sms = new NexmoMessage('81050d32', 'bc48f03eb929e054');
	// Step 2: Send message 
	$info = $nexmo_sms->sendText( $gsm, $sender,$message );
	// Step 3: status of message
	echo $nexmo_sms->displayOverview($info);
	// Done !
?>
