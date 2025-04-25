var hideLabel = function(label) {
  if (label && label.style) {
      label.style.opacity = 0;
      label.style.transition = 'opacity 0s';
  }
};

var showLabel = function(label) {
  if (label && label.style) {
      label.style.opacity = 1;
      label.style.transition = 'opacity 1s';
  }
};

// Create label engine
labelEngine = new labelgun.default(hideLabel, showLabel);

function resetLabels(markers) {
  labelEngine.reset();
  var i = 0;
  for (var j = 0; j < markers.length; j++) {
      markers[j].eachLayer(function(layer) {
          addLabelToEngine(layer, ++i);
      });
  }
  labelEngine.update();
}

function addLabelToEngine(layer, id) {
  const tooltip = layer.getTooltip && layer.getTooltip();
  if (!tooltip) return;

  let container = tooltip._container;

  // Try to open the tooltip if the container doesn't exist yet
  if (!container) {
      try {
          layer.openTooltip();
          container = tooltip._container;
      } catch (e) {
          console.warn(`Tooltip missing for layer ID ${id}. Skipping.`);
          return;
      }
  }

  if (!container) {
      console.warn("Still no container for tooltip after openTooltip. Skipping.");
      return;
  }

  const rect = container.getBoundingClientRect();
  const bottomLeft = map.containerPointToLatLng([rect.left, rect.bottom]);
  const topRight = map.containerPointToLatLng([rect.right, rect.top]);

  const boundingBox = {
      bottomLeft: [bottomLeft.lng, bottomLeft.lat],
      topRight: [topRight.lng, topRight.lat]
  };

  labelEngine.ingestLabel(
      boundingBox,
      id,
      Math.floor(Math.random() * 4) + 1, // Random weight 1–4
      container,
      "Label " + id,
      false
  );
}