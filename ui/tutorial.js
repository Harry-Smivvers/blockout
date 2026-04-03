'use strict';
// tutorial.js — First-visit tutorial overlay

(function () {

  var STORAGE_KEY = 'blockout3d_tutorial_seen';

  var CONTENT = [
    '<h2>BLOCKOUT 3D</h2>',
    '<p class="axis-item">',
      '<span class="axis-badge x">X</span>',
      '<span class="axis-desc">',
        '<strong>Rotation X</strong> (rote Buttons)<br>',
        'Der Stein kippt nach <strong>vorne / hinten</strong> — ',
        'die Tiefe des Steins &auml;ndert sich.',
      '</span>',
    '</p>',
    '<p class="axis-item">',
      '<span class="axis-badge y">Y</span>',
      '<span class="axis-desc">',
        '<strong>Rotation Y</strong> (gr&uuml;ne Buttons)<br>',
        'Der Stein kippt nach <strong>links / rechts</strong> — ',
        'die Breite des Steins &auml;ndert sich.',
      '</span>',
    '</p>',
    '<p class="axis-item">',
      '<span class="axis-badge z">Z</span>',
      '<span class="axis-desc">',
        '<strong>Rotation Z</strong> (blaue Buttons)<br>',
        'Der Stein dreht sich <strong>in der Ebene</strong> — ',
        'wie beim klassischen Tetris.',
      '</span>',
    '</p>',
    '<div class="tutorial-hint">',
      '&#128073; <strong>Linke Hand</strong> = Rotation<br>',
      '&#128073; <strong>Rechte Hand</strong> = Bewegung &amp; Drop<br>',
      '&#128161; Halte einen Rotationsbutton gedr&uuml;ckt f&uuml;r eine Drehvorschau.',
    '</div>',
    '<div class="tutorial-hint">',
      '<strong>Tastaturk&uuml;rzel:</strong><br>',
      '&larr; &rarr; Bewegen X &nbsp; &uarr; &darr; Bewegen Z<br>',
      'W/S Rot. X &nbsp; A/D Rot. Y &nbsp; Q/E Rot. Z<br>',
      'R Soft Drop &nbsp; Leertaste Hard Drop<br>',
      'P Pause &nbsp; Tab Controls ein-/ausblenden',
    '</div>',
    '<button class="tutorial-close" id="tutorial-close-btn">&#10003; Verstanden</button>',
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
