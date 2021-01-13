// Drag Drop JS
// By Alexander Burton
// v1.0 (January 12th, 2021)

// Register Functions

// FUNCTION: JavaScript Debounce Function
  // 100% credit to David Walsh
  // https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

// Declare a Mutable Variable for the Element Being Dragged
var draggable = "";

// Drag and Drop Logic:
   // Credit to W3, Thank you for being there for me countless times.
   // https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_ondrag
   // NOTE: This version uses localStorage to bypass the e.dataTransfer issues for now
function dragStart(e, draggable) {
	//e.preventDefault();
  e.target.style.opacity = "0.5";
  e.dataTransfer.setData("text/plain", e.target.id);
	draggable = e.target.id;
	localStorage.setItem("draggable", draggable);
	console.log("-------dragStart()-------", {e: e, id: e.target.id, draggable: draggable});
}

function dragging(e) { console.log("-------dragging()-------", {e: e, target: e.target});
	e.preventDefault();
}

function dragover(e) {
  e.preventDefault();
  !e.target.classList.contains('hovered') ? e.target.classList.add('hovered') : e.target.classList.remove('hovered');
}

function allowDrop(e) { console.log("-------allowDrop()-------", {e: e, target: e.target, text: e.dataTransfer.getData("text")});
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  let et = e.target;
  let data = e.dataTransfer.getData("text");
	let localData = localStorage.getItem("draggable");
	let node = document.getElementById(localData);
	console.log("-------drop()-------", {e: e, data: data, node: node, draggable: draggable, localData: localData});
	et.setAttribute('style', '');
	node.setAttribute('style', '');
  et.appendChild(node);
  e.dataTransfer.clearData();
	localStorage.removeItem("draggable");
}

function initDragDrop(bed_selector, node_selector, bed_wrap_selector) {
  let bedwraps = document.querySelectorAll('.'+bed_wrap_selector);
  let beds = document.querySelectorAll('.'+bed_selector);
  let nodes = document.querySelectorAll('.'+node_selector);

  if(beds.length > 0) {
    beds.forEach((bed, i) => {

      bed.addEventListener('dragover', debounce((e) => {
          console.log("-------dragover-------", {e: e});
          dragover(e);
        }, 250), false);

      bed.addEventListener('dragenter', (e) => {
          console.log("-------dragenter-------", {e: e});
          e.target.classList.add('hovered');
        }, false);

      bed.addEventListener('dragleave', debounce((e) => {
          console.log("-------dragleave-------", {e: e});
          e.target.classList.remove('hovered');
        }, 250), false);

      // bed.addEventListener('ondrop', (e) => {
      //     console.log("-------drop-------", {e: e, bed_selector: bed_selector, classList: e.target.classList});
      //     drop(e);
      //   }, false);
			bed.setAttribute('ondrop', 'drop(event, draggable)');
			bed.setAttribute('ondragover', 'allowDrop(event)')
    });
  }
  if(nodes.length > 0) {
    nodes.forEach((node, j) => {
			node.setAttribute('id', Math.floor((Math.random() * 1000000) + 1));
      node.addEventListener('drag', debounce((e) => {
				e.preventDefault();
        console.log("-------drag::dragging()-------", {e: e});
        dragging(e);
      }, 250), false);
      node.addEventListener('dragstart', debounce((e) => {
				e.preventDefault();
        console.log("-------dragstart::dragStart()-------", {e: e});
        dragStart(e, draggable);
      }, 250), false);
      // node.addEventListener('dragend', debounce((e) => {
			// 	e.preventDefault();
      //   //console.log("-------dragend::allowDrop()-------", {e: e});
			// 	console.log({e:e});
      // }, 250), false);
    });
  }
}
