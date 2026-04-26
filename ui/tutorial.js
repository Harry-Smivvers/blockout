'use strict';

(function () {

  var STORAGE_KEY      = 'blockout3d_tutorial_seen';
  var STATE_STORAGE_KEY = 'blockout3d_saved_state';
  var startupClose = false;

  function saveCookie(value) {
    try { localStorage.setItem(STATE_STORAGE_KEY, value); } catch (e) {}
  }

  function loadCookie() {
    try { return localStorage.getItem(STATE_STORAGE_KEY) || ''; } catch (e) { return ''; }
  }

  var TABS_HTML = [
    // Header
    '<div class="tut-header">',
      '<span class="tut-title">BLOCKOUT 3D</span>',
      '<button class="tut-close-x" id="tutorial-close-btn">&#10005;</button>',
    '</div>',
    // Start new game
    '<button class="tut-start-btn" id="tutorial-start-btn">&#9654; Start new game</button>',
    // Tab bar
    '<div class="tut-tabs">',
      '<button class="tut-tab active" data-tab="main">Main</button>',
      '<button class="tut-tab" data-tab="touch">Touch</button>',
      '<button class="tut-tab" data-tab="buttons">Buttons</button>',
      '<button class="tut-tab" data-tab="keys">Keys</button>',
      '<button class="tut-tab" data-tab="restore">Restore</button>',
    '</div>',
    // Content panels
    '<div class="tut-content">',

      // ── Main ──────────────────────────────────────────────────────────────
      '<div class="tut-panel active" id="tut-panel-main">',
        '<img src="BlockoutSplash.png" class="tut-splash" alt="Blockout 3D">',
      '</div>',

      // ── Touch ─────────────────────────────────────────────────────────────
      '<div class="tut-panel" id="tut-panel-touch">',
        '<div class="tut-section">',
          '<div class="tut-section-title">1 FINGER</div>',
          '<div class="tut-row"><span class="tut-key">Swipe &#8592; &#8594;</span><span class="tut-action">Move X</span></div>',
          '<div class="tut-row"><span class="tut-key">Swipe &#8593; &#8595;</span><span class="tut-action">Move Z</span></div>',
          '<div class="tut-row"><span class="tut-key">Double-tap</span><span class="tut-action">Hard Drop</span></div>',
        '</div>',
        '<div class="tut-section">',
          '<div class="tut-section-title">2 FINGERS</div>',
          '<div class="tut-row"><span class="tut-key">Swipe &#8593;</span><span class="tut-action">Rotate X clockwise</span></div>',
          '<div class="tut-row"><span class="tut-key">Swipe &#8595;</span><span class="tut-action">Rotate Z clockwise</span></div>',
          '<div class="tut-row"><span class="tut-key">Swipe &#8592;</span><span class="tut-action">Rotate Y counter-clockwise</span></div>',
          '<div class="tut-row"><span class="tut-key">Swipe &#8594;</span><span class="tut-action">Rotate Y clockwise</span></div>',
          '<div class="tut-row"><span class="tut-key">Double-tap</span><span class="tut-action">Hard Drop</span></div>',
        '</div>',
        '<div class="tut-section">',
          '<div class="tut-section-title">3 FINGERS</div>',
          '<div class="tut-row"><span class="tut-key">Double-tap</span><span class="tut-action">Hard Drop</span></div>',
        '</div>',
      '</div>',

      // ── Buttons ───────────────────────────────────────────────────────────
      '<div class="tut-panel" id="tut-panel-buttons">',
        '<div class="tut-section">',
          '<div class="tut-section-title">ROTATION</div>',
          '<div class="tut-row"><span class="axis-badge x">X</span><span class="tut-key">Rx&#10226; Rx&#10227;</span><span class="tut-action">Tilt forward / backward</span></div>',
          '<div class="tut-row"><span class="axis-badge y">Y</span><span class="tut-key">Ry&#10226; Ry&#10227;</span><span class="tut-action">Tilt left / right</span></div>',
          '<div class="tut-row"><span class="axis-badge z">Z</span><span class="tut-key">Rz&#10226; Rz&#10227;</span><span class="tut-action">Spin in plane</span></div>',
        '</div>',
        '<div class="tut-section">',
          '<div class="tut-section-title">MOVEMENT</div>',
          '<div class="tut-row"><span class="tut-key">&#11014; &#11013; &#11015; &#10145;</span><span class="tut-action">Move X / Z</span></div>',
          '<div class="tut-row"><span class="tut-key">&#11015;&#11015; DROP</span><span class="tut-action">Hard Drop</span></div>',
        '</div>',
        '<div class="tut-section">',
          '<div class="tut-section-title">HUD</div>',
          '<div class="tut-row"><span class="tut-key">&#8617;</span><span class="tut-action">Undo last placed piece</span></div>',
          '<div class="tut-row"><span class="tut-key">&#9193;</span><span class="tut-action">Skip current piece</span></div>',
          '<div class="tut-row"><span class="tut-key">&#9638;</span><span class="tut-action">Toggle Solid / Transparent</span></div>',
          '<div class="tut-row"><span class="tut-key">?</span><span class="tut-action">Open this help</span></div>',
          '<div class="tut-row"><span class="tut-key">&#9208;</span><span class="tut-action">Pause / Resume</span></div>',
        '</div>',
      '</div>',

      // ── Keys ──────────────────────────────────────────────────────────────
      '<div class="tut-panel" id="tut-panel-keys">',
        '<div class="tut-section">',
          '<div class="tut-section-title">MOVEMENT</div>',
          '<div class="tut-row"><span class="tut-key">&#8592; &#8594;</span><span class="tut-action">Move X</span></div>',
          '<div class="tut-row"><span class="tut-key">&#8593; &#8595;</span><span class="tut-action">Move Z</span></div>',
          '<div class="tut-row"><span class="tut-key">R</span><span class="tut-action">Soft Drop</span></div>',
          '<div class="tut-row"><span class="tut-key">Space</span><span class="tut-action">Hard Drop</span></div>',
        '</div>',
        '<div class="tut-section">',
          '<div class="tut-section-title">ROTATION</div>',
          '<div class="tut-row"><span class="tut-key">W / S</span><span class="tut-action">Rotate X ccw / cw</span></div>',
          '<div class="tut-row"><span class="tut-key">A / D</span><span class="tut-action">Rotate Y ccw / cw</span></div>',
          '<div class="tut-row"><span class="tut-key">Q / E</span><span class="tut-action">Rotate Z ccw / cw</span></div>',
        '</div>',
        '<div class="tut-section">',
          '<div class="tut-section-title">GAME</div>',
          '<div class="tut-row"><span class="tut-key">P / Esc</span><span class="tut-action">Pause / Resume</span></div>',
          '<div class="tut-row"><span class="tut-key">U</span><span class="tut-action">Undo last piece</span></div>',
          '<div class="tut-row"><span class="tut-key">N</span><span class="tut-action">Skip piece</span></div>',
          '<div class="tut-row"><span class="tut-key">G / T</span><span class="tut-action">Toggle Solid / Trans.</span></div>',
          '<div class="tut-row"><span class="tut-key">Tab</span><span class="tut-action">Toggle controls panel</span></div>',
        '</div>',
      '</div>',

      // ── Restore ───────────────────────────────────────────────────────────
      '<div class="tut-panel" id="tut-panel-restore">',
        '<div class="tut-section">',
          '<div class="tut-section-title">SAVE STATE</div>',
          '<div class="state-row">',
            '<input type="text" id="state-display" class="state-input" readonly placeholder="Start a game to generate a state code">',
            '<button id="btn-copy-state" class="state-btn">&#128203; Copy</button>',
            '<button id="btn-save-cookie" class="state-btn">&#127850; Save to Cookie</button>',
          '</div>',
        '</div>',
        '<div class="tut-section">',
          '<div class="tut-section-title">RESTORE STATE</div>',
          '<div class="state-row">',
            '<input type="text" id="state-restore-input" class="state-input" placeholder="Paste state code here...">',
            '<button id="btn-restore-state" class="state-btn">&#8635; Restore</button>',
          '</div>',
        '</div>',
      '</div>',

    '</div>', // .tut-content
  ].join('');

  function switchTab(box, tabName) {
    box.querySelectorAll('.tut-tab').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    box.querySelectorAll('.tut-panel').forEach(function (panel) {
      panel.classList.toggle('active', panel.id === 'tut-panel-' + tabName);
    });
  }

  function closeTutorial() {
    var overlay = document.getElementById('tutorial-overlay');
    if (!overlay) return;
    localStorage.setItem(STORAGE_KEY, '1');
    overlay.classList.add('hidden');
    var toggleRow = document.getElementById('controls-toggle-row');
    if (toggleRow) toggleRow.style.visibility = '';
    if (startupClose) {
      startupClose = false;
      if (typeof startGame === 'function') startGame();
    }
  }

  function showTutorial(isStartup) {
    var overlay = document.getElementById('tutorial-overlay');
    if (!overlay) return;

    if (!overlay.querySelector('.tutorial-box')) {
      var box = document.createElement('div');
      box.className = 'tutorial-box';
      box.innerHTML = TABS_HTML;
      overlay.appendChild(box);

      // Close X
      box.querySelector('#tutorial-close-btn').addEventListener('click', closeTutorial);

      // Start new game — always resets, closes overlay without the startupClose path
      box.querySelector('#tutorial-start-btn').addEventListener('click', function () {
        overlay.classList.add('hidden');
        var toggleRow = document.getElementById('controls-toggle-row');
        if (toggleRow) toggleRow.style.visibility = '';
        startupClose = false;
        if (typeof startGame === 'function') startGame();
      });

      // Tab switching
      box.querySelectorAll('.tut-tab').forEach(function (btn) {
        btn.addEventListener('click', function () { switchTab(box, btn.dataset.tab); });
      });

      // Copy state
      box.querySelector('#btn-copy-state').addEventListener('click', function () {
        var el = box.querySelector('#state-display');
        if (!el || !el.value) return;
        navigator.clipboard.writeText(el.value).catch(function () {
          el.select(); document.execCommand('copy');
        });
      });

      // Save to cookie
      box.querySelector('#btn-save-cookie').addEventListener('click', function () {
        var el = box.querySelector('#state-display');
        if (!el || !el.value) return;
        saveCookie(el.value);
        var btn = box.querySelector('#btn-save-cookie');
        var orig = btn.innerHTML;
        btn.innerHTML = '&#10003; Saved';
        setTimeout(function () { btn.innerHTML = orig; }, 1200);
      });

      // Restore state
      box.querySelector('#btn-restore-state').addEventListener('click', function () {
        var input = box.querySelector('#state-restore-input');
        if (!input || !input.value) return;
        if (typeof restoreGameState === 'function' && restoreGameState(input.value)) {
          startupClose = false;  // restoreGameState already starts the game — don't reset it
          closeTutorial();
        } else {
          input.style.borderColor = '#ff4444';
          setTimeout(function () { input.style.borderColor = ''; }, 1000);
        }
      });

      // Click backdrop to close
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeTutorial();
      });
    }

    // Refresh state code every time the overlay opens
    var stateEl = overlay.querySelector('#state-display');
    if (stateEl) {
      stateEl.value = (typeof encodeGameState === 'function' &&
                       typeof running !== 'undefined' && running)
        ? encodeGameState() : '';
    }

    // Pre-fill restore input from cookie if one exists
    var restoreEl = overlay.querySelector('#state-restore-input');
    if (restoreEl) {
      var cookieVal = loadCookie();
      if (cookieVal) restoreEl.value = cookieVal;
    }

    if (isStartup) {
      var startOverlay = document.getElementById('overlay');
      if (startOverlay) startOverlay.style.display = 'none';
      startupClose = true;
    }

    overlay.classList.remove('hidden');
    var toggleRow = document.getElementById('controls-toggle-row');
    if (toggleRow) toggleRow.style.visibility = 'hidden';
  }

  document.addEventListener('DOMContentLoaded', function () {
    showTutorial(true);

    var btn = document.getElementById('btn-tutorial');
    if (btn) {
      btn.addEventListener('click', function () { showTutorial(); });
    }
  });

})();
