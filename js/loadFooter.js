fetch('/components/footer.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
    var s1 = document.createElement('script');
    s1.src = '/js/cookieConsent.js';
    s1.async = false;
    document.body.appendChild(s1);
    var s2 = document.createElement('script');
    s2.src = '/js/tracker.js';
    s2.async = false;
    document.body.appendChild(s2);
  });
