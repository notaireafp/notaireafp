// This file is licensed under the MIT License (MIT) available on
// http://opensource.org/licenses/MIT.


function addEvent(a, b, c) {
// Attach event to a DOM node.
// Ex. addEvent(node,'click',function);
return (a.addEventListener) ? a.addEventListener(b, c, false) : (a.attachEvent) ? a.attachEvent('on' + b, c) : false;
}


function removeEvent(a, b, c) {
// Detach event from a DOM node.
// Ex. removeEvent(node,'click',function);
return (a.removeEventListener) ? a.removeEventListener(b, c, false) : (a.detachEvent) ? a.detachEvent('on' + b, c) : false;
}


function cancelEvent(e) {
// Cancel current event.
// Ex. cancelEvent(event);
if (!e) var e = window.event;
(e.preventDefault) ? e.preventDefault() : e.returnValue = false;
}


function getEventTarget(e) {
// Return target DOM node on which the event is triggered.
// Ex. getEventTarget(event);
if (!e) var e = window.event;
return (e.target && e.target.nodeType == 3) ? e.target.parentNode : (e.target) ? e.target : e.srcElement;
}


function getPageYOffset() {
// Return the integer value for the vertical position of the scroll bar.
return window.pageYOffset || document.documentElement.scrollTop;
}


function getPageXOffset() {
// Return the integer value for the horizontal position of the scroll bar.
return window.pageXOffset || document.documentElement.scrollLeft;
}


function getWindowY() {
// Return the integer value for the browser window height.
return window.innerHeight || document.documentElement.clientHeight;
}


function getWindowX() {
// Return the integer value for the browser window width.
return window.innerWidth || document.documentElement.clientWidth;
}


function getLeft(a) {
// Return the integer value of the computed distance between given node and the browser window.
// Ex. getLeft(node);
var b = a.offsetLeft;
while (a.offsetParent) {
	a = a.offsetParent;
	b += a.offsetLeft;
}
return b;
}


function getTop (a) {
// Return the integer value of the computed distance between given node and the browser window.
// Ex. getTop(node);
var b = a.offsetTop;
while (a.offsetParent) {
	a = a.offsetParent;
	b += a.offsetTop;
}
return b;
}


function getWidth(a) {
// Return the integer value of the computed width of a DOM node.
// Ex. getWidth(node);
var w = getStyle(a, 'width');
if (w.indexOf('px') !== -1) return parseInt(w.replace('px', ''));
var p = [getStyle(a, 'padding-top'), getStyle(a, 'padding-right'), getStyle(a, 'padding-bottom'), getStyle(a, 'padding-left')];
for (var i = 0; i < 4; i++) {
	p[i] = (p[i].indexOf('px') !== -1) ? parseInt(p[i]) : 0;
}
return Math.max(0, a.offsetWidth - p[1] - p[3]);
}


function getHeight(a) {
// Return the integer value of the computed height of a DOM node.
// Ex. getHeight(node);
var h = getStyle(a, 'height');
if (h.indexOf('px') !== -1) return parseInt(h.replace('px', ''));
var p = [getStyle(a, 'padding-top'), getStyle(a, 'padding-right'), getStyle(a, 'padding-bottom'), getStyle(a, 'padding-left')];
for (var i = 0; i < 4; i++) {
	p[i] = (p[i].indexOf('px') !== -1) ? parseInt(p[i]) : 0;
}
return Math.max(0, a.offsetHeight - p[0] - p[2]);
}


function addClass(node, data) {
// Add class to node.
var cl = node.className.split(' ');
for (var i = 0, n = cl.length; i < n; i++) {
	if (cl[i] == data) return;
}
cl.push(data);
node.className = cl.join(' ');
}


function removeClass(node, data) {
// Remove class from node.
var ocl = node.className.split(' ');
var ncl = [];
for (var i = 0, n = ocl.length; i < n; i++) {
	if (ocl[i] != data) ncl.push(ocl[i]);
}
node.className = ncl.join(' ');
}


function getStyle(a, b) {
// Return the value of the computed style on a DOM node.
// Ex. getStyle(node,'padding-bottom');
if (window.getComputedStyle) return document.defaultView.getComputedStyle(a, null).getPropertyValue(b);
var n = b.indexOf('-');
if (n !== -1) b = b.substr(0, n) + b.substr(n + 1, 1).toUpperCase() + b.substr(n + 2);
return a.currentStyle[b];
}


function supportsSVG() {
// Return true if the browser supports SVG.
// Ex. if(!supportsSVG()){..apply png fallback..}
// Old FF 3.5 and Safari 3 versions have svg support, but a very poor one
// http://www.w3.org/TR/SVG11/feature#Image Defeat FF 3.5 only
// http://www.w3.org/TR/SVG11/feature#Animation Defeat Saf 3 but also returns false in IE9
// http://www.w3.org/TR/SVG11/feature#BasicGraphicsAttribute Defeat Saf 3 but also returns false in Chrome and safari4
// http://www.w3.org/TR/SVG11/feature#Text Defeat Saf 3 but also returns false in FF and safari4
if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) return false;
if (!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1")) return false;
if (!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicGraphicsAttribute", "1.1") && !document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Animation", "1.1") && !document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Text", "1.1")) return false;
return true;
}


function fallbackSVG() {
// Replace all images extensions from .svg to .png if browser doesn't support SVG files.
if (supportsSVG()) return;
for (var i = 0, nd = document.getElementsByTagName('*'), n = nd.length; i < n; i++) {
	if (nd[i].nodeName == 'IMG' && /.*\.svg$/.test(nd[i].src)) nd[i].src = nd[i].src.slice(0, -3) + 'png';
	if (/\.svg/.test(getStyle(nd[i], 'background-image'))) nd[i].style.backgroundImage = getStyle(nd[i], 'background-image').replace('.svg', '.png');
	if (/\.svg/.test(getStyle(nd[i], 'background'))) nd[i].style.background = getStyle(nd[i], 'background').replace('.svg', '.png');
}
}


function updateToc() {
// Update table of content active entry and browser url on scroll.
var pageoffset;
var windowy;
var toc;
var bgtoc;
var bgtop;
var first;
var last;
var closer;
var init = function() {
	setenv();
	updatetoc();
}
// Set variables.
var setenv = function() {
	pageoffset = getPageYOffset();
	windowy = getWindowY();
	toc = document.getElementById('menu');
	bgtoc = document.getElementById('menu_background');
	if (bgtoc.getAttribute('data-top') === '' || bgtoc.getAttribute('data-top') === null) bgtoc.setAttribute('data-top', getTop(bgtoc));
	bgtop = bgtoc.getAttribute('data-top');
	fallback = document.getElementsByTagName('H2')[0];
	first = [fallback, getTop(fallback)];
	last = [fallback, getTop(fallback)];
	closer = [fallback, getTop(fallback)];
	// Find all titles in toc.
	var nodes = [];
	var tags = ['H1', 'H2', 'H3', 'H4', 'H5'];
	for (var i = 0, n = tags.length; i < n; i++) {
		for (var ii = 0, t = document.getElementsByTagName(tags[i]), nn = t.length; ii < nn; ii++) {
			if (t[ii].className.indexOf('no_toc')!==-1) continue;
			nodes.push(t[ii]);
		}
	}
	// Find first title, last title and closer title.
	for (var i = 0, n = nodes.length; i < n; i++) {
		if (!nodes[i].id) continue;
		var top = getTop(nodes[i]);
		if (top < first[1]) first = [nodes[i], top];
		if (top > last[1]) last = [nodes[i], top];
		if (top < pageoffset + 10 && top > closer[1]) closer = [nodes[i], top];
	}
	// Set closer title to first or last title if at the top or bottom of the page.
	if (pageoffset < first[1]) closer = [first[0], first[1]];
	if (windowy + pageoffset >= getHeight(document.body)) closer = [last[0], last[1]];
	// Pin menu before it gets hidden.
	if (pageoffset >= bgtop && bgtoc.className.indexOf('menu_fixed') === -1) addClass(bgtoc, 'menu_fixed')
	if (pageoffset < bgtop && bgtoc.className.indexOf('menu_fixed') !== -1) removeClass(bgtoc, 'menu_fixed');
}
// Update toc position and set active toc entry.
var updatetoc = function() {
	if (pageoffset == 0) return;
	// Remove .active class from toc and find new active toc entry.
	var a = false;
	for (var i = 0, t = toc.getElementsByTagName('*'), n = t.length; i < n; i++) {
		removeClass(t[i], 'active');
		if (t[i].nodeName == 'A' && t[i].getAttribute('href') == '#' + closer[0].id) a = t[i];
	}
	if (a === false) return;
	// Set .active class on new active toc entry.
	var nd = a;
	while (nd.parentNode.nodeName == 'LI' || nd.parentNode.nodeName == 'UL') {
		addClass(nd, 'active');
		nd = nd.parentNode;
	}
}
// Update the toc when the page stops scrolling.
var evtimeout = function() {
	toc = document.getElementById('menu');
	clearTimeout(toc.getAttribute('data-timeout'));
	toc.setAttribute('data-timeout', setTimeout(init, 1));
}
addEvent(window, 'scroll', evtimeout);
init();
}


function editableOnClick() {
// An easter egg that makes the page editable when user click on the page and hold their mouse button for one second.
// This trick allows translators and writers to preview their work.
var makeEditable=function(e){
if (!e) var e = window.event;
switch (e.type) {
	case 'mousedown':
		if ((e.which && e.which == 3) || (e.button && e.button == 2)) return;
		var t = getEventTarget(e);
		while (t.parentNode) {
			if (getStyle(t, 'overflow') == 'auto' || getStyle(t, 'overflow-y') == 'auto' || getStyle(t, 'overflow-x') == 'auto') return;
			t = t.parentNode;
		}
		addEvent(document.body, 'mouseup', makeEditable);
		addEvent(document.body, 'mousemove', makeEditable);
		document.body.setAttribute('timeoutEdit', setTimeout(function() {
			removeEvent(document.body, 'mouseup', makeEditable);
			removeEvent(document.body, 'mousemove', makeEditable);
			var c = document.getElementById('content');
			var cc = document.getElementsByClassName('services')[0];
			c.contentEditable = true;
			cc.contentEditable = true;
			c.style.backgroundColor = '#c0c0c0';
			cc.style.backgroundColor = '#c0c0c0';
			setTimeout(function() {
				c.style.backgroundColor = '';
				cc.style.backgroundColor = '';
			}, 200);
		}, 1000));
		break;
	case 'mouseup':
	case 'mousemove':
		removeEvent(document.body, 'mouseup', makeEditable);
		removeEvent(document.body, 'mousemove', makeEditable);
		clearTimeout(document.body.getAttribute('timeoutEdit'));
		break;
}
}
addEvent(document.body, 'mousedown', makeEditable);
}

function allowScroll(e) {
// Allow mouse events for Google Maps on mouse click.
var t = getEventTarget(e);
removeClass(t.getElementsByTagName('iframe')[0], 'scrolloff');
}
