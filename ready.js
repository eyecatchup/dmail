var event = new CustomEvent('gmail.ready', { 
	detail: GLOBALS , 
	bubbles: true, 
	cancelable: false 
});
document.dispatchEvent(event);
