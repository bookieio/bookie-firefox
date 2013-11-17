var html = document.getElementsByTagName('html')[0];

console.log('Loading content script for page-mode');
console.log(html.innerHTML.substring(0, 100));

self.port.emit('got_content', html.innerHTML);
