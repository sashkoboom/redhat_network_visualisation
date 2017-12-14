/**
 * Created by sashkoboom on 12. 7. 2017.
 */



function Node (){

    this.x = svg.WIDTH / 2 ;
    this.y = svg.HEIGHT / 2;

}

function InterfaceNode (json) {

    Node.call(this);
    this.json = json;
    this.namespace = null;
    this.classname = "interface";
    this.marked = false;
    this.children = [];

}

InterfaceNode.prototype = Object.create(Node.prototype);
InterfaceNode.prototype.constructor = InterfaceNode;

InterfaceNode.prototype.setNamespace = function(){

    var namespaceName = this.json.namespace;

    for(i=0; i< networkModel.namespaces.length; i++){
        if(namespaceName == networkModel.namespaces[i].id)
            this.namespace = networkModel.namespaces[i];
    }

}

var colors = [];

 function NamespaceNode (id) {
    Node.call(this);
    this.id = id;
    this.classname = "namespace"
this.roots = [];
     var color = "hsl(" + Math.random() * 360 + ",100%,80%)";

    while(colors.indexOf(color) != -1){
        color = "hsl(" + Math.random() * 360 + ",100%,80%)";
    }

    colors.push(color);
    this.color = color;

}

NamespaceNode.prototype = Object.create(Node.prototype);
NamespaceNode.prototype.constructor =  NamespaceNode;





