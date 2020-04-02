<?php
if ($_GET['tz'] === null) {
    echo 'timezone not defined';
} else {
    // Fetches ICal VTIMEZONE data corresponding to the timezone passed
    $file = str_replace("/", "", $_GET['tz']);
    $data = file_get_contents('tzdata/' . $file);
    echo $data;
}
?>