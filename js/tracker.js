(function () {
  var GAS_URL = 'https://script.google.com/macros/s/AKfycbRdef1U0Gn3edhvKlI7jK8jEvRIrewkf-qRhVYQ7UZulYYVnBu1H86KpBz9Yl0ZH2Xdw/exec';
  var COOKIE_DAYS = 365;

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + ';' + expires + ';path=/';
  }

  function getCookie(name) {
    var cname = name + '=';
    var decoded = decodeURIComponent(document.cookie);
    var c = decoded.split(';');
    for (var i = 0; i < c.length; i++) {
      var cc = c[i].trim();
      if (cc.indexOf(cname) === 0) return cc.substring(cname.length);
    }
    return null;
  }

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function buildParams(data) {
    var parts = [];
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(data[key])));
      }
    }
    return parts.join('&');
  }

  function sendToGAS(data) {
    var params = buildParams(data);
    var url = GAS_URL + '?' + params;
    fetch(url, { method: 'GET', mode: 'no-cors' })
      .then(function () { console.log('Tracking data sent.'); })
      .catch(function (e) { console.error('Tracking error:', e); });
  }

  function trackEvent(eventType, detail) {
    var visitorId = getCookie('visitorId');
    if (!visitorId || getCookie('cookieConsent') !== 'accepted') return;
    var data = {
      visitorId: visitorId,
      eventType: eventType,
      detail: detail || '',
      page: window.location.href,
      timestamp: Date.now()
    };
    var params = buildParams(data);
    fetch(GAS_URL + '?' + params, { method: 'GET', mode: 'no-cors' })
      .catch(function () {});
  }

  function init() {
    if (init.done || getCookie('cookieConsent') !== 'accepted') return;
    init.done = true;

    var visitorId = getCookie('visitorId');
    var visitCount = parseInt(getCookie('visitCount') || '0', 10);
    var firstVisit = !visitorId;
    var now = Date.now();

    if (firstVisit) {
      visitorId = uuid();
      setCookie('visitorId', visitorId, COOKIE_DAYS);
      setCookie('visitCount', '1', COOKIE_DAYS);
      setCookie('firstVisitTimestamp', now.toString(), COOKIE_DAYS);
    } else {
      visitCount++;
      setCookie('visitCount', visitCount.toString(), COOKIE_DAYS);
      var lastVisit = parseInt(getCookie('lastVisitTimestamp') || '0', 10);
      var daysSinceLast = lastVisit ? Math.floor((now - lastVisit) / 86400000) : 0;
      setCookie('lastVisitTimestamp', now.toString(), COOKIE_DAYS);
      setCookie('daysSinceLastVisit', daysSinceLast.toString(), COOKIE_DAYS);
    }

    var data = {
      visitorId: visitorId,
      ip: '',
      userAgent: navigator.userAgent || '',
      page: window.location.href,
      referrer: document.referrer || '',
      timestamp: now,
      visitCount: visitCount,
      firstVisit: firstVisit ? 'true' : 'false',
      screenRes: screen.width + 'x' + screen.height,
      language: navigator.language || '',
      colorDepth: screen.colorDepth || '',
      eventType: firstVisit ? 'first_visit' : 'return_visit',
      detail: ''
    };

    fetch('https://api.ipify.org?format=json')
      .then(function (r) { return r.json(); })
      .then(function (ipData) {
        data.ip = ipData.ip;
        sendToGAS(data);
      })
      .catch(function () {
        data.ip = 'N/A';
        sendToGAS(data);
      });
  }

  window.orbainTrack = trackEvent;

  // Si ya están aceptadas, inicializa. Si no, espera al evento de aceptación.
  if (getCookie('cookieConsent') === 'accepted') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  } else {
    document.addEventListener('orbain:consent', init);
  }

  document.addEventListener('click', function (e) {
    var target = e.target.closest('a, button');
    if (target) {
      trackEvent('click', target.href || target.textContent.trim().substring(0, 100));
    }
  });

  window.addEventListener('beforeunload', function () {
    trackEvent('page_leave', '');
  });

  if (document.visibilityState === 'visible') {
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        trackEvent('tab_hidden', '');
      }
    });
  }
})();