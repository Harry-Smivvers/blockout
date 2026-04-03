'use strict';
// layers.js — Layer fill indicator (20 rows, left side)
// Matches reference behaviour: any layer with ≥1 occupied cell shows a
// full-width bar in the layer's own LAYER_COLORS color.
// Visual order: label 20 at top (gy=0, spawn), label 1 at bottom (gy=19, floor).

(function () {

  var rows = [];  // cached DOM row references

  function buildIndicator() {
    var container = document.getElementById('layer-indicator');
    if (!container) return;
    container.innerHTML = '';
    rows = [];

    for (var i = 0; i < 20; i++) {
      var row = document.createElement('div');
      row.className = 'layer-row';

      var num = document.createElement('span');
      num.className = 'layer-num';
      // i=0 → gy=0 (spawn, top)  → label 20
      // i=19 → gy=19 (floor, bottom) → label 1
      num.textContent = String(20 - i);

      var wrap = document.createElement('div');
      wrap.className = 'layer-bar-wrap';

      var bar = document.createElement('div');
      bar.className = 'layer-bar';
      bar.style.width = '0%';
      bar.style.background = 'transparent';

      wrap.appendChild(bar);
      row.appendChild(num);
      row.appendChild(wrap);
      container.appendChild(row);

      rows.push({ row: row, bar: bar });
    }
  }

  // layerArray[i]  = fill count (0–25) for gy=i
  // currentLayer   = piece.gy (-1 if no piece)
  // layerColors[i] = CSS hex color string matching LAYER_COLORS[i] from the game engine
  function update(layerArray, currentLayer, layerColors) {
    if (!rows.length) buildIndicator();

    for (var i = 0; i < 20; i++) {
      var ref = rows[i];
      if (!ref) continue;

      var occupied = (layerArray[i] || 0) > 0;
      var color    = (layerColors && layerColors[i]) ? layerColors[i] : null;

      // Full-width bar whenever any cell in the layer is occupied (matches reference).
      // Transparent when the layer is completely empty.
      ref.bar.style.width      = occupied ? '100%' : '0%';
      ref.bar.style.background = (occupied && color) ? color : 'transparent';
      ref.bar.classList.toggle('full', (layerArray[i] || 0) >= 25);
      ref.row.classList.toggle('current-layer', i === currentLayer);
    }
  }

  // Public API
  window.uiLayers = { update: update };

  document.addEventListener('DOMContentLoaded', buildIndicator);

})();
