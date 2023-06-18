
 
let num = document.getElementById('num');

/*
num.innerHTML =  parent.document.body.clientWidth + (1280-1154);

let vis = document.getElementById('msg');
if (parent.document.body.clientWidth < 1154) { //(topWin.innerWidth < 1280) {
  vis.classList.add('show');
}
*/

const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    if (entry.contentRect) {
      // Checking for chrome as using a non-standard array      
      let width = entry.contentRect.width;
      console.log('Got width: ',width);
      if (width > 1280) {
      vis.classList.add('show');
      num.innerHTML =  entry.contentRect.width + (1280-1154);
    }      
  }
  console.log("Size changed",entry);
});

resizeObserver.observe(parent.document.body);
