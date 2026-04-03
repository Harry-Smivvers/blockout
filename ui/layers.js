'use strict';
// layers.js — Layer fill indicator (20 rows)
// Row i represents gy=i. Visual order: gy=0 (spawn) at top, gy=19 (floor) at bottom.
// Labels: 20 at top → 1 at bottom (increasing from bottom to top).
// Bar color matches the LAYER_COLORS of the game field (passed in by the game engine).

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
      // Label 20 at top (i=0, gy=0 spawn), label 1 at bottom (i=19, gy=19 floor)
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
  // currentLayer   = piece.gy index (-1 if no piece)
  // layerColors[i] = CSS hex color string for gy=i (matches game field layer color)
  function update(layerArray, currentLayer, layerColors) {
    if (!rows.length) buildIndicator();

    for (var i = 0; i < 20; i++) {
      var ref = rows[i];
      if (!ref) continue;

      var fill = layerArray[i] || 0;
      var pct  = Math.round((fill / 25) * 100);

      ref.bar.style.width = pct + '%';
      ref.bar.style.background = (fill > 0 && layerColors && layerColors[i])
        ? layerColors[i]
        : 'transparent';
      ref.bar.classList.toggle('full', fill >= 25);
      ref.row.classList.toggle('current-layer', i === currentLayer);
    }
  }

  // Public API
  window.uiLayers = { update: update };

  document.addEventListener('DOMContentLoaded', buildIndicator);

})();
