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
      markers[j].eachLayer(function(layer){
          addLabel(layer, ++i);
      });
  }
  labelEngine.update();
}

function addLabel(layer, id) {
  // Verifica se o Tooltip está disponível
  if (layer.getTooltip() && layer.getTooltip()._source && layer.getTooltip()._source._tooltip) {
      var tooltip = layer.getTooltip()._source._tooltip;
      var label = tooltip._container;

      // Certifica-se de que o container do tooltip existe antes de prosseguir
      if (label) {
          // Obtém o retângulo delimitador do próprio rótulo
          var rect = label.getBoundingClientRect();

          // Converte as coordenadas do container (em espaço de tela) para Lat/Lng
          var bottomLeft = map.containerPointToLatLng([rect.left, rect.bottom]);
          var topRight = map.containerPointToLatLng([rect.right, rect.top]);
          var boundingBox = {
              bottomLeft : [bottomLeft.lng, bottomLeft.lat],
              topRight   : [topRight.lng, topRight.lat]
          };

          // Ingesta o rótulo no labelgun
          labelEngine.ingestLabel(
              boundingBox,
              id,
              parseInt(Math.random() * (5 - 1) + 1), // Peso
              label,
              "Test " + id,
              false
          );

          // Verifica se a camada ainda não foi adicionada ao mapa
          if (!layer.added) {
              layer.addTo(map);
              layer.added = true;
          }
      }
  }
}
