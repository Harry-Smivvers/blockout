'use strict';
// hud.js — Falltime stepper, pause button, tutorial button

(function () {
  const MIN_FALLTIME = 0.5;
  const MAX_FALLTIME = 30;
  const DEFAULT_FALLTIME = 10;
  let currentFalltime = DEFAULT_FALLTIME;

  function dispatch(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
  }

  function snap(val) {
    // Snap to nearest 0.5
    return Math.round(val * 2) / 2;
  }

  function setFalltime(val) {
    val = snap(parseFloat(val));
    if (isNaN(val)) return;
    val = Math.max(MIN_FALLTIME, Math.min(MAX_FALLTIME, val));
    currentFalltime = val;
    const input = document.getElementById('ft-value');
    if (input) input.value = val.toFixed(1);
    dispatch('game:falltime-changed', { seconds: val });
  }

  document.addEventListener('DOMContentLoaded', function () {

    // — Falltime stepper —
    const minus = document.getElementById('ft-minus');
    const plus  = document.getElementById('ft-plus');
    const input = document.getElementById('ft-value');

    if (minus) {
      minus.addEventListener('click', function () {
        navigator.vibrate && navigator.vibrate(15);
        setFalltime(currentFalltime - 0.5);
      });
    }

    if (plus) {
      plus.addEventListener('click', function () {
        navigator.vibrate && navigator.vibrate(15);
        setFalltime(currentFalltime + 0.5);
      });
    }

    if (input) {
      // Pause game while user edits the input
      input.addEventListener('focus', function () {
        dispatch('game:pause', {});
      });
      input.addEventListener('blur', function () {
        var val = parseFloat(input.value);
        if (!isNaN(val)) setFalltime(val);
        dispatch('game:resume', {});
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          input.blur();
        }
      });
    }

    // — Pause button —
    var pauseBtn = document.getElementById('btn-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        navigator.vibrate && navigator.vibrate(15);
        dispatch('game:pause-toggle', {});
      });
    }

    // — Tutorial button —
    var tutorialBtn = document.getElementById('btn-tutorial');
    if (tutorialBtn) {
      tutorialBtn.addEventListener('click', function () {
        var overlay = document.getElementById('tutorial-overlay');
        if (overlay) overlay.classList.remove('hidden');
      });
    }

    // Fire initial falltime so game engine picks it up
    setFalltime(DEFAULT_FALLTIME);
  });
})();
