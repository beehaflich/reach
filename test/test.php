<?php


$arguments = array();
$keys = array(
  'apple',
  'banana',
  'carrot',
  'durian',
  'eggplant'
);

foreach($keys as $key) {
  $arguments[$key] = (
    isset($_GET[$key]) ?
    intval($_GET[$key]) :
    0
  );
}

try {
  $callback = $_GET['callback'];
} catch(Exception $e) {
  echo 'Callback parameter must be set!';
}

$fruits = $arguments['apple'] + $arguments['banana'] + $arguments['durian'];
$vegetables = $arguments['carrot'] + $arguments['eggplant'];
$random = rand(1, 10);


$response = (
  $callback . '(' .
  json_encode(array(
    'fruit' => $fruits,
    'vegetable' => $vegetables,
    'random' => $random,
    'success' => true,
    'foo' => 'bar'
  )) .
  ');'
);
echo($response);

die();





