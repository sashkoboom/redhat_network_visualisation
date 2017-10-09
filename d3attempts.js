/**
 * Created by sashkoboom on 30. 5. 2017.
 */
/*
var vis = d3.select("#graph")
    .append("svg");
var w = 900,
    h = 400;
var widthRect = 50,
    heightRect = 50;
vis.attr("width", w)
    .attr("height", h);
vis.text("The Graph")
    .select("#graph")


var interfaces = [
     {
         x: 30, y: 50,
        "addresses": [

        ],
        "driver": "i40e",
        "id": "//em1"
        "info": {

        },
        "mac": "f8:bc:12:0f:56:c0",
        "mtu": 1500,
        "name": "em1",
        "namespace": "/",
        "state": "up",
        "type": "device"
    },
     {
         x: 80, y: 90,
        "addresses": [

        ],
        "driver": "i40e",
        "id": "//em2",
        "info": {

        },
        "mac": "f8:bc:12:0f:56:c2",
        "mtu": 1500,
        "name": "em2",
        "namespace": "/",
        "state": "up",
        "type": "device"
    },
    {
        x: 50, y: 80,
        "addresses": [
            {
                "address": "10.19.17.80/24",
                "family": "INET"
            },
            {
                "address": "2620:52:0:1311:fabc:12ff:fe0f:56e0/64",
                "family": "INET6"
            },
            {
                "address": "fe80::fabc:12ff:fe0f:56e0/64",
                "family": "INET6"
            }
        ],
        "driver": "igb",
        "id": "//em3",
        "info": {

        },
        "mac": "f8:bc:12:0f:56:e0",
        "mtu": 1500,
        "name": "em3",
        "namespace": "/",
        "state": "up",
        "type": "device"
    }

]


*/
/*-----line intersection-----
function checkLineIntersection(line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
    // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
    var denominator, a, b, numerator1, numerator2, result = {
        x: null,
        y: null,
        onLine1: false,
        onLine2: false
    };
    denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
    if (denominator == 0) {
        return result;
    }
    a = line1StartY - line2StartY;
    b = line1StartX - line2StartX;
    numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
    numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
    a = numerator1 / denominator;
    b = numerator2 / denominator;

    // if we cast these lines infinitely in both directions, they intersect here:
    result.x = line1StartX + (a * (line1EndX - line1StartX));
    result.y = line1StartY + (a * (line1EndY - line1StartY));
    /*
     // it is worth noting that this should be the same as:
     x = line2StartX + (b * (line2EndX - line2StartX));
     y = line2StartX + (b * (line2EndY - line2StartY));
     */
    // if line1 is a segment and line2 is infinite, they intersect if:
    if (a > 0 && a < 1) {
        result.onLine1 = true;
    }
    // if line2 is a segment and line1 is infinite, they intersect if:
    if (b > 0 && b < 1) {
        result.onLine2 = true;
    }
    // if line1 and line2 are segments, they intersect if both of the above are true
    return result;
};
/*--------------------------



/* ------------arrow head-----------------

vis.append("svg:defs").selectAll("marker")
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

---------

var links = [
    {source: interfaces[0], target: interfaces[1]},
    {source: interfaces[2], target: interfaces[1]}
]

var node = vis.selectAll("g .nodes")
    .data(interfaces)
    .enter()
    .append("svg:g")
    .attr("class", "nodes");

node.append("svg:rect")
    .attr("x", function(d) { return d.x; })
    .attr("y", function(d) { return d.y; })
    .attr("width", widthRect)
    .attr("height", heightRect)
    .attr("stroke", "black")
    .attr("fill", "salmon");

node.append("svg:text")
    .text(function (d) {
        return d.id;
    })
    .attr("x", function(d) { return d.x + 5; })
    .attr("y", function(d) { return d.y + 10; })
    .style("font-size", "12")
    .style("fill", "black");

var link = vis.selectAll(".line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", function(d) { return d.source.x })
    .attr("y1", function(d) { return d.source.y })
    .attr("x2", function(d) { return d.target.x })
    .attr("y2", function(d) { return d.target.y })
    .attr("marker-end", "url(#end)")
    .style("stroke", "rgb(6,120,155)");



 -------------force--------------------

var force = d3.forceSimulation(interfaces)
    .force("link", d3.forceLink(links).distance(70))
    .force("collide", d3.forceCollide(1))
    .force("charge", d3.forceManyBody().strength(-10));


function closestRectWall(source , target){

    //rectangle
    var result = {
     X1 : 0,
     Y1 : 0,
     X2 : 0,
     Y2 : 0,
        name: "",
    };

    //A = √ ((X2-X1)²+(Y2-Y1)²).

    var targetCenter = { x : target.x + widthRect /2, y : target.y + widthRect / 2};

    //calculate length between each wall and target center

function distToTargetCenter(targetCenter , dot){
 console.log(dot, "dot!!");
    console.log(targetCenter, "targetCenter!!");
    return Math.sqrt(Math.pow(targetCenter.x - dot.x, 2) + Math.pow(targetCenter.y - dot.y, 2));

}
    //AB
    var ab = {x : (source.x + widthRect/2), y : source.y }
    var distAB = distToTargetCenter(targetCenter, ab)
    //AC
    var ac = {x : (source.x ), y : source.y + heightRect/2 }
    var distAC = distToTargetCenter(targetCenter, ac);
    //CD
    var cd = {x : (source.x + widthRect/2 ), y : source.y + heightRect }
     var distCD = distToTargetCenter(targetCenter, cd);
    //BD
    var bd = {x : (source.x + widthRect ), y : source.y + heightRect/2 }
    var distBD = distToTargetCenter(targetCenter, cd);

    console.log(distAB, distAC, distCD, distBD);

    var minDist = Math.min(distAB, distAC, distCD, distBD);
console.log(minDist);

    if(minDist==distAB){
        //a
        result.X1 = source.x;
        result.Y1 = source.y;
        //b
        result.X2 = source.x + widthRect;
        result.Y2 = source.y;

        result.name = "ab";
    }else if(minDist==distAC){
        //a
        result.X1 = source.x;
        result.Y1 = source.y;
        //c
        result.X2 = source.x;
        result.Y2 = source.y + heightRect;

        result.name = "ac";

    }else if(minDist == distCD){

        //c
        result.X1 = source.x;
        result.Y1 = source.y + heightRect;
        //d
        result.X2 = source.x + widthRect;
        result.Y2 = source.y + heightRect;

        result.name = "cd";

    }else if(minDist == distBD){
        //b
        result.X1 = source.x + widthRect;
        result.Y1 = source.y;
        //d
        result.X2 = source.x + widthRect;
        result.Y2 = source.y + heightRect;

        result.name = "bd";
    }

    return result;
}


force.on('end', function() {
    node.selectAll("rect")
        .attr('x', function(d) { return Math.max(d.x, 0); })
        .attr('y', function(d) { return  Math.max(d.y, 0); });


    node.selectAll("text")
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; })



    link.attr('x1', function(d) {

       //starts in a nice place X

        //line from center to center
              var center1X = d.source.x + widthRect / 2;
              var center1Y = d.source.y + heightRect / 2;
              var center2X = d.target.x + widthRect / 2;
              var center2Y = d.target.y + heightRect / 2;
        /*
        //choose the closest rect wall


              //rectangle
        var rectLine = closestRectWall(d.source , d.target);
        console.log(rectLine);
       return checkLineIntersection(
            center1X, center1Y, center2X, center2Y,
            rectLine.X1, rectLine.Y1, rectLine.X2, rectLine.Y2
        ).x;
        return center1X;
    })
        .attr('y1', function(d) {

            //line from center to center
            var center1X = d.source.x + widthRect / 2;
            var center1Y = d.source.y + heightRect / 2;
            var center2X = d.target.x + widthRect / 2;
            var center2Y = d.target.y + heightRect / 2;

             //choose the closest rect wall

            var rectLine = closestRectWall(d.source , d.target);
            console.log(rectLine, "rectLine!!!!!!!");
          return checkLineIntersection(
                center1X, center1Y, center2X, center2Y,
                rectLine.X1, rectLine.Y1, rectLine.X2, rectLine.Y2
            ).y;
          return center1Y;

        })
        .attr('x2', function(d) {
            //finishes in a nice place X
            //starts in a nice place X

            //line from center to center
            var center1X = d.source.x + widthRect / 2;
            var center1Y = d.source.y + heightRect / 2;
            var center2X = d.target.x + widthRect / 2;
            var center2Y = d.target.y + heightRect / 2;

            //choose the closest rect wall


            //rectangle
            var rectLine = closestRectWall(d.target , d.source);
            console.log(rectLine);
            /*return checkLineIntersection(
                center1X, center1Y, center2X, center2Y,
                rectLine.X1, rectLine.Y1, rectLine.X2, rectLine.Y2
            ).x;

        .attr('y2', function(d) {
            //finishes in a nice place Y

            //finishes in a nice place X
            //starts in a nice place X

            //line from center to center
            var center1X = d.source.x + widthRect / 2;
            var center1Y = d.source.y + heightRect / 2;
            var center2X = d.target.x + widthRect / 2;
            var center2Y = d.target.y + heightRect / 2;

            //choose the closest rect wall


            //rectangle
            var rectLine = closestRectWall(d.target , d.source);
            console.log(rectLine);
            /*return checkLineIntersection(
                center1X, center1Y, center2X, center2Y,
                rectLine.X1, rectLinm e.Y1, rectLine.X2, rectLine.Y2
            ).y;
            return center2Y;
        });

}
*/