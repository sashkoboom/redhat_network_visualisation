/**
 * Created by sashkoboom on 28. 2. 2017.
 */
var GraphInfo = function() {
    this.json = null;
}

GraphInfo.prototype.init = function (json) {
    this.json = json;
    var arrKeys = Object.keys(json.namespaces);
    var arrVal = Object.values(json.namespaces);
    networkModel.build(arrKeys, arrVal).bind(networkModel);

}



var graphInfo = new GraphInfo();

