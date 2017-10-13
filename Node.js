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

}

InterfaceNode.prototype = Object.create(Node.prototype);
InterfaceNode.prototype.constructor = InterfaceNode;

InterfaceNode.prototype.setNamespace = function(){
    this.namespace = this.json.namespace;
}

 function NamespaceNode (id) {
    Node.call(this);
    this.id = id;
    this.classname = "namespace"
}

NamespaceNode.prototype = Object.create(Node.prototype);
NamespaceNode.prototype.constructor =  NamespaceNode;





