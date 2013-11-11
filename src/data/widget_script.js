/*jshint moz:true*/
var icon = document.getElementById('icon');

// TODO
// setting background color doesn't work as it does
// in Chrome -- might need to actually use diff images
self.port.on('bmark_success', function() {
    console.log('SUCCESS');
    icon.style.backgroundColor = 'green';
});

self.port.on('bmark_error', function() {
    console.log('ERROR');
    icon.style.backgroundColor = 'red';
});

self.port.on('bmark_removed', function() {
    console.log('REMOVED');
    icon.style.backgroundColor = 'green';
});

self.port.on('bmark_exists', function() {
    console.log('EXISTS');
    icon.style.backgroundColor = 'blue';
});
