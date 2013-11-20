/*jshint moz:true*/
var icon = document.getElementById('icon');
var normal = 'images/logo.16.png',
    green = 'images/logo.16.green.png',
    red = 'images/logo.16.red.png',
    plus = 'images/logo.16.plus.png';

// TODO
// setting background color doesn't work as it does
// in Chrome -- might need to actually use diff images
self.port.on('bmark_success', function() {
    console.log('SUCCESS');
    icon.src=green;
    setTimeout(function() {
        icon.src=normal;
    }, 3000);
});


self.port.on('bmark_error', function() {
    console.log('ERROR');
    icon.src=red;

    setTimeout(function() {
        icon.src=normal;
    }, 3000);
});


self.port.on('bmark_removed', function() {
    console.log('REMOVED');
    icon.src=green;
    setTimeout(function() {
        icon.src=normal;
    }, 3000);
});


self.port.on('bmark_exists', function() {
    console.log('EXISTS');
    icon.src=plus;
});


self.port.on('icon_reset', function () {
    console.log('RESET');
    icon.src = normal;
});


console.log('Widget Script');
console.log(self);
console.log(self.prototype);
console.log(self.panel);
