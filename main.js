alert("The extension is up and running");

var images = document.getElementsByTagName('img');

for (let elt of images) {
   elt.src = chrome.runtime.getURL("pp.jpg");
   elt.alt = 'an alt text';
}
