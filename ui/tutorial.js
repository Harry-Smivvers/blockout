'use strict';
// tutorial.js — First-visit tutorial overlay

(function () {

  var STORAGE_KEY = 'blockout3d_tutorial_seen';

  var CONTENT = [
    '<h2>BLOCKOUT 3D</h2>',
    '<p class="axis-item">',
      '<span class="axis-badge x">X</span>',
      '<span class="axis-desc">',
        '<strong>Rotation X</strong> (red buttons)<br>',
        'The piece tilts <strong>forward / backward</strong> — ',
        'its depth changes.',
      '</span>',
    '</p>',
    '<p class="axis-item">',
      '<span class="axis-badge y">Y</span>',
      '<span class="axis-desc">',
        '<strong>Rotation Y</strong> (green buttons)<br>',
        'The piece tilts <strong>left / right</strong> — ',
        'its width changes.',
      '</span>',
    '</p>',
    '<p class="axis-item">',
      '<span class="axis-badge z">Z</span>',
      '<span class="axis-desc">',
        '<strong>Rotation Z</strong> (blue buttons)<br>',
        'The piece spins <strong>in the plane</strong> — ',
        'like in classic Tetris.',
      '</span>',
    '</p>',
    '<div class="tutorial-hint">',
      '&#128073; <strong>Left hand</strong> = Rotation<br>',
      '&#128073; <strong>Right hand</strong> = Movement &amp; Drop<br>',
      '&#128161; Hold a rotation button to preview the rotation.',
    '</div>',
    '<div class="tutorial-hint">',
      '<strong>Keyboard shortcuts:</strong><br>',
      '&larr; &rarr; Move X &nbsp; &uarr; &darr; Move Z<br>',
      'W/S Rot. X &nbsp; A/D Rot. Y &nbsp; Q/E Rot. Z<br>',
      'R Soft Drop &nbsp; Space Hard Drop<br>',
      'P Pause &nbsp; Tab Toggle controls',
    '</div>',
    '<button class="tutorial-close" id="tutorial-close-btn">&#10003; Got it</button>',
  ].join('');

  function showTutorial() {
    var overlay = document.getElementById('tutorial-overlay');
    if (!overlay) return;

    if (!overlay.querySelector('.tutorial-box')) {
      var box = document.createElement('div');
      box.className = 'tutorial-box';
      box.innerHTML = CONTENT;
      overlay.appendChild(box);

      var closeBtn = box.querySelector('#tutorial-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () {
          localStorage.setItem(STORAGE_KEY, '1');
          overlay.classList.add('hidden');
        });
      }
    }

    overlay.classList.remove('hidden');
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Auto-show on first visit
    if (!localStorage.getItem(STORAGE_KEY)) {
      showTutorial();
    }

    // [?] button re-opens the tutorial
    var btn = document.getElementById('btn-tutorial');
    if (btn) {
      // Override the click added in hud.js — keep showTutorial as the handler
      btn.addEventListener('click', function () {
        showTutorial();
      });
    }
  });

})();
