<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../vendor/autoload.php');

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

# Designates the folder storing Twig templates
$loader = new FilesystemLoader('../templates');

# Initializes Twig environment
$twig = new Environment($loader, array(
    # Twig settings
    'cache' => 'cache/',
    'debug' => TRUE
));

# Default values to be passed into Twig
$twigVals = array(
    'pageTitle' => 'iCal Generator',
);

# Takes the request URI. For example, in http://www.example.com/login, the request URI is '/login'
$uri = $_SERVER['REQUEST_URI'];

# This bit of logic breaks up the URI into the page request and the query string if
# the query string is present.
if (strpos($uri, "?") === false) {
    $page = $uri;
    $query_str = null;
    $query_vals = null;
} else {
    $uri = str_replace("?", " ", $uri);
    list($page, $query_str) = sscanf($uri, "%s %s");
    parse_str($query_str, $query_vals);
}

# Basic router. Switch cases correspond to the URI request
# For example, 'http://localhost' corresponds to '/' and 'http://localhost/page' would correspond to '/page'
switch ($page) {
    case '/':
        echo $twig->render('landing.html.twig', $twigVals);
        break;

    default:
        echo $twig->render('404.html.twig', array_merge($twigVals, array(
            'pageTitle' => 'Error 404',
            'request' => $page,
        )));
}
