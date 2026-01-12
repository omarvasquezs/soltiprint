<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-gray-50">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>SoltiPrint</title>
        @viteReactRefresh
        @vite('resources/js/app.jsx')
    </head>
    <body class="h-full">
        <div id="app" class="h-full"></div>
    </body>
</html>
