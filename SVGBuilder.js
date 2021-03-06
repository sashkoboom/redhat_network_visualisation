/**
 * Created by sashkoboom on 14. 3. 2017.
 */
var SVGBuilder = function() {

    this.svgNS = "http://www.w3.org/2000/svg";

    //graphs
    this.forceGraph = null;
    this.treeGraph = null;
    this.horizontalGraph = null;

    //data
    this.namespaces = null;
    this.interfaces = null;
    this.links = null;
    this.hierarchies = null;

    //graphic elements
    this.svgInterfaces = {
        rect : null,
        text : null,
        lines : null
    };
    this.svgNamespaces = {
        rect : [],
        text : []

    };

    // changeable constants
    this.WIDTH = 1000;
    this.HEIGHT = 600;

    this.INTERFACE_WIDTH = 50;
    this.INTERFACE_HEIGHT = 40;
    this.INTERFACE_FILL = "plum";

    this.NAMESPACE_WIDTH = 300;
    this.NAMESPACE_HEIGHT = 200;
    this.NAMESPACE_FILL = "PaleTurquoise";

    this.RADIUS = 5;

}

SVGBuilder.prototype.start = function(namespaces,   interfaces,   links, hierarchies){

    this.namespaces = namespaces;
    this.interfaces = interfaces;
    this.links = links;
    this.hierarchies = hierarchies;

 //   this.drawForceSimulationGraph();
    this.drawHorizontalTreeGraph();
  //  this.rearrangeHorizontalTreeGraph();
    this.addDragBehaviour();
}


SVGBuilder.prototype.drawRect
    = function(graph, nodes, width, height, fill, shiftX, classPadding)
{

    if(shiftX == undefined)
        shiftX = 0;

    if(classPadding == undefined)
        classPadding = '';

    var classname = nodes[0].classname + classPadding;

    return graph.selectAll("rect ." + classname)
        .data(nodes)
        .enter()
        .append("svg:rect")
        .attr("class", classname)
        .attr("x", function(d){
            return d.x + shiftX;
        })
        .attr("y",function(d){
            return d.y;
        } )
        .attr("width", width)
        .attr("height", height)
        .attr("stroke", "black")
        .attr("fill", fill );


}

SVGBuilder.prototype.drawLinks =
    function(graph, data, shiftX, classPadding )
    {

        if(shiftX == undefined)
            shiftX = 0;

        if(classPadding == undefined)
            classPadding = '';

        return graph.selectAll(".line")
            .data(data)
            .enter()
            .append("line")
            .attr("x1", function(d) {
                return d.source.x + shiftX })
            .attr("y1", function(d) { return d.source.y })
            .attr("x2", function(d) { return d.target.x + shiftX })
            .attr("y2", function(d) { return d.target.y })
            .attr("marker-end", "url(#end)")
            .style("stroke", "rgb(6,120,155)");
    }

SVGBuilder.prototype.drawText =
    function(graph, data, textFunction, shiftX, classPadding )
    {

        if(shiftX == undefined)
            shiftX = 0;

        if(classPadding == undefined)
            classPadding = '';

        return graph.selectAll("text .text" + classPadding)
            .data(data)
            .enter()
            .append("svg:text")
            .attr("class", "text")
            .attr("x", function(d){
                return d.x + 5 + shiftX;
            })
            .attr("y", function(d){
                return d.y + svg.INTERFACE_HEIGHT/2 - 5;
            })
            .attr("width", 90)
            .attr("height", this.INTERFACE_HEIGHT)
            .attr("fill", "black")
            .attr("font-family", "Ariel Black")
            .attr("font-size", 12)
            .text(textFunction);

    }



//Draws a chaotic graph using d3.forceSimulation
SVGBuilder.prototype.drawForceSimulationGraph = function(){


    this.forceGraph = d3.select("#forcegraph")
        .append("svg")
        .attr("width", this.WIDTH)
        .attr("height", this.HEIGHT)
        .style("background", "azure");


    /* ------------arrow head-----------------*/
    this.forceGraph.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", 0.5)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");
    /*---------*/


    function box(){
        for (var i = 0, n = svg.namespaces.length; i < n; ++i) {
            curr = svg.namespaces[i];

            curr.x = Math.max(0, Math.min(svg.WIDTH - svg.NAMESPACE_WIDTH, curr.x));
            curr.y = Math.max(0, Math.min(svg.HEIGHT - svg.NAMESPACE_HEIGHT, curr.y));

        }
    }

    var namespaceForce = d3.forceSimulation()
        .force("collide", d3.forceCollide(200))
        .force('center', d3.forceManyBody())
        .force("borders", box);


    //Bounds the node inside the box of its namespace
    function forceNS() {
        for (var i = 0, n = svg.interfaces.length; i < n; ++i) {
            curr = svg.interfaces[i];
           /*get the position of *my* namespace */

            var x1NS = curr.namespace.x;
            var y1NS = curr.namespace.y;
            var x2NS = curr.namespace.x + svg.NAMESPACE_WIDTH;
            var y2NS = curr.namespace.y + svg.NAMESPACE_WIDTH;


            curr.x = Math.max(x1NS, Math.min(x2NS - svg.INTERFACE_WIDTH, curr.x));
            curr.y = Math.max(y1NS, Math.min(y2NS - svg.INTERFACE_HEIGHT, curr.y));

        }
    }


            var interfaceForce =
        d3.forceSimulation()
            .force("collide", d3.forceCollide(30))
            .force("namespace_force", forceNS)



    var namespaceNodes = this.drawRect(
        this.forceGraph, this.namespaces, this.NAMESPACE_WIDTH, this.NAMESPACE_HEIGHT, this.NAMESPACE_FILL
    );

    var interfaceNodes = this.drawRect(
        this.forceGraph, this.interfaces, this.INTERFACE_WIDTH, this.INTERFACE_HEIGHT, this.INTERFACE_FILL
    );

    var lines = this.drawLinks(this.forceGraph, this.links);

    var titles = this.drawText(
        this.forceGraph, this.interfaces,
        function (d){
        return d.json.id;
    });

    var ticking = function() {

        interfaceNodes
            .attr('x', function(d){

                return d.x ;
            })
            .attr('y', function(d){

                return d.y ;
            });

        titles
            .attr('x', function(d){ return d.x + 5 })
            .attr('y', function(d){ return d.y + svg.INTERFACE_HEIGHT/2 - 5 });

        lines
            .attr("x1", function (d) {
                if(d.source.x >= this.WIDTH - this.INTERFACE_WIDTH) d.source.x = this.WIDTH - this.INTERFACE_WIDTH ;
                return d.source.x;
            })
            .attr("y1", function (d) {
                if(d.source.y >= this.HEIGHT - this.INTERFACE_HEIGHT){  d.source.y = this.HEIGHT - this.INTERFACE_HEIGHT ;}
                return d.source.y;
            })
            .attr("x2", function (d) {
                if(d.target.x >= this.WIDTH - this.INTERFACE_WIDTH) d.target.x = this.WIDTH - this.INTERFACE_WIDTH ;
                return d.target.x;
            })
            .attr("y2", function (d) {
                if(d.target.y >= this.WIDTH - this.INTERFACE_WIDTH) d.target.y = this.HEIGHT - this.INTERFACE_HEIGHT ;
                return d.target.y;
            })


    }

    var tick = function(){

        namespaceNodes
            .attr('x', function(d){
                //constrains for X position (so the node doesn't leave the screen)
                return d.x ;
            })
            .attr('y', function(d){
                //constrains for Y position (so the node doesn't leave the screen)
                return d.y ;
            });
    }


    interfaceForce
        .nodes(this.interfaces)
        .on('tick', ticking);

    namespaceForce
        .nodes(this.namespaces)
        .on("tick", tick);


}


//Draws less chaotic graph using d3.hierarchy and d3.tree
SVGBuilder.prototype.drawTreeGraph = function() {

    this.treeGraph = d3.select("#treegraph")
        .append("svg")
        .attr("width", this.WIDTH)
        .attr("height", this.HEIGHT)
        .style("background", "LavenderBlush");

    this.trees = [];

    var width = this.WIDTH / this.hierarchies.length;
 for( var i = 0; i < this.hierarchies.length; i++)
 {
    var treeLayout = d3.tree();
    this.trees.push(treeLayout);
    treeLayout.size([width , this.HEIGHT - 30]);
    treeLayout(this.hierarchies[i]);

    this.drawRect(
        this.treeGraph,
        this.hierarchies[i].descendants(),
        this.INTERFACE_WIDTH, this.INTERFACE_HEIGHT,
        this.INTERFACE_FILL,
        width *i,
        i);


    this.treeGraph
        .selectAll('circle.node' + i)
        .data(this.hierarchies[i].descendants())
        .enter()
        .append('circle')
        .classed('node' + i, true)
        .attr('cx', function (d) {
            return d.x + width*i ;
        })
        .attr('cy', function (d) {
            return d.y  ;
        })
        .attr('r', this.RADIUS );

// Links

this.drawLinks(this.treeGraph, this.hierarchies[i].links(), width*i, i );


this.drawText(
    this.treeGraph,
    this.hierarchies[i].descendants(),
    function(d){
        return d.data.json.id;
    },
    width*i,
    i)

}

}


SVGBuilder.prototype.drawHorizontalTreeGraph = function() {



    this.horizontalGraph = d3.select("#vertical")
        .append("svg")
        .attr("width", this.WIDTH)
        .attr("height", 1200)
        .style("background", "LightCyan ");

    this.drawNamespaceses();

    for( var i = 0; i < this.hierarchies.length; i++)
    {
        this.drawHorizontalTree(this.hierarchies[i] , i, i)
    }

    this.svgInterfaces.rect = svg.horizontalGraph.selectAll("rect.movable");
    this.svgInterfaces.text = svg.horizontalGraph.selectAll("text.movable");
    this.svgInterfaces.lines = svg.horizontalGraph.selectAll("line.movable");

}

SVGBuilder.prototype.drawNamespaceses = function(){


    var margin = 25;
    var classPadding = this.namespaces[0].classname;
    var posY = function(d){
        return svg.namespaces.indexOf(d)*(svg.NAMESPACE_HEIGHT + margin)
    }



    this.svgNamespaces.rect = this.horizontalGraph.selectAll("rect." + classPadding)
        .data(this.namespaces)
        .enter()
        .append("svg:rect")
        .attr("class", function (d) {
            return d.classname
        })
        .attr("x", function(d){
            return 10;
        })
        .attr("y",function(d){
            return posY(d)  ;
        } )
        .attr("width", this.WIDTH-20)
        .attr("height", this.NAMESPACE_HEIGHT)
        .attr("stroke", "black")
        .style("fill",function(d) {
            return d.color;
        })

    this.svgNamespaces.text = this.horizontalGraph
        .selectAll("text .text" + classPadding)
        .data(this.namespaces)
        .enter()
        .append("svg:text")
        .attr("class", "text")
        .attr("x", svg.WIDTH - 120)
        .attr("y", function(d){
            return posY(d) + 20 ;
        })
        .attr("width", 90)
        .attr("height", this.INTERFACE_HEIGHT)
        .attr("fill", "black")
        .attr("font-family", "Ariel Black")
        .attr("font-size", 18)
        .text(function (d) {
            return d.id;
        });
}


SVGBuilder.prototype.drawHorizontalTree = function (hierarchy , shiftY, classPadding) {

    var treeLayout = d3.tree();

    //TODO///////////////////////////////////////////
    var treespace =  networkModel.widestBranchOf(hierarchy) * 120;
    ///////////////////////////////////

    treeLayout.size([treespace, this.HEIGHT ]);
    treeLayout(hierarchy);
    console.log(hierarchy);

    var shiftVertical = function () {
        return treespace*shiftY
    }

    var shiftHorizontal = function () {
        return 20;
    }

    //TODO : before drawing, recalculate x and y of each node and store it to d.x, d.y///////////////

    var nodes = hierarchy.descendants();
    var oldX;
    var oldY;
    for( i=0; i < nodes.length ; i++){

        var curr = nodes[i];
        oldX = curr.x;
        oldY = curr.y;
        curr.x = oldY + shiftHorizontal();
        curr.y = oldX + shiftVertical();
    }




    ////////////////////////////////////////////////////////////////////////////////////



    //drawing lines
    var l =
        this.horizontalGraph.selectAll(".line")
            .data(hierarchy.links())
            .enter()
            .append("line")
            .attr("class", "movable")
            .attr("x1", function(d) { return d.source.x })
            .attr("y1", function(d) { return d.source.y + svg.INTERFACE_HEIGHT/2 })
            .attr("x2", function(d) { return d.target.x  })
            .attr("y2", function(d) { return d.target.y + svg.INTERFACE_HEIGHT/2})
            .attr("marker-end", "url(#end)")
            .style("stroke", "rgb(6,120,155)")
    //drawing rectangles
     var rects =  this.horizontalGraph.selectAll("rect.tree" + classPadding)
        .data(nodes)
        .enter()
        .append("svg:rect")
        .attr("class", "tree" + classPadding)
        .attr("class", "movable")
        .attr("x", function(d){
            return d.x;
        })
        .attr("y",function(d){
            return  d.y;
        } )
        .attr("fixed", false)
         .attr('transform', "translate(0,0)")
        .attr("width", this.INTERFACE_WIDTH)
        .attr("height", this.INTERFACE_HEIGHT)
        .attr("stroke", "RebeccaPurple")
         .attr("stroke-width", 5)
        .attr("fill", function (d) {
            return d.data.namespace.color;
        } )

    //drawing text
    var t =
        this.horizontalGraph
        .selectAll("text .text" + classPadding)
        .data(hierarchy.descendants())
        .enter()
        .append("svg:text")
        .attr("class", "text")
        .attr("class", "movable")
        .attr("x", function(d){
            return d.x + 5 ;
        })
        .attr("y", function(d){
            return d.y + svg.INTERFACE_HEIGHT/2 - 5 ;
        })
        .attr("width", 90)
        .attr("height", this.INTERFACE_HEIGHT)
        .attr("fill", "black")
        .attr("font-family", "Ariel Black")
        .attr("font-size", 12)
        .text(function (d) {
            return d.data.json.id;
        })


}

SVGBuilder.prototype.rearrangeHorizontalTreeGraph = function(){

var nodes = svg.horizontalGraph.selectAll("rect.movable");
var lines = svg.horizontalGraph.selectAll("line.movable");
var text = svg.horizontalGraph.selectAll("text.movable");


    function box(){
       nodes
           .attr("x", function(d)
           {
               return d.x;
           })
           .attr("y", function(d)
           {
               return d.y;
           }
           )
    }

    console.log("ok");

    var interfaceForce = d3.forceSimulation().
    force("collide", d3.forceCollide(100));


    var ticking = function() {

        nodes
            .attr('x', function (d) {
                return d.x
                    ;})
            .attr('y', function (d) {
                return d.y
                    ;});

   text
       .attr('x', function(d){ return d.x + 5 })
       .attr('y', function(d){ return d.y + svg.INTERFACE_HEIGHT/2 - 5 });

       lines
            .attr("x1", function (d) {
                   return d.source.x;
            })
            .attr("y1", function (d) {
                 return d.source.y;
            })
            .attr("x2", function (d) {
                 return d.target.x;
            })
            .attr("y2", function (d) {
                 return d.target.y;
            })


    }

    interfaceForce
        .nodes(this.interfaces)
        .on('tick', ticking);


}

SVGBuilder.prototype.addDragBehaviour = function(){

    /*TODO :
    1. on drag start draw dotted rectangle of the same size
    2. on drag make rectangle follow the mouse
    3. when mouse is released, change d.x, d.y to position of the rectangle and redraw the whole graph
        (??? redraw only the affected tree)
     */



    var drag = d3.drag().on("drag", dragmove);

    var n = svg.horizontalGraph.selectAll("rect.movable")
    n.call(drag);
    n.each(function(d){
        d.dragged = false;
    })

    console.log(n);

    var curr_x, curr_y;

    function dragmove(d) {

        console.log(d.x , d3.event.x)
        console.log(d.y , d3.event.y)
   //   console.log(d);



       // d3.select(this).call(set_transform , d.x = d3.event.x , d.y = d3.event.y);
    }

    function set_transform(sel, x, y) {

        console.log(sel);
        console.log(x, curr_x);
        console.log(y, curr_y);

        sel.transition()
            .duration(25)
            .ease(d3.easeLinear)
            .attr('transform', "translate(" + x + "," + y + ")");
    }

}

var svg = new SVGBuilder();


