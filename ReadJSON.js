/**
 * Created by sashkoboom on 28. 2. 2017.
 */
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    // Loop through the FileList and render image files as thumbnails.
    f = files[0];

    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(f);

    function receivedText(e) {
        lines = e.target.result;
        var newArr = JSON.parse(lines);
        graph.init(newArr).bind(graph);
    }

}

document.getElementById('files').addEventListener('change', handleFileSelect, false);