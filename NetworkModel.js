/**
 * Created by sashkoboom on 28. 2. 2017.
 */
var NetworkModel = function() {
    this.interfaces = [];
    this.levels = [];
    this.branches = [];
    this.links = [];
    this.namespaces = [];
}

NetworkModel.prototype.init = function (json) {
    this.json = json;
    var arrKeys = Object.keys(json.namespaces);
    var arrVal = Object.values(json.namespaces);
    this.build(arrKeys, arrVal).bind(this);
}

NetworkModel.prototype.build = function (keys, values) {

    for(var i =0; i < keys.length; i++){
        var namespace = new NamespaceNode(keys[i]);
        this.namespaces.push(namespace);

    }
    var arr = [];

    for(var i =0; i < values.length; i++){
        arr.push(values[i]);
    }

    for(var i =0; i < arr.length; i++){
        var interfaceArr = Object.values(arr[i].interfaces);
        for(var k =0; k < interfaceArr.length; k++){

            var interface = new InterfaceNode(interfaceArr[k]);
            interface.setNamespace();
            this.interfaces.push(interface);


        }


    }


    this.drawTable();
    this.defineLinks();

    svg.drawGraph(

        this.namespaces,
        this.interfaces,
        this.links
    );

}


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










