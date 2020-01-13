//var slider = document.createElement('div');
//var pageIcons = [];
var root;//=new NavNode(null);
var footer  =document.createElement("footer");
var currentDepth=0;
var currentOpenDepth=0;
var ySwipe=0;
var openPage=document.createElement("div");
var win=document.createElement("div");
var slideTime=200;
var thumbnailWidth=70;
var thumbnailHeight=60;
var gap=7;
var lastEl=[];
var footerY=0;
var drawnContents=new Set([]);
window.onload =
    function () {
        this.win.style.height=window.innerHeight-this.thumbnailHeight+"px";
        this.win.style.width="100%";
        this.win.style.position="absolute";
        this.win.style.overflow="hidden";
        this.win.style.left="0px";
        this.win.style.top="0px";
        this.root = new NavNode(null);
        this.readDocument();
        this.footer.setAttribute("class","slideFooter");
        this.footer.style.top="100%";//window.innerHeight-50+"px";
        this.document.body.appendChild(this.footer);
        this.document.body.appendChild(this.win);
        for (var i = root; i.children[i.childPosition] != null;
            i = i.children[i.childPosition]) {
            this.currentDepth++;
        }
        this.updateSliders();
    }
function updateSliders(minLevelToUpdate=0) {
    //removeChildren(footer);
    var c=footer.firstChild;
    while(c){
        if(c.current.level>=minLevelToUpdate){
            var next=c.nextSibling;
            footer.removeChild(c);
            c=next;
        }else{
            c=c.nextSibling;
        }
    }
    var depth = 0;
    var current=new NavNode();
    current = root;
    for (var i = root; i.children[i.childPosition] != null;
        i = i.children[i.childPosition]) {
        depth++;
        current = i;
    }
    //currentOpenDepth+=depth-currentDepth;
    //footer.style.transitionDuration="0s";
    //footer.z.moveElementWithoutTouch(new Point(0,-currentOpenDepth*thumbnailHeight));
    //SwipeElementItem.moveElement(0,thumbnailWidth*currentOpenDepth,footer);
    currentDepth=depth;
    while (current&&current.level>=minLevelToUpdate) {
        activateNode(current);
        current = current.parent;
    }
    //updateOpenElement();
}
function activateNode(current=new NavNode(), addSwiper=true){
    var toAdd=current.childControlDiv;
    toAdd.current=current;
    if(addSwiper){
        footer.appendChild(toAdd);
    }
    if(toAdd.a){
        //toAdd.a.moveElementWithoutTouch(new Point(-thumbnailWidth*current.childPosition,ySwipe));
        return;
    }
    var a=new SwipeElementItem(toAdd);
    a.calledOutside=false;
    toAdd.a=a;
    
    a.onMoveStart=function(sw){
        sw.lastControlYRest=ySwipe;
    }
    a.onMove=function(sw){
        //initialize aliases
        ySwipe=sw.currentY;
        currentOpenDepth=Math.round(ySwipe/thumbnailHeight);
        if(currentOpenDepth>currentDepth){
            currentOpenDepth=currentDepth;
        }else if(currentOpenDepth<0){
            currentOpenDepth=0;
        }
        var slider=document.createElement("div");
        var contentContainer=document.createElement("div");
        slider=sw.swipeElement;
        var node=new NavNode();
        node=sw.swipeElement.current;
        contentContainer=node.childDiv;

        SwipeElementItem.moveElement(sw.currentX,0,sw.swipeElement);
        SwipeElementItem.moveElement(0,ySwipe,footer);
        var selected=getOpenElement();
        lastEl.forEach(function(el){
            el.style.transform="initial";
        });
        if(selected.childControlDiv.a){
            var pos=-Math.round(selected.childControlDiv.a.currentX/thumbnailWidth);
            lastEl=[];
            for(var i=pos-2;i<pos+3;i++){
                if(isValidIndex(i,selected.children)){
                    var newEl=selected.children[i].thumbnail;
                    var d=Math.abs(i*thumbnailWidth+selected.childControlDiv.a.currentX);
                    newEl.style.transform="scale("+(1.0+1.0/(5+d))+")";
                    lastEl.push(newEl);
                }
            }
        }
        var oldChildPos=node.childPosition;
        var newPos=-Math.round(sw.currentX/thumbnailWidth);
        if(newPos<0){
            newPos=0;
        }else if(newPos>=sw.swipeElement.current.children.length){
            newPos=sw.swipeElement.current.children.length-1;
        }
        node.childPosition=newPos;
        if(oldChildPos!=sw.swipeElement.current.childPosition){
            //draw new children
            updateSliders(sw.swipeElement.current.level+1);
        }/*
        if(node.level<=ySwipe/thumbnailHeight+1&&node.level>=ySwipe/thumbnailHeight){
            var parentControler=node.parent.swipeElement.current;
            parentControler.moveElementWithoutTouch(new Point())
        }*/
        updateElementPositions();

    }.bind(this);
    a.onMoveEnd=function(sw,p){
        var posX=Math.round(-sw.currentX/thumbnailWidth);
        var toAdd=sw.swipeElement;
        var max=toAdd.current.children.length;
        if(posX<0){
            posX=0;
        }else if(posX>=max){
            posX=max-1;
        }
        var posY=Math.round(sw.currentY/thumbnailHeight);
        max=currentDepth;
        if(posY<0){
            posY=0;
        }else if(posY>=max){
            posY=max-1;
        }
        currentOpenDepth=posY;
        var oldTrans=toAdd.style.transitionDuration;
        toAdd.style.transitionDuration="0.0s";
        //sw.moveElementWithoutTouch(new Point(-pos*thumbnailHeight,0));
        toAdd.current.childPosition=posX;
        sw.slideToPoint(new Point(-posX*thumbnailWidth,currentOpenDepth*thumbnailHeight),slideTime);
        footerY=currentOpenDepth*thumbnailHeight;
        toAdd.style.transitionDuration=oldTrans;
        
        //setTimeout(updateSliders,slideTime);
        //updateSliders();
    }.bind(this);
    a.moveElementWithoutTouch(new Point(-thumbnailWidth*current.childPosition,ySwipe));

}
function updateElementPositions(){
    var newElements=getSurroundingElements(getOpenElement());
    drawnContents.forEach((el)=>{if(!newElements.has(el)&&win.contains(el.childDiv)){win.removeChild(el.childDiv)}});
    //newElements.forEach((el)=>{drawnContents.add(el)});
    newElements.forEach((el)=>updateElementPosition(el));
    drawnContents=newElements;
}

function updateElementPosition(el=new NavNode()){
    if(!el.childControlDiv.a){
        activateNode(el,false);
    }
    var swipeX=el.childControlDiv.a.currentX/thumbnailWidth;
    var swipeY=ySwipe/thumbnailHeight;
    var elYPos=el.level;
    var yDif=swipeY-elYPos;
    if(Math.abs(yDif)>1){
        el.children.forEach((el)=>el.content.style.display = "none");
        return;
    }
    el.children.forEach((el)=>{if(!el.content.parent){win.appendChild(el.content)}});
    var leftestPoint=0;
    if(yDif<=0){
        //elements getting smaller
        var zoomFactor=1/el.children.length;
        var scalingFactor=1-(1-zoomFactor)*(-yDif);
        //el.childDiv.style.top=zoomFactor*yDif*win.clientHeight+"px";
        if(el.parent&&el.parent.childControlDiv.a){
            //if not root
            //el.childDiv.style.left=win.clientWidth*(swipeX*(1-1*(-yDif))+(el.positionFromParent+el.parent.childControlDiv.a.currentX/thumbnailWidth))+"px";
            var parZoomFactor=0;  
            if(isValidIndex(el.parent.childPosition,el.parent.children)){
                parZoomFactor=el.parent.children[el.parent.childPosition].children.length;
            }
            if(parZoomFactor==0){
                parZoomFactor=1;
            }
            var parentZoom=1+(parZoomFactor-1)*(yDif+1);
            var parentLeft=(el.parent.childControlDiv.a.currentX/thumbnailWidth+el.positionFromParent)*parentZoom;
            leftestPoint=swipeX*(1+yDif)+parentLeft;
            //el.childDiv.style.left=win.clientWidth*(swipeX*(1+yDif)+parentLeft)+"px";
        }else{
            leftestPoint=swipeX*(1-1*(-yDif));
            //el.childDiv.style.left=win.clientWidth*swipeX*(1-1*(-yDif))+"px";
        }
        if(leftestPoint>1||leftestPoint<-el.children.length*scalingFactor){
            el.children.forEach((a)=>a.content.style.display = "none");
        }else{
            el.children.forEach(function(a){
                var left=leftestPoint+a.positionFromParent*scalingFactor;
                if(left<=1&&left>=-scalingFactor){
                    a.content.style.display = "initial";
                    a.content.style.left=left*win.clientWidth+"px";
                    a.content.style.transform="scale("+scalingFactor+")";
                    a.content.style.top=zoomFactor*yDif*win.clientHeight+"px";
                }else{
                    a.content.style.display="none";
                }
            })
        }
        //el.childDiv.style.transform="scale("+scalingFactor+")";// translateY("+zoomFactor*yDif*win.clientHeight+"px)";
    }else{
        //elements getting bigger
        var zoomFactor=0;
        if(isValidIndex(el.childPosition,el.children)){
            zoomFactor=el.children[el.childPosition].children.length;
        }
        if(zoomFactor==0){
            zoomFactor=1;
        }
        var scalingFactor=1+(zoomFactor-1)*yDif;
        //el.childDiv.style.top=yDif*win.clientHeight+"px";
        if(el.children[el.childPosition]){
            var childrenSwipeControler=el.children[el.childPosition].childControlDiv.a;
            var childLeft=childrenSwipeControler.currentX/thumbnailWidth*(1+yDif-1);
            //el.childDiv.style.left=win.clientWidth*(swipeX*(1+(zoomFactor-1)*yDif))+"px";
            //el.childDiv.style.left=win.clientWidth*(swipeX*scalingFactor+childLeft)+"px";
            leftestPoint=swipeX*scalingFactor+childLeft;
        }else{
            //el.childDiv.style.left=win.clientWidth*swipeX*scalingFactor+"px";
            leftestPoint=swipeX*scalingFactor;
        }
        //el.childDiv.style.transform="scale("+scalingFactor+")";

        if(leftestPoint>1||leftestPoint<-el.children.length*scalingFactor){
            el.children.forEach((a)=>a.content.style.display = "none");
        }else{
            el.children.forEach(function(a){
                var left=leftestPoint+a.positionFromParent*scalingFactor;
                if(left<=1&&left>=-scalingFactor){
                    a.content.style.top=yDif*win.clientHeight+"px";
                    a.content.style.display = "initial";
                    a.content.style.left=left*win.clientWidth+"px";
                    a.content.style.transform="scale("+scalingFactor+")";
                }else{
                    a.content.style.display="none";
                }
            })
        }
    }
}

function updateOpenElement(){
    var current=root;
    for(var i=0;i<currentOpenDepth;i++){
        current=current.children[current.childPosition];
    }
    showNode(current);
}
function readDocument(){
    var newDiv=document.createElement("div");
    var currentWritePoint=root;
    while(document.body.firstElementChild){
        if(document.body.firstElementChild.nodeName.charAt(0)=="H"&&document.body.firstElementChild.nodeName.length==2){
            var parent=root;
            var index=parseInt(document.body.firstElementChild.nodeName.charAt(1))-1;
            for(var i=0;i<index;i++){
                parent=parent.children[parent.children.length-1];
            }
            var thumbnail=document.createElement("div");
            thumbnail.innerHTML=document.body.firstElementChild.innerHTML;
            newDiv=document.createElement("div");
            currentWritePoint=new NavNode(parent,newDiv,thumbnail);
            document.body.removeChild(document.body.firstElementChild);
        }else{
            //parent.childControlDiv.appendChild(this.thumbnail);
            newDiv.appendChild(document.body.firstElementChild);
        }
    }
}
function showNode(n=new NavNode()){
    removeChildren(win);
    n.childDiv.style.left=-window.innerWidth*n.childPosition+"px";
    win.appendChild(n.childDiv);
}
function isValidIndex(index,array){
    return index>=0&&index<array.length;
}
class NavNode {
    constructor(
        parent = new NavNode(null), content = document.createElement('div'),
        thumbnail = document.createElement("div")) {
        this.level = 0;
        this.parent = parent;
        this.childPosition = 0;
        this.content = content;
        content.style.width=window.innerWidth-gap+"px";
        content.style.height=window.innerHeight-thumbnailHeight-gap+"px";
        content.style.backgroundColor="rgb(230,230,230)";
        content.style.overflowY="auto";
        content.style.position="absolute";
        content.style.transformOrigin="0 0";
        this.thumbnail = thumbnail;
        this.children = [];
        this.childDiv=document.createElement("div");
        this.childDiv.style.position="absolute";
        this.childControlDiv=document.createElement("div");
        this.childControlDiv.style.height=thumbnailHeight+"px";
        //this.childControlDiv.style.position="absolute";
        //this.childControlDiv=document.createElement("div");
        this.childControlMoveDiv=document.createElement("div");
        this.positionFromParent=0;
        if (parent) {
            this.positionFromParent=parent.children.length;
            parent.children.push(this);

            this.childControlDiv.style.left=(this.parent.positionFromParent * window.innerWidth) + 'px';
            if(this.thumbnail.style){
                this.thumbnail.style.position = 'absolute';
                this.thumbnail.style.width = thumbnailWidth-gap+'px';
                this.thumbnail.style.height = thumbnailHeight-gap+'px';
                this.thumbnail.style.left = (this.positionFromParent * thumbnailWidth) + 'px';
            }
            this.parent.childControlDiv.appendChild(this.thumbnail);
            this.parent.childControlDiv.style.width=this.parent.children.length*thumbnailWidth+"px";
            this.level = parent.level + 1;
            var color=255-this.level*30;
            thumbnail.style.backgroundColor="rgb("+color+","+color+","+color+")";
            var st=this.content.style;
            st.position="absolute";
            st.left=(window.innerWidth*(parent.children.length-1)+gap/2)+"px";
            //this.parent.childDiv.appendChild(this.content);
            if(parent.parent){
                parent.parent.childControlMoveDiv.appendChild(parent.childControlDiv);
            }
        }
        this.childControlDiv.setAttribute('class', 'slider');
        this.childControlDiv.style.left=(window.innerWidth-thumbnailWidth)/2+"px";
        this.childControlDiv.style.top=-(this.level+1)*thumbnailHeight+"px";
        //this.childControlDiv.style.width=this.children.length*thumbnailHeight+"px";
    }
    updateDiv(){
        this.childDiv.style.left=-window.innerWidth*this.childPosition+"px";
    }
}
function removeChildren(n=document.createElement("div")){
    while (n.childNodes.length > 0) {
        n.removeChild(n.firstChild);
    }
}
function getOpenElement(){
    var el=new NavNode();
    el=root;
    while(el.level<currentOpenDepth){
        el=el.children[el.childPosition];
    }
    return el;
}
function getSurroundingElements(el=new NavNode, maxWay=2){
    if(maxWay<=0){
        return new Set([el]);
    } 
    var newSets=[]; 
    if(el.parent){
        newSets.push(getSurroundingElements(el.parent,maxWay-1));
        if(isValidIndex(el.positionFromParent+1,el.parent.children)){
            var rightChild=el.parent.children[el.positionFromParent+1];
            newSets.push(getSurroundingElements(rightChild,maxWay-1));
        }
        if(isValidIndex(el.positionFromParent-1,el.parent.children)){
            var leftChild=el.parent.children[el.positionFromParent-1];
            newSets.push(getSurroundingElements(leftChild,maxWay-1));
        }
    }
    el.children.forEach((child)=>{newSets.push(getSurroundingElements(child,maxWay-1))});
    var toReturn=new Set([el]);
    for(var set of newSets){
        set.forEach((el)=>toReturn.add(el));
    }
    return toReturn;
}