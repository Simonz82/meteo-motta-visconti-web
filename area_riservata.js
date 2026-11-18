/* Area riservata (2026-10-17): alcune sezioni del sito (Sagre, Utile da sapere,
 * Notizie, Storia/Foto, Record) sono visibili solo a chi e' registrato.
 *
 * Uso:
 *   - pagina intera:  <script src="/area_riservata.js?v=N" data-sezione="Sagre ed Eventi"></script>
 *                     nel <head>: se l'utente non e' loggato la pagina resta sfocata
 *                     dietro un popup che non si puo' chiudere (solo "Torna alla home").
 *   - singola azione: MeteoGate.require('I Record storici', function () { ... })
 *                     esegue subito la funzione se loggato, altrimenti mostra il popup
 *                     (chiudibile) e la esegue appena l'utente si registra/accede.
 *
 * Login:
 *   - sito web: stesso account del menu "👤 web" della home (localStorage
 *     webAccountToken), stessi endpoint register.php / login.php / google_login.php.
 *   - app Android: token nativo via AndroidBridge.getToken(); i pulsanti aprono la
 *     schermata di login nativa (AndroidBridge.openLogin, dall'app che lo supporta),
 *     altrimenti spiegano di usare il menu ☰ dell'app.
 *
 * E' un blocco lato pagina (i contenuti restano pubblici per chi legge il codice):
 * serve a invogliare la registrazione, non a proteggere dati riservati.
 */
(function () {
  if (window.MeteoGate) return;

  var GOOGLE_CLIENT_ID = 'xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com';
  // Il pulsante Google sul sito richiede che https://meteo.nas.vagitaly.it sia tra le
  // "Origini JavaScript autorizzate" del client OAuth Web in Google Cloud Console:
  // finche' non c'e', Google risponde 403 e il pulsante resterebbe vuoto.
  var GOOGLE_WEB_ENABLED = false;

  var isAndroidApp = navigator.userAgent.indexOf('MeteoMottaAndroidApp') !== -1;
  var scriptEl = document.currentScript;
  var pageSection = scriptEl ? scriptEl.getAttribute('data-sezione') : null;

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) {} }

  // Token valido = 64 caratteri esadecimali (bin2hex(random_bytes(32)) lato server).
  // Qualsiasi altra cosa ("null", "undefined", "", spazi, testo qualunque) = non loggato.
  function cleanToken(t) {
    if (typeof t !== 'string') return null;
    t = t.trim();
    return /^[0-9a-fA-F]{64}$/.test(t) ? t : null;
  }
  function getToken() {
    if (isAndroidApp) {
      try { return cleanToken((typeof AndroidBridge !== 'undefined' && AndroidBridge.getToken) ? AndroidBridge.getToken() : null); } catch (e) { return null; }
    }
    return cleanToken(lsGet('webAccountToken'));
  }
  function isLoggedIn() { return !!getToken(); }
  function saveAccount(token, email, nome) {
    lsSet('webAccountToken', token);
    lsSet('webAccountEmail', email || '');
    lsSet('webAccountNome', nome || '');
  }
  function clearAccount() {
    lsDel('webAccountToken'); lsDel('webAccountEmail'); lsDel('webAccountNome');
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // --- Stile (variabili tema del sito con valori di riserva) ---
  var css =
    'html.mg-pre body > *:not(#mgGate) { visibility: hidden !important; }' +
    'html.mg-locked, html.mg-locked body { overflow: hidden !important; }' +
    'html.mg-locked body > *:not(#mgGate) { filter: blur(7px); pointer-events: none !important; user-select: none; }' +
    '#mgGate { position: fixed; inset: 0; z-index: 100000; display: flex; align-items: center; justify-content: center; padding: 16px; box-sizing: border-box; background: rgba(0,0,0,0.55); -webkit-backdrop-filter: blur(2px); backdrop-filter: blur(2px); font-family: inherit; }' +
    '#mgGate .mg-box { position: relative; width: 100%; max-width: 400px; max-height: calc(100vh - 32px); overflow-y: auto; -webkit-overflow-scrolling: touch; box-sizing: border-box; padding: 24px 20px 18px; border-radius: 20px; background: var(--bg-card, #1e1e24); color: var(--text-primary, #f2f2f2); border: 1px solid var(--border-color-2, rgba(255,255,255,0.12)); box-shadow: 0 12px 40px rgba(0,0,0,0.5); text-align: center; }' +
    '#mgGate .mg-close { position: absolute; top: 8px; right: 10px; background: none; border: none; color: var(--text-muted, #aaa); font-size: 1.6rem; line-height: 1; cursor: pointer; padding: 4px 8px; }' +
    '#mgGate .mg-icon { font-size: 2.4rem; line-height: 1; margin-bottom: 8px; }' +
    '#mgGate h3 { margin: 0 0 8px; font-size: 1.15rem; color: var(--accent-secondary, var(--accent-primary, #4fc3f7)); }' +
    '#mgGate p { margin: 0 0 16px; font-size: 0.88rem; line-height: 1.45; color: var(--text-secondary, var(--text-primary, #ddd)); }' +
    '#mgGate .mg-perks { text-align: left; margin: 0 auto 18px; padding: 10px 14px; border-radius: 12px; background: var(--bg-deep, rgba(0,0,0,0.2)); font-size: 0.8rem; line-height: 1.6; color: var(--text-secondary, #ccc); }' +
    '#mgGate .mg-btn { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; box-sizing: border-box; padding: 12px; margin-bottom: 10px; border-radius: 12px; border: none; font-size: 0.92rem; font-weight: 700; cursor: pointer; font-family: inherit; }' +
    '#mgGate .mg-btn-google { background: #ffffff; color: #1f1f1f; border: 1px solid #dadce0; }' +
    '#mgGate .mg-btn-email { background: linear-gradient(145deg,#1b5e20,#2e7d32); color: #fff; }' +
    '#mgGate .mg-btn-home { background: transparent; color: var(--text-muted, #aaa); border: 1px solid var(--border-color-2, rgba(255,255,255,0.15)); font-weight: 600; margin-top: 4px; }' +
    '#mgGate .mg-link { color: var(--accent-primary, #4fc3f7); font-size: 0.82rem; text-decoration: none; }' +
    '#mgGate .mg-small { font-size: 0.72rem; color: var(--text-muted, #999); margin-top: 12px; }' +
    '#mgGate .mg-err { display: none; background: rgba(244,67,54,0.15); color: #ff8a80; padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; margin-bottom: 12px; text-align: left; }' +
    '#mgGate .mg-hint { background: var(--bg-deep, rgba(0,0,0,0.2)); border-radius: 12px; padding: 10px 12px; font-size: 0.82rem; line-height: 1.45; margin-bottom: 12px; text-align: left; }' +
    '#mgGate input { width: 100%; box-sizing: border-box; padding: 10px; margin-bottom: 10px; border-radius: 10px; border: 1px solid var(--border-color-2, rgba(255,255,255,0.15)); background: var(--bg-deep, #15151a); color: var(--text-primary, #f2f2f2); font-size: 0.9rem; font-family: inherit; }' +
    '#mgGate label { display: block; text-align: left; font-size: 0.7rem; color: var(--text-muted, #999); margin-bottom: 4px; }' +
    '#mgGate .mg-gwrap { display: flex; justify-content: center; margin-bottom: 10px; min-height: 44px; }' +
    '#mgGate .mg-sep { display: flex; align-items: center; gap: 10px; margin: 4px 0 12px; font-size: 0.72rem; color: var(--text-muted, #999); }' +
    '#mgGate .mg-sep:before, #mgGate .mg-sep:after { content: ""; flex: 1; height: 1px; background: var(--border-color-2, rgba(255,255,255,0.15)); }';
  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  (document.head || document.documentElement).appendChild(styleEl);

  var GOOGLE_SVG = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';

  var authErrorMap = {
    invalid_email: "Inserisci un'email valida",
    password_too_short: 'La password deve avere almeno 6 caratteri',
    nome_required: 'Inserisci il nome',
    cognome_required: 'Inserisci il cognome',
    citta_required: 'Inserisci la città di residenza',
    birth_date_required: 'Inserisci la data di nascita',
    email_already_registered: 'Questa email è già registrata: usa "Accedi"',
    invalid_credentials: 'Email o password non corretti',
    too_many_attempts: 'Troppi tentativi, riprova tra qualche minuto',
    invalid_google_token: 'Accesso con Google non riuscito, riprova'
  };

  var gateEl = null, gateSection = '', gateClosable = false, onUnlock = null, appPoll = null;

  function lockPage() { document.documentElement.classList.add('mg-locked'); }
  function unlockPage() { document.documentElement.classList.remove('mg-locked'); }

  function setPullToRefresh(enabled) {
    try { if (typeof AndroidBridge !== 'undefined' && AndroidBridge.setPullToRefreshEnabled) AndroidBridge.setPullToRefreshEnabled(enabled); } catch (e) {}
  }

  function ensureGate() {
    if (gateEl) return gateEl;
    gateEl = document.createElement('div');
    gateEl.id = 'mgGate';
    gateEl.setAttribute('role', 'dialog');
    gateEl.setAttribute('aria-modal', 'true');
    gateEl.innerHTML = '<div class="mg-box" id="mgBox"></div>';
    gateEl.addEventListener('click', function (e) { if (e.target === gateEl && gateClosable) closeGate(); });
    document.body.appendChild(gateEl);
    setPullToRefresh(false);
    return gateEl;
  }

  function closeGate() {
    if (appPoll) { clearInterval(appPoll); appPoll = null; }
    if (gateEl && gateEl.parentNode) gateEl.parentNode.removeChild(gateEl);
    gateEl = null;
    setPullToRefresh(true);
  }

  function box() { return document.getElementById('mgBox'); }
  function showErr(msg) {
    var e = document.getElementById('mgErr');
    if (e) { e.textContent = msg; e.style.display = 'block'; }
  }

  function headerHtml(title, subtitle) {
    return (gateClosable ? '<button class="mg-close" aria-label="Chiudi" onclick="MeteoGate._close()">×</button>' : '') +
      '<div class="mg-icon">🔒</div>' +
      '<h3>' + title + '</h3>' +
      (subtitle ? '<p>' + subtitle + '</p>' : '');
  }
  function homeButtonHtml() {
    return gateClosable ? '' : '<button class="mg-btn mg-btn-home" onclick="location.href=\'/\'">← Torna alla home</button>';
  }

  // --- Schermata principale del popup ---
  function renderMain() {
    var sez = gateSection ? '<b>' + escapeHtml(gateSection) + '</b>' : 'questa sezione';
    var html = headerHtml('Sezione riservata agli iscritti',
        'Per entrare in ' + sez + ' registrati <b>gratuitamente</b>: bastano pochi secondi.') +
      '<div class="mg-perks">✅ Sagre ed eventi dei dintorni<br>✅ Notizie dei paesi, storia e foto<br>✅ Utile da sapere e record storici<br>✅ Gratis, nessuna pubblicità</div>';

    if (isAndroidApp) {
      html +=
        '<div class="mg-err" id="mgErr"></div>' +
        '<button class="mg-btn mg-btn-google" onclick="MeteoGate._appLogin(\'google\')">' + GOOGLE_SVG + 'Continua con Google</button>' +
        '<button class="mg-btn mg-btn-email" onclick="MeteoGate._appLogin(\'register\')">✉️ Registrati con la tua email</button>' +
        '<div><a href="#" class="mg-link" onclick="MeteoGate._appLogin(\'login\'); return false;">Hai già un account? Accedi</a></div>' +
        '<div id="mgAppHint"></div>' +
        homeButtonHtml();
    } else {
      html +=
        '<div class="mg-err" id="mgErr"></div>' +
        (GOOGLE_WEB_ENABLED ? '<div class="mg-gwrap" id="mgGoogleBtn"></div><div class="mg-sep">oppure</div>' : '') +
        '<button class="mg-btn mg-btn-email" onclick="MeteoGate._form(\'register\')">✉️ Registrati con la tua email</button>' +
        '<div><a href="#" class="mg-link" onclick="MeteoGate._form(\'login\'); return false;">Hai già un account? Accedi</a></div>' +
        homeButtonHtml();
    }
    html += '<div class="mg-small">Useremo i tuoi dati solo per il servizio. <a href="/privacy.html" class="mg-link" style="font-size:inherit;">Privacy</a></div>';
    box().innerHTML = html;
    if (!isAndroidApp && GOOGLE_WEB_ENABLED) renderGoogleButton();
  }

  // --- Google (solo sito web; nell'app usa il login nativo) ---
  var gisLoading = null;
  function loadGis() {
    if (window.google && google.accounts && google.accounts.id) return Promise.resolve();
    if (gisLoading) return gisLoading;
    gisLoading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { gisLoading = null; reject(new Error('gis_load_failed')); };
      document.head.appendChild(s);
    });
    return gisLoading;
  }
  function renderGoogleButton() {
    loadGis().then(function () {
      var el = document.getElementById('mgGoogleBtn');
      if (!el) return;
      google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: onGoogleCredential, ux_mode: 'popup' });
      var w = Math.min(360, Math.max(200, el.clientWidth || 300));
      google.accounts.id.renderButton(el, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill', locale: 'it', width: w });
    }).catch(function () {
      var el = document.getElementById('mgGoogleBtn');
      if (el) el.innerHTML = '<div class="mg-small">Accesso con Google non disponibile ora: usa la registrazione con email.</div>';
    });
  }
  function onGoogleCredential(resp) {
    if (!resp || !resp.credential) return;
    fetch('/google_login.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_token: resp.credential, origine: 'web' }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!d.success) { showErr(authErrorMap[d.error] || 'Accesso con Google non riuscito'); return; }
        saveAccount(d.token, d.email, d.nome);
        if (d.profile_incomplete) renderCompleteProfile(d.token);
        else done();
      })
      .catch(function () { showErr('Errore di connessione, riprova'); });
  }

  // Dopo il primo accesso Google mancano citta' e data di nascita (come nell'app).
  function renderCompleteProfile(token) {
    box().innerHTML =
      '<div class="mg-icon">👋</div><h3>Ultimo passo</h3>' +
      '<p>Completa il profilo con città e data di nascita.</p>' +
      '<div class="mg-err" id="mgErr"></div>' +
      '<input id="mgCitta" type="text" placeholder="Città di residenza" autocomplete="address-level2">' +
      '<label for="mgNascita">Data di nascita</label>' +
      '<input id="mgNascita" type="date">' +
      '<button class="mg-btn mg-btn-email" id="mgSaveProfile">Entra</button>';
    document.getElementById('mgSaveProfile').onclick = function () {
      var citta = (document.getElementById('mgCitta').value || '').trim();
      var nascita = document.getElementById('mgNascita').value || '';
      if (!citta) { showErr('Inserisci la città di residenza'); return; }
      if (!nascita) { showErr('Inserisci la data di nascita'); return; }
      var auth = { 'Authorization': 'Bearer ' + token };
      fetch('/account.php', { headers: auth, cache: 'no-store' })
        .then(function (r) { return r.json(); })
        .then(function (a) {
          return fetch('/account.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
            body: JSON.stringify({ nome: a.nome || '', cognome: a.cognome || '', note: a.note || '', citta: citta, data_nascita: nascita })
          });
        })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && d.success === false) { showErr(authErrorMap[d.error] || 'Si è verificato un errore'); return; }
          done();
        })
        .catch(function () { showErr('Errore di connessione, riprova'); });
    };
  }

  // --- Registrazione / accesso con email (sito web) ---
  function renderForm(mode) {
    var reg = mode === 'register';
    box().innerHTML =
      '<button class="mg-close" aria-label="Indietro" onclick="MeteoGate._main()" style="left:10px; right:auto;">‹</button>' +
      (gateClosable ? '<button class="mg-close" aria-label="Chiudi" onclick="MeteoGate._close()">×</button>' : '') +
      '<h3 style="margin-top:6px;">' + (reg ? 'Registrati gratis' : 'Accedi') + '</h3>' +
      '<p style="margin-bottom:12px;">' + (reg ? 'Crea il tuo account in pochi secondi.' : 'Bentornato!') + '</p>' +
      '<div class="mg-err" id="mgErr"></div>' +
      '<input id="mgEmail" type="email" placeholder="Email" autocomplete="email">' +
      '<input id="mgPassword" type="password" placeholder="Password' + (reg ? ' (almeno 6 caratteri)' : '') + '" autocomplete="' + (reg ? 'new-password' : 'current-password') + '">' +
      (reg ?
        '<input id="mgNome" type="text" placeholder="Nome" autocomplete="given-name">' +
        '<input id="mgCognome" type="text" placeholder="Cognome" autocomplete="family-name">' +
        '<input id="mgCitta" type="text" placeholder="Città di residenza" autocomplete="address-level2">' +
        '<label for="mgNascita">Data di nascita</label>' +
        '<input id="mgNascita" type="date">'
        : '<div style="text-align:right; margin:-4px 0 12px;"><a href="#" class="mg-link" style="font-size:0.75rem;" onclick="MeteoGate._forgot(); return false;">Password dimenticata?</a></div>') +
      '<button class="mg-btn mg-btn-email" id="mgSubmit">' + (reg ? 'Registrati' : 'Accedi') + '</button>' +
      '<div><a href="#" class="mg-link" onclick="MeteoGate._form(\'' + (reg ? 'login' : 'register') + '\'); return false;">' +
      (reg ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati gratis') + '</a></div>' +
      homeButtonHtml();
    document.getElementById('mgSubmit').onclick = function () { submitForm(reg); };
  }

  function submitForm(reg) {
    var email = (document.getElementById('mgEmail').value || '').trim();
    var password = document.getElementById('mgPassword').value || '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr("Inserisci un'email valida"); return; }
    if (password.length < 6) { showErr('La password deve avere almeno 6 caratteri'); return; }
    var url = '/login.php', body = { email: email, password: password };
    if (reg) {
      url = '/register.php';
      body.nome = (document.getElementById('mgNome').value || '').trim();
      body.cognome = (document.getElementById('mgCognome').value || '').trim();
      body.citta = (document.getElementById('mgCitta').value || '').trim();
      body.data_nascita = document.getElementById('mgNascita').value || '';
      body.origine = 'web';
      if (!body.nome) { showErr('Inserisci il nome'); return; }
      if (!body.cognome) { showErr('Inserisci il cognome'); return; }
      if (!body.citta) { showErr('Inserisci la città di residenza'); return; }
      if (!body.data_nascita) { showErr('Inserisci la data di nascita'); return; }
    }
    var btn = document.getElementById('mgSubmit');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.6'; }
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (btn) { btn.disabled = false; btn.style.opacity = ''; }
        if (!d.success) { showErr(authErrorMap[d.error] || 'Si è verificato un errore'); return; }
        saveAccount(d.token, d.email, d.nome);
        done();
      })
      .catch(function () {
        if (btn) { btn.disabled = false; btn.style.opacity = ''; }
        showErr('Errore di connessione, riprova');
      });
  }

  function forgot() {
    var el = document.getElementById('mgEmail');
    var email = prompt("Inserisci la tua email: ti manderemo un link per reimpostare la password.", el ? el.value : '');
    if (!email) return;
    fetch('/request_reset.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email }) })
      .then(function (r) { return r.json(); })
      .then(function (d) { alert(d.message || "Se l'email è registrata, riceverai a breve le istruzioni."); })
      .catch(function () { alert('Errore di connessione, riprova.'); });
  }

  // --- App Android: login nativo ---
  function appLogin(mode) {
    var opened = false;
    try {
      if (typeof AndroidBridge !== 'undefined' && AndroidBridge.openLogin) { AndroidBridge.openLogin(mode); opened = true; }
    } catch (e) {}
    if (!opened) {
      var hint = document.getElementById('mgAppHint');
      if (hint) hint.innerHTML = '<div class="mg-hint">Tocca il menu <b>☰</b> in alto a destra e scegli <b>Account</b>: lì puoi accedere con Google o registrarti con la tua email. Poi torna qui: la sezione si sbloccherà da sola.</div>';
    }
    startAppPoll();
  }
  // Tornando dalla schermata di login nativa la pagina non viene ricaricata:
  // controlliamo noi se nel frattempo l'utente risulta loggato.
  function startAppPoll() {
    if (appPoll || !isAndroidApp) return;
    appPoll = setInterval(function () { var t = getToken(); if (t && t !== badTok) done(); }, 1500);
  }

  function done() {
    var cb = onUnlock;
    onUnlock = null;
    closeGate();
    unlockPage();
    if (cb) { try { cb(); } catch (e) {} }
    else location.reload(); // la pagina riparte "da loggato" (es. Proponi evento in Sagre)
  }

  function openGate(section, closable, cb) {
    gateSection = section || '';
    gateClosable = !!closable;
    onUnlock = cb || null;
    ensureGate();
    renderMain();
    if (isAndroidApp) startAppPoll();
  }

  // Verifica lato server del token (web e app). Esito in cache 10 minuti (sessionStorage)
  // e, per tollerare solo un'assenza di rete, ultimo esito positivo valido 7 giorni (localStorage).
  // Nessun esito positivo + rete assente = bloccato (fail-closed).
  function ssGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function tag(t) { return t.slice(0, 16); }
  function recentlyValid(t) {
    var v = ssGet('mgOk'); if (!v) return false;
    var p = v.split(':'); return p[0] === tag(t) && (Date.now() - parseInt(p[1], 10)) < 600000;
  }
  function markValid(t) {
    ssSet('mgOk', tag(t) + ':' + Date.now());
    lsSet('mgOkLong', tag(t) + ':' + Date.now());
  }
  function validLongAgo(t) {
    var v = lsGet('mgOkLong'); if (!v) return false;
    var p = v.split(':'); return p[0] === tag(t) && (Date.now() - parseInt(p[1], 10)) < 7 * 86400000;
  }
  function verifyToken(t, onOk, onBad) {
    if (recentlyValid(t)) { onOk(); return; }
    var done = false;
    var timer = setTimeout(function () { if (!done) { done = true; if (validLongAgo(t)) onOk(); else onBad(false); } }, 8000);
    fetch('/account.php', { headers: { 'Authorization': 'Bearer ' + t }, cache: 'no-store' })
      .then(function (r) {
        if (done) return; done = true; clearTimeout(timer);
        if (r.status === 200) { markValid(t); onOk(); }
        else if (r.status === 401 || r.status === 403 || r.status === 404) onBad(true);
        else if (validLongAgo(t)) onOk();
        else onBad(false);
      })
      .catch(function () {
        if (done) return; done = true; clearTimeout(timer);
        if (validLongAgo(t)) onOk(); else onBad(false);
      });
  }
  var badTok = null; // token rifiutato dal server: il polling dell'app non deve ricaricare in loop
  function clearPre() { document.documentElement.classList.remove('mg-pre'); }

  function protectPage(section) {
    document.documentElement.classList.add('mg-pre');
    function showLocked() {
      lockPage(); clearPre();
      var go = function () { openGate(section, false, null); };
      if (document.body) go(); else document.addEventListener('DOMContentLoaded', go);
    }
    var t = getToken();
    if (!t) { showLocked(); return; }
    verifyToken(t, clearPre, function (invalid) {
      badTok = t;
      if (invalid && !isAndroidApp) clearAccount();
      showLocked();
    });
  }

  window.MeteoGate = {
    isLoggedIn: isLoggedIn,
    getToken: getToken,
    protectPage: protectPage,
    require: function (section, cb) {
      var t = getToken();
      if (!t) { openGate(section, true, cb); return; }
      verifyToken(t, cb, function (invalid) {
        badTok = t;
        if (invalid && !isAndroidApp) clearAccount();
        openGate(section, true, cb);
      });
    },
    _close: closeGate,
    _main: renderMain,
    _form: renderForm,
    _forgot: forgot,
    _appLogin: appLogin
  };

  if (pageSection) protectPage(pageSection);
})();
