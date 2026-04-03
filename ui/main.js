'use strict';
// main.js — Exposes window.ui API; must load before other ui/*.js files

(function () {
  let _level = 1;
  let _lines = 0;
  let _toastTimer = null;

  window.ui = {
    updateScore(score) {
      const el = document.getElementById('hud-score');
      if (el) el.textContent = '\u2b50 ' + score.toLocaleString();
    },

    updateLevel(level) {
      _level = level;
      const el = document.getElementById('hud-level-lines');
      if (el) el.textContent = 'L' + level + ' | ' + _lines;
    },

    updateLines(lines) {
      _lines = lines;
      const el = document.getElementById('hud-level-lines');
      if (el) el.textContent = 'L' + _level + ' | ' + lines;
    },

    // No-op: next pieces are rendered directly by the Three.js preview renderers
    // into the #np0/#np1/#np2 canvas elements already in the HUD.
    updateNextPieces(_piecesArray) {},

    updateLayerIndicator(layerArray, currentLayer) {
      if (window.uiLayers) window.uiLayers.update(layerArray, currentLayer);
    },

    setGridButtonActive(isActive) {
      if (window.uiControls) window.uiControls.setGridActive(isActive);
    },

    setPaused(isPaused) {
      const btn = document.getElementById('btn-pause');
      if (btn) {
        btn.textContent = isPaused ? '\u25b6' : '\u23f8';
        btn.classList.toggle('paused', isPaused);
      }
      // Disable all game control buttons while paused
      const controls = document.getElementById('controls');
      if (controls) {
        controls.querySelectorAll('button').forEach(b => {
          b.disabled = isPaused;
        });
      }
    },

    showMessage(text, durationMs) {
      const ms = (typeof durationMs === 'number') ? durationMs : 2000;
      const toast = document.getElementById('msg-toast');
      if (!toast) return;
      toast.textContent = text;
      toast.classList.remove('hidden');
      if (_toastTimer) clearTimeout(_toastTimer);
      _toastTimer = setTimeout(() => toast.classList.add('hidden'), ms);
    },
  };
})();
