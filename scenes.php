<?php 
// Your machine cannot run PHP. So, We cannot do automatic directory listing.
// Please remove ".htaccess" from your directory and manuel create "data/scenes.json" instead.

// If php working correcly. you shouldn't see the code below
$DIR = 'data/';
$files = scandir($DIR);
$files = array_filter($files, function($o) use ($DIR){
    return is_dir($DIR.$o) and $o != '.' and $o != '..';
});
$data = ['scenes' => array_values($files)];
header('Content-Type: application/json');
print(json_encode($data));
?>