<?php 

require_once('../vendor/autoload.php');

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

$loader = new FilesystemLoader('../templates');
$twig = new Environment($loader, array(
    'cache' => '/var/www/Pickled-Garlic/public/cache/',
    'debug' => TRUE,
));

$twigVals = array(
    'pageTitle' => 'Home',
    'test' => 'testValue',
);

echo ("URI". $_SERVER['REQUEST_URI']);
switch($_SERVER['REQUEST_URI']){
    case '/':
        echo $twig->render('landing.html.twig', $twigVals);
    break;

    case '/test':
        echo $twig->render('landing.html.twig', $twigVals);
    break;
    default:
    echo $twig->render('404.html.twig', $twigVals);

}