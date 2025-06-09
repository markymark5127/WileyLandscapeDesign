// Mobile toggle + morphing
const toggle = document.getElementById('navToggle');
const menu = document.getElementById('mobileMenu');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  menu.classList.toggle('show');
});

// Smooth scroll & auto-close

// Use querySelectorAll for both nav menus
for (const link of document.querySelectorAll('.nav-menu-mobile a, .nav-links a')) {
  link.addEventListener('click', function (e) {
    if (this.hash) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    }
    toggle.classList.remove('open');
    menu.classList.remove('show');
  });
}

// Google Map
function initMap() {
  const location = { lat: 40.058698, lng: -76.750339 };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: location,
  });
  new google.maps.Marker({ position: location, map });
}
window.initMap = initMap;
