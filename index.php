<?php include 'config.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo App</title>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
    <header>
        <h1>Todo App</h1>   
    </header>
    <div class="container">
        <?php include 'navibar.php'; ?>

        <main class='todoweb'>
            <?php include 'content.php'; ?>
        </main>
    </div>  
</body>
</html>