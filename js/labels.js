var hideLabel = function(label) {
    label.labelObject.style.opacity = 0;
    label.labelObject.style.transition = 'opacity 0s';
};
var showLabel = function(label) {
    label.labelObject.style.opacity = 1;
    label.labelObject.style.transition = 'opacity 1s';
};
labelEngine = new labelgun.default(hideLabel, showLabel);

var id = 0;
var labels = [];
var totalMarkers = 0;

function resetLabels(markers) {
    labelEngine.reset();
    var i = 0;
    for (var j = 0; j < markers.length; j++) {
        markers[j].eachLayer(function(label){
            addLabel(label, ++i);
        });
    }
  labelEngine.update();
}

function addLabel(layer, id) {
    // Verifica se o layer tem um tooltip antes de continuar
    if (layer.getTooltip && layer.getTooltip() && layer.getTooltip()._source && layer.getTooltip()._source._tooltip && layer.getTooltip()._source._tooltip._container) {
        var label = layer.getTooltip()._source._tooltip._container;
        
        if (label) {
            var rect = label.getBoundingClientRect();

            var bottomLeft = map.containerPointToLatLng([rect.left, rect.bottom]);
            var topRight = map.containerPointToLatLng([rect.right, rect.top]);
            var boundingBox = {
                bottomLeft: [bottomLeft.lng, bottomLeft.lat],
                topRight: [topRight.lng, topRight.lat]
            };

            labelEngine.ingestLabel(
                boundingBox,
                id,
                parseInt(Math.random() * (5 - 1) + 1), // Peso
                label,
                "Test " + id,
                false
            );

            if (!layer.added) {
                layer.addTo(map);
                layer.added = true;
            }
        } else {
            console.error("Label is undefined.");
        }
    } else {
        console.error("Tooltip or related properties are undefined for this layer.");
    }
}