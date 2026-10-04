fetch('/components/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
    const navbar = document.getElementById('navbar');
    const navbarImg = document.getElementById('btnHomeImg');
    if (navbar) {
      const handleScroll = () => {
        if (window.scrollY > 0) {
          navbar.classList.add('scrolled');
          if (navbarImg) navbarImg.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
          if (navbarImg) navbarImg.classList.remove('scrolled');
        }
      };
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
  });