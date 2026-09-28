(function () {
  var GA_ID = 'G-48HGT00G5Q';
  var COOKIE_NAME = 'cookieConsent';

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

  function loadGA() {
    if (loadGA.done) return;
    loadGA.done = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA_ID);

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  if (getCookie(COOKIE_NAME) === 'accepted') {
    loadGA();
  } else {
    document.addEventListener('orbain:consent', loadGA);
  }
})();
