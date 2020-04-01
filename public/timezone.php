<?php
if ($_GET['tz'] === null) {
    echo 'timezone not defined';
} else {
    // Fetches ICal VTIMEZONE data corresponding to the timezone passed
    $data = file_get_contents('http://tzurl.org/zoneinfo-outlook/' . $_GET['tz']);
    $tok = strtok($data, "\n");

    $response = "";
    while ($tok !== false) {
        // If statement omits lines with:
        // BEGIN:VCALENDAR
        // PRODID
        // VERSION
        // TZURL
        // END:VCALENDAR
        // while keeping the relevant VTIMEZONE data
        if (!(strpos($tok, 'END:VCALENDAR') !== false || strpos($tok, 'BEGIN:VCALENDAR') !== false ||
        strpos($tok, 'PRODID') !== false || strpos($tok, 'TZURL') !== false || 
        strpos($tok, 'BEGIN:VCALENDAR') !== false || strpos($tok, 'VERSION') !== false))  {
            $response .= "$tok\n";
        }
        $tok = strtok("\n");
    }   
    echo $response;
}
?>