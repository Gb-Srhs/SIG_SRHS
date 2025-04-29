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
  const tooltip = layer.getTooltip?.();
  const tooltipContainer = tooltip?._source?._tooltip?._container;

  if (tooltipContainer) {
      const rect = tooltipContainer.getBoundingClientRect();

      const bottomLeft = map.containerPointToLatLng([rect.left, rect.bottom]);
      const topRight = map.containerPointToLatLng([rect.right, rect.top]);

      const boundingBox = {
          bottomLeft : [bottomLeft.lng, bottomLeft.lat],
          topRight   : [topRight.lng, topRight.lat]
      };

      labelEngine.ingestLabel(
          boundingBox,
          id,
          parseInt(Math.random() * (5 - 1) + 1), // Random weight between 1 and 5
          tooltipContainer,
          "Test " + id,
          false
      );

      if (!layer.added) {
          layer.addTo(map);
          layer.added = true;
      }
  }
}
