'use strict';
// controls.js — Game control buttons (rotation, d-pad, drop, special) and controls toggle

(function () {

  // — Helpers —
  function dispatch(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
  }

  function haptic() {
    navigator.vibrate && navigator.vibrate(15);
  }

  // — State —
  var gridActive = false;
  var controlsVisible = false;
  var layoutSide = false;

  // Expose to window.ui
  window.uiControls = {
    setGridActive: function (isActive) {
      gridActive = isActive;
      var btn = document.getElementById('special-grid');
      if (btn) btn.classList.toggle('active', isActive);
    }
  };

  // — Rotation button preview mechanic —
  function makeRotBtn(axis, dir, label) {
    var btn = document.createElement('button');
    btn.className = 'rot-btn glass-btn';
    btn.dataset.axis = axis;
    btn.dataset.dir = String(dir);
    btn.textContent = label;
    var tooltips = {
      x: 'Stein kippt vorne/hinten',
      y: 'Stein kippt seitlich',
      z: 'Stein dreht in der Ebene',
    };
    btn.title = tooltips[axis] || '';

    var previewTimer = null;
    var previewActive = false;

    function cancelPreview() {
      clearTimeout(previewTimer);
      previewTimer = null;
      if (previewActive) {
        dispatch('game:rotate-preview-cancel', {});
        previewActive = false;
      }
      btn.classList.remove('preview-active');
    }

    btn.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      haptic();
      previewActive = false;
      btn.setPointerCapture(e.pointerId);
      previewTimer = setTimeout(function () {
        previewActive = true;
        btn.classList.add('preview-active');
        dispatch('game:rotate-preview-start', { axis: axis, direction: dir });
      }, 150);
    });

    btn.addEventListener('pointerup', function (e) {
      e.preventDefault();
      clearTimeout(previewTimer);
      previewTimer = null;
      if (previewActive) {
        dispatch('game:rotate-preview-end', {});
        previewActive = false;
        btn.classList.remove('preview-active');
      }
      dispatch('game:rotate', { axis: axis, direction: dir });
    });

    btn.addEventListener('pointerleave', function () {
      cancelPreview();
    });

    btn.addEventListener('pointercancel', function () {
      cancelPreview();
    });

    return btn;
  }

  // — Build rotation buttons (2 rows × 3) —
  function buildRotationButtons() {
    var container = document.getElementById('rotation-buttons');
    if (!container) return;

    // Row 1 (CCW, dir = -1): Rx⟲  Ry⟲  Rz⟲
    // Row 2 (CW,  dir =  1): Rx⟳  Ry⟳  Rz⟳
    var defs = [
      { axis: 'x', dir: -1, label: 'Rx\u27f2' },
      { axis: 'y', dir: -1, label: 'Ry\u27f2' },
      { axis: 'z', dir: -1, label: 'Rz\u27f2' },
      { axis: 'x', dir:  1, label: 'Rx\u27f3' },
      { axis: 'y', dir:  1, label: 'Ry\u27f3' },
      { axis: 'z', dir:  1, label: 'Rz\u27f3' },
    ];

    defs.forEach(function (d) {
      container.appendChild(makeRotBtn(d.axis, d.dir, d.label));
    });
  }

  // — Build D-pad (cross layout, 3×3 grid) —
  function buildDpad() {
    var container = document.getElementById('dpad');
    if (!container) return;

    // Grid positions: [gridRow, gridColumn, direction, label]
    var positions = [
      [1, 2, 'up',    '\u2b06'],
      [2, 1, 'left',  '\u2b05'],
      [2, 3, 'right', '\u27a1'],
      [3, 2, 'down',  '\u2b07'],
    ];

    // Fill all 9 cells; non-button cells get a spacer
    for (var row = 1; row <= 3; row++) {
      for (var col = 1; col <= 3; col++) {
        var pos = positions.find(function (p) { return p[0] === row && p[1] === col; });
        if (pos) {
          (function (direction, lbl) {
            var btn = document.createElement('button');
            btn.className = 'dpad-btn glass-btn';
            btn.textContent = lbl;
            btn.style.gridRow = String(row);
            btn.style.gridColumn = String(col);
            btn.addEventListener('pointerdown', function (e) {
              e.preventDefault();
              haptic();
              btn.setPointerCapture(e.pointerId);
              dispatch('game:move', { direction: direction });
            });
            container.appendChild(btn);
          })(pos[2], pos[3]);
        } else {
          var spacer = document.createElement('div');
          spacer.className = 'dpad-empty';
          spacer.style.gridRow = String(row);
          spacer.style.gridColumn = String(col);
          container.appendChild(spacer);
        }
      }
    }
  }

  // — Hard drop button —
  function buildHardDrop() {
    var btn = document.getElementById('btn-hard-drop');
    if (!btn) return;
    btn.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      haptic();
      dispatch('game:hard-drop', {});
    });
  }

  // — Special buttons (UNDO, SKIP, GRID) —
  function buildSpecialButtons() {
    var container = document.getElementById('special-buttons');
    if (!container) return;

    var defs = [
      { id: 'special-undo', label: '\u21a9 UNDO', event: 'game:undo' },
      { id: 'special-skip', label: '\u23ed SKIP', event: 'game:skip' },
      { id: 'special-grid', label: '\u25a6 GRID', event: 'game:toggle-grid', toggle: true },
    ];

    defs.forEach(function (d) {
      var btn = document.createElement('button');
      btn.id = d.id;
      btn.className = 'special-btn';
      btn.textContent = d.label;
      btn.addEventListener('click', function () {
        haptic();
        if (d.toggle) {
          gridActive = !gridActive;
          btn.classList.toggle('active', gridActive);
        }
        dispatch(d.event, {});
      });
      container.appendChild(btn);
    });
  }

  // — Controls toggle —
  function setControlsVisible(visible, silent) {
    controlsVisible = visible;
    var controls = document.getElementById('controls');
    var toggleBtn = document.getElementById('controls-toggle');
    var layoutBtn = document.getElementById('layout-toggle');
    if (controls) controls.classList.toggle('visible', visible);
    if (toggleBtn) {
      toggleBtn.textContent = visible ? '\ud83d\udc41 Controls' : '\ud83d\udc41\u200d\ud83d\udde8 Show Controls';
      toggleBtn.classList.toggle('controls-hidden', !visible);
    }
    if (layoutBtn) layoutBtn.style.display = visible ? '' : 'none';
    if (!silent) {
      dispatch('ui:controls-toggled', { visible: visible });
    }
  }

  function buildControlsToggle() {
    var btn = document.getElementById('controls-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      setControlsVisible(!controlsVisible);
    });
  }

  // — Layout toggle (Bottom ↔ Left/Right) —
  function setLayoutSide(side) {
    layoutSide = side;
    var app = document.getElementById('app');
    var middleRow = document.getElementById('middle-row');
    var layerIndicator = document.getElementById('layer-indicator');
    var gameCanvasContainer = document.getElementById('game-canvas-container');
    var controlsInner = document.getElementById('game-controls-inner');
    var rotBtns = document.getElementById('rotation-buttons');
    var dpadArea = document.getElementById('dpad-area');
    var layoutBtn = document.getElementById('layout-toggle');

    if (side) {
      // Move rotation buttons to left of layer-indicator in middle-row
      middleRow.insertBefore(rotBtns, layerIndicator);
      // Move dpad-area to right of game-canvas-container in middle-row
      middleRow.insertBefore(dpadArea, gameCanvasContainer.nextSibling);
      app.classList.add('controls-side');
      if (layoutBtn) layoutBtn.textContent = 'Bottom';
    } else {
      // Restore both to game-controls-inner
      controlsInner.insertBefore(rotBtns, controlsInner.firstChild);
      controlsInner.appendChild(dpadArea);
      app.classList.remove('controls-side');
      if (layoutBtn) layoutBtn.textContent = 'Left/Right';
    }

    setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 50);
  }

  function buildLayoutToggle() {
    var btn = document.getElementById('layout-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      setLayoutSide(!layoutSide);
    });
  }

  // Tab key toggles controls on desktop
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      setControlsVisible(!controlsVisible);
    }
  });

  // — Initialize on DOM ready —
  document.addEventListener('DOMContentLoaded', function () {
    buildRotationButtons();
    buildDpad();
    buildHardDrop();
    buildSpecialButtons();
    buildControlsToggle();
    buildLayoutToggle();

    // On mobile, show controls by default; on desktop, hide
    var isMobile = window.innerWidth < 1025;
    setControlsVisible(isMobile, false);
  });

})();
