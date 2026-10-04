(function () {
  var COOKIE_NAME = 'cookieConsent';
  var COOKIE_DAYS = 365;

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
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

  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.innerHTML =
      '<div style="position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#1a1a1a;color:#fff;padding:16px 24px;font-family:Inter,sans-serif;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 -2px 20px rgba(0,0,0,0.3);">' +
        '<div style="flex:1 1 300px;min-width:250px;">' +
          '<p style="margin:0;font-size:14px;line-height:1.5;"><strong>Utilizamos cookies</strong> para analizar el tráfico y mejorar tu experiencia. Al hacer clic en "Aceptar", consientes su uso según nuestra <a href="#" style="color:#4fc3f7;">Política de Cookies</a>.</p>' +
        '</div>' +
        '<button id="cookie-accept-btn" style="background:#FFD700;;color:#1a1a1a;border:none;padding:10px 24px;border-radius:4px;cursor:pointer;font-weight:700;font-size:14px;white-space:nowrap;">Aceptar</button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookie-accept-btn').addEventListener('click', function () {
      setCookie(COOKIE_NAME, 'accepted', COOKIE_DAYS);
      document.dispatchEvent(new CustomEvent('orbain:consent'));
      banner.style.transition = 'opacity 0.5s';
      banner.style.opacity = '0';
      setTimeout(function () { banner.remove(); }, 500);
    });
  }

  if (!getCookie(COOKIE_NAME)) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
