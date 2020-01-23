//var slider = document.createElement('div');
//var pageIcons = [];
var root;//=new NavNode(null);
var footer  =document.createElement("footer");
var currentDepth=0;
var currentOpenDepth=0;
var ySwipe=0;
var openPage=document.createElement("div");
var win=document.createElement("div");
var upButton=document.createElement("div");
var slideTime=300;
var distaneWithoutScaling=1/10;
var winHeight=0;
var winWidth=0;
var thumbnailWidth=70;
var thumbnailHeight=60;
var gap=7;
var lastEl=[];
var footerY=0;
var drawnContents=new Set([]);

function loadChildren(parent = new NavNode()) {
  if(parent.childrenLoaded){
    return;
  }
  var path = '/';
  for (var i = parent; i.parent; i = i.parent) {
    path = '/' + i.positionFromParent + path;
  }
  path = 'content' + path;
  for (var i = 0; i < parent.numOfChildren; i++) {
    var newNode=new NavNode(parent);
    var req = createCORSRequest('GET', path+i+"/content.html");
    newNode.req=req;
    newNode.req.onreadystatechange =
        function(ev) {
      if (this.req.readyState == 4 && this.req.status == 200) {
        var tmp=document.createElement("div");
        tmp.innerHTML = this.req.responseText;
        this.numOfChildren=tmp.firstElementChild.getAttribute("numOfChildren");
        this.thumbnail.appendChild(tmp.firstElementChild);     
        this.content.appendChild(tmp.firstElementChild);
      }
    }.bind(newNode);
    req.send();
  }
  parent.childrenLoaded=true;
}



// document.body.appendChild(iframeContainer);
function loadWebsite(url = '', container = document.createElement('div')) {
  var req = createCORSRequest('GET', url);
  req.onreadystatechange =
      function(ev) {
    if (req.readyState == 4 && req.status == 200) {
      container.innerHTML = req.responseText;
      document.body.appendChild(container);
    }
  }
  // req.setRequestHeader("Content-Type", "application/json;
  // charset=UTF-8");
  req.send();
  return container;
}



function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ('withCredentials' in xhr) {
    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != 'undefined') {
    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS
    // requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {
    // Otherwise, CORS is not supported by the browser.
    xhr = null;
  }
  return xhr;
}
