/**
 * Created by sashkoboom on 28. 2. 2017.
 */


//Works with JSON, mainly reformatting it so d3.js can just draw from it
var NetworkModel = function() {

    this.interfaces = [];
    this.links = [];
    this.namespaces = [];
    this.hierarchies = [];

}

NetworkModel.prototype.init = function (json) {
    this.build(Object.keys(json.namespaces), Object.values(json.namespaces));
}

NetworkModel.prototype.build = function (keys, values) {


    //making an array of NamespaceNode objects out of json keys
    for(var i =0; i < keys.length; i++){
        var namespace = new NamespaceNode(keys[i]);
        this.namespaces.push(namespace);
    }


    //making an array of InterfaceNode objects out of json values
    // every i  in value array is an array of interfaces
    for(var i =0; i < values.length; i++){
        var interfaceArr = Object.values(values[i].interfaces);
        //every k is a concrete interface
        for(var k =0; k < interfaceArr.length; k++){
            var interface = new InterfaceNode(interfaceArr[k]);
            interface.setNamespace();
            this.interfaces.push(interface);
        }
    }

    //table for future hints
    this.drawTable();
    //links between nodes
    this.defineLinks();
    this.defineHierarchies();
    this.groupHierarchiesByNamespaces();

    svg.start(
        this.namespaces,
        this.interfaces,
        this.links,
        this.hierarchies
    );

}


NetworkModel.prototype.findInterfaceByID = function(id){
    for(var m =0; m < this.interfaces.length; m++){
        if(this.interfaces[m].json.id == id){
             return this.interfaces[m];
        }
    }

    return null;
}


/*
Defining links (later visible as arrows) between interface nodes
* */
NetworkModel.prototype.defineLinks = function(){


    for(var i=0; i < this.interfaces.length;  i++){

        //if interface has parents then push new connection obj
        if(this.interfaces[i].json.parents){

            var parents = Object.keys(
                this.interfaces[i].json.parents
            );

            //find all the parents and for each push a link
            for(var k = 0; k < parents.length; k++){
                var parentID = parents[k];

                for(var m =0; m < this.interfaces.length; m++){
                    if(this.interfaces[m].json.id == parentID){

                        var connection = {
                            source : this.interfaces[m],
                            target : this.interfaces[i]
                        }

                        this.links.push(connection);
                    }
                }

            }

        }

    }


}


/*
 * Organizes JSON into array of hierarchical trees
 *
 * example:
 * var data = {
 "name": "A1",
 "children": [
       {"name": "B1",
         "children": [{"name": "C1"}, {...}]
         },{....}
               ]
.....}
 * var root = d3.hierarchy(data)
  * */
NetworkModel.prototype.defineHierarchies = function(){

    var newinterfaces = [];

    for (l = 0; l < this.interfaces.length; l++) {
    newinterfaces.push(
        this.interfaces[l]
     );
    newinterfaces[l].children = [];
    }

     //array of d3.hierarchies that lack parents they need to be linked to
    var orphans = [];

    //estimated number of roots/trees (number of nodes with no parents)
    var roots = 0;

    var countingroots = true;


    var findChild = function (id, arr) {
        for(k =0; k < arr.length; k++)
        {if(arr[k].json.id==id)return arr[k]}
        return null;
    }


    //MAIN CYCLE
    do {


        //go though the array of interfaces
        for (i = 0; i < newinterfaces.length; i++) {


            var interface = newinterfaces[i];


            //count roots
            if(!interface.json.parents && countingroots)roots++;
            //finish counting roots after first iteration
            if(i == this.interfaces.length - 1)
                countingroots = false;

            //if the interface is not handeled yet and is an orphan, then work with it
            if (!interface.marked && !orphans.includes(interface)) {

                //no children
                if (!interface.json.children) {

                    if (interface.json.parents) {
                        //a leaf waiting to be linked to its parents
                        orphans.push(interface);
                    } else {
                       //single root with no connections, no further manipulations
                        this.hierarchies.push(interface);
                        interface.marked = true;
                    }
                }
                //has children AND there are children to choose from
                else if (orphans.length > 0) {

                    var children = [];

                    //children val can be an object
                    children = children.concat(Object.keys(interface.json.children));


                    for (n = 0; n < children.length; n++) {
                        //look if the child is in the orphans array
                        var child = findChild(children[n], orphans);
                        if(child){
                            //push to children
                            interface.children.push(child);
                            //delete the linked child from the orphan array
                            var index = orphans.indexOf(child);
                            child.marked = true;
                            orphans.splice(index, 1);
                        }

                    }

                    //is ready and has all its children linked

                    if(interface.children.length == children.length){

                        //is also a leaf waiting to be linked to its parents
                        if (interface.json.parents) {
                            orphans.push(interface);
                        } else {
                            //is a a root
                            this.hierarchies.push(interface);
                            interface.marked = true;
                        }

                    }

                }

            }


        }



     }while(this.hierarchies.length != roots);


    for(g=0; g<this.hierarchies.length; g++)
    {
        this.hierarchies[g] = d3.hierarchy(this.hierarchies[g])
        this.hierarchies[g].data.namespace.roots.push( this.hierarchies[g] )
    }


    console.log(this.hierarchies);
}

//Reorders hierarchies array so it fits with order of namespaces (will be useful for drawing)
NetworkModel.prototype.groupHierarchiesByNamespaces = function () {

    this.hierarchies = [];

    for(i = 0 ; i < this.namespaces.length ; i++){
        this.hierarchies = this.hierarchies.concat(this.namespaces[i].roots)
    }

};


//Drawing simple table for hints straight out of JSON
NetworkModel.prototype.drawTable = function () {

    var table = document.querySelector("#table1");

    var interfacesBuffer = this.interfaces;

    for(var i =0; i < interfacesBuffer.length; i++){
        var interface = interfacesBuffer[i].json;

        var tr = document.createElement("tr");
        var td = document.createElement("td");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");
        var td3 = document.createElement("td");
        var td4 = document.createElement("td");
        td.innerHTML = interface.id;

        if(interface.children) {

            var arr = Object.values(interface.children);
            for (m = 0; m < arr.length; m++) {
                td1.innerHTML += arr[m].target;
                td1.innerHTML+= ", ";
            }
        }

        if(interface.parents) {

            var arr = Object.values(interface.parents);
            for (m = 0; m < arr.length; m++) {
                td2.innerHTML += arr[m].target;
                td2.innerHTML+= ", ";
            }
        }

        if(interface.peer) {


                td3.innerHTML += interface.peer.target;
                td3.innerHTML+= ", ";

        }

        if(interface.namespace) {


            td4.innerHTML += interface.namespace;
            td4.innerHTML+= ", ";

        }
        //td1.innerHTML = "blaaaaaa"
        //td2.innerHTML = "blaaaaaa"
        //td3.innerHTML = "blaaaaaa"
        tr.appendChild(td);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        table.appendChild(tr);

    }
}

//TODO: calculates the widest branch
NetworkModel.prototype.widestBranchOf = function (hiearchy){

    return 1;
}

/* ------------ unused, will probably be helpful later ---------------*/

NetworkModel.prototype.separateToLevels = function (){

    var len = this.interfaces.length;

    while(this.interfaces.length) {

        this.levels.push([]);

        for (var i = 0; i < this.interfaces.length; i++) {

            var interface = this.interfaces[i];
            var parents = interface.json.parents;

            //has no parents? might be a 0 level
            if (!parents) {
               if(this.levels.length==1){
                   this.levels[0].push(interface);
                   this.interfaces.splice(i, 1);
                   i--;
               }
            } else {
                if(this.levels.length > 1){
                    //if it has parents, are they 1 level higher?
                    if(this.hasParentsOnLevel(interface.json, this.levels[this.levels.length - 2])){
                   this.levels[this.levels.length-1].push(interface);
                   this.interfaces.splice(i, 1);
                   i--;
                }
                }
            }

        }

    }


}

NetworkModel.prototype.hasParentsOnLevel = function (interface, level){
    //to through the parents level , everytime take their id and check if object parents has smth with [id]

    for(var i=0; i < level.length; i++){
        var id = level[i].json.id;
        var parents = interface.parents;
        if(parents[id]){return true;}
    }

    return false;
}

NetworkModel.prototype.hasChildrenOnLevel = function (interface, level){
    //to through the parents level , everytime take their id and check if object parents has smth with [id]

    if(!level)return false;

    for(var i=0; i < level.length; i++){
        var id = level[i].id;
        if(!interface.children)return false;
        var children = interface.children;
        if(children[id]){return true;}
    }

    return false;
}

NetworkModel.prototype.separateToBranches = function(){
    var firstLevel = this.levels[0];

    for(i=0; i< firstLevel.length; i++){

        var newBranch = [];

        var interfacePointer = firstLevel[i];
        newBranch.push([interfacePointer]);

        var k = 1;

         while(this.hasChildrenOnLevel(interfacePointer, this.levels[k])){

             var currlevel = this.levels[k];
             k++;
             var children = interfacePointer.children;
             var branchLevel = [];
             for(var l=0; l < currlevel.length; l++){
                 var possibleChild = currlevel[l];
                 var id = currlevel[l].id;
                 if(children[id]){branchLevel.push(possibleChild);}
             }

             newBranch.push(branchLevel);
                 var levelWhereMyPointerIs = newBranch[k - 1];


                 if(interfacePointer == newBranch[0][0]|| levelWhereMyPointerIs.indexOf(interfacePointer) == levelWhereMyPointerIs.length - 1){
                     interfacePointer = branchLevel[0];
                 }else{
                     interfacePointer = levelWhereMyPointerIs[levelWhereMyPointerIs.indexOf(interfacePointer)+1];
                 }
         }
         this.branches.push(newBranch);
    }


}

var networkModel = new NetworkModel();











