/**
 * Created by sashkoboom on 18. 4. 2017.
 */
var Tree = function(branch) {
    this.root = null;
    this.buildTree(branch);

}


var Node = function(interface){
    this.parents = [];
    this.children = [];
    this.interface = interface;

}

Tree.prototype.buildTree = function (branch) {

    this.root = new Node(branch[0][0]);


    var currNode = this.root;
    var nextLevel = branch[1];

    while(currNode.interface.children || currNode.interface.parents){
        if(currNode.interface.children){
            //find them in level undermyself
            for(i =0; i<nextLevel.length; i++){
               //is it my child? then add it to my children array

            }

        }

        //same procedure for my parents, 'need to know them!

        //moove to my neighbour node
        //or to the first node in next level
    }


}

