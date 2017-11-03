/**
 * Created by sashkoboom on 14. 3. 2017.
 */
var SVGBuilder = function() {

    this.svgNS = "http://www.w3.org/2000/svg";

    this.forceGraph = null;
    this.treeGraph = null;

    this.namespaces = null;
    this.interfaces = null;
    this.links = null;
    this.hierarchies = null;

        //constants
    this.WIDTH = 1000;
    this.HEIGHT = 600;

    this.INTERFACE_WIDTH = 60;
    this.INTERFACE_HEIGHT = 40;
    this.INTERFACE_FILL = "plum";

    this.NAMESPACE_WIDTH = 300;
    this.NAMESPACE_HEIGHT = 200;
    this.NAMESPACE_FILL = "PaleTurquoise";

    this.RADIUS = 25;

}

SVGBuilder.prototype.start = function(namespaces,   interfaces,   links, hierarchies){

    this.namespaces = namespaces;
    this.interfaces = interfaces;
    this.links = links;
    this.hierarchies = hierarchies;

    this.drawForceSimulationGraph();
    this.drawTreeGraph();

}

SVGBuilder.prototype.drawRect
    = function(nodes, width, height, fill)
{

    var classname = nodes[0].classname;

    return this.forceGraph.selectAll("rect ." + classname)
        .data(nodes)
        .enter()
        .append("svg:rect")
        .attr("class", classname)
        .attr("x", function(d){
            return d.x;
        })
        .attr("y",function(d){
            return d.y;
        } )
        .attr("width", width)
        .attr("height", height)
        .attr("stroke", "black")
        .attr("fill", fill );


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


    var namespaceForce = d3.forceSimulation()
        .force("collide", d3.forceCollide(Math.max(this.NAMESPACE_HEIGHT, this.NAMESPACE_WIDTH)))


    var interfaceForce = d3.forceSimulation()
        .force("collide", d3.forceCollide(Math.max(this.INTERFACE_HEIGHT, this.INTERFACE_WIDTH)))
        .force("link",
            d3.forceLink()
                .strength(1)
                .iterations(2))
        .force("x",  d3.forceX(this.WIDTH/2).strength(0.1))
        .force("y",  d3.forceY(this.HEIGHT/2).strength(0.1))


    var namespaceNodes = this.drawRect(
        this.namespaces, this.NAMESPACE_WIDTH, this.NAMESPACE_HEIGHT, this.NAMESPACE_FILL
    );

    var interfaceNodes = this.drawRect(
        this.interfaces, this.INTERFACE_WIDTH, this.INTERFACE_HEIGHT, this.INTERFACE_FILL
    );

    var lines = this.forceGraph.selectAll(".line")
        .data(this.links)
        .enter()
        .append("line")
        .attr("x1", function(d) {
            return d.source.x })
        .attr("y1", function(d) { return d.source.y })
        .attr("x2", function(d) { return d.target.x })
        .attr("y2", function(d) { return d.target.y })
        .attr("marker-end", "url(#end)")
        .style("stroke", "rgb(6,120,155)");




    var titles = this.forceGraph.selectAll("text .text")
        .data(this.interfaces)
        .enter()
        .append("svg:text")
        .attr("class", "text")
        .attr("x", function(d){
            return d.x + 5;
        })
        .attr("y", function(d){
            return d.y + svg.INTERFACE_HEIGHT/2 - 5;
        })
        .attr("width", 90)
        .attr("height", this.INTERFACE_HEIGHT)
        .attr("fill", "black")
        .attr("font-family", "Ariel Black")
        .attr("font-size", 12)
        .text(function (d){
            return d.json.id;
        });




    var ticking = function() {

        interfaceNodes
            .attr('x', function(d){
                if(d.x < 0) d.x = 0;

                if(d.x >=  svg.WIDTH - svg.INTERFACE_WIDTH) d.x = svg.WIDTH - svg.INTERFACE_WIDTH ;

                return d.x ;
            })
            .attr('y', function(d){
                if(d.y < 0) d.y = 0;

                if(d.y >= svg.HEIGHT - svg.INTERFACE_HEIGHT){  d.y = svg.HEIGHT - svg.INTERFACE_HEIGHT ;}

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
                if(d.x < 0) d.x = 0;
                if(d.x >=  svg.WIDTH - svg.NAMESPACE_WIDTH) d.x = svg.WIDTH - svg.NAMESPACE_WIDTH ;
                return d.x ;
            })
            .attr('y', function(d){
                //constrains for Y position (so the node doesn't leave the screen)
                if(d.y < 0) d.y = 0;
                if(d.y >= svg.HEIGHT - svg.NAMESPACE_HEIGHT){  d.y = svg.HEIGHT - svg.NAMESPACE_HEIGHT ;}
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
        .style("background", "LavenderBlush ");


    var treeLayout = d3.tree();
        treeLayout.size([this.WIDTH, this.HEIGHT]);
        treeLayout(this.hierarchies[6]);

    this.treeGraph
        .selectAll('circle.node')
        .data(this.hierarchies[6].descendants())
        .enter()
        .append('circle')
        .classed('node', true)
        .attr('cx', function(d) {return d.x;})
        .attr('cy', function(d) {return d.y;})
        .attr('r', this.RADIUS);

// Links
    this.treeGraph
        .selectAll('line.link')
        .data(this.hierarchies[6].links())
        .enter()
        .append('line')
        .classed('link', true)
        .attr('x1', function(d) {return d.source.x;})
        .attr('y1', function(d) {return d.source.y;})
        .attr('x2', function(d) {return d.target.x;})
        .attr('y2', function(d) {return d.target.y;})
        .style("stroke", "rgb(6,120,155)");

alert("ochochcohchc");

}



var svg = new SVGBuilder();


