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

// Services Carousel
const services = [
  { src: 'assets/Softscaping.png', title: 'Softscaping' },
  { src: 'assets/MulchInstallation.png', title: 'Mulch Installation' },
  { src: 'assets/LandscapingDesign.png', title: 'Landscape Design' },
  { src: 'assets/FallCleanup.png', title: 'Fall Clean Up' },
  { src: 'assets/SodInstallation.png', title: 'Sod Installation' },
  { src: 'assets/TreeTrimming.png', title: 'Tree Trimming' },
  { src: 'assets/TreeRemoval.png', title: 'Tree Removal' }
];

let currentService = 0;
const mainImg = document.querySelector('.main-service-img');
const serviceTitle = document.querySelector('.service-title');
const thumbContainer = document.querySelector('.thumbnail-carousel');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

function renderThumbnails() {
  thumbContainer.innerHTML = '';
  services.forEach((service, index) => {
    const img = document.createElement('img');
    img.src = service.src;
    img.alt = service.title;
    img.dataset.index = index;
    thumbContainer.appendChild(img);
  });
  thumbContainer.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', () => updateCarousel(+img.dataset.index));
  });
}

function styleThumbnails() {
  const thumbs = thumbContainer.querySelectorAll('img');
  thumbs.forEach((img, idx) => {
    const diff = Math.min(
      Math.abs(idx - currentService),
      services.length - Math.abs(idx - currentService)
    );
    const scale = 1 - Math.min(diff * 0.1, 0.4);
    const opacity = 1 - Math.min(diff * 0.2, 0.6);
    img.style.transform = `scale(${scale})`;
    img.style.opacity = opacity;
    img.classList.toggle('selected', idx === currentService);
  });
}

function centerThumbnail() {
  const selected = thumbContainer.querySelector('img.selected');
  if (selected) {
    const left = selected.offsetLeft - (thumbContainer.offsetWidth / 2 - selected.offsetWidth / 2);
    thumbContainer.scrollTo({ left, behavior: 'smooth' });
  }
}

function updateCarousel(index) {
  currentService = (index + services.length) % services.length;
  mainImg.src = services[currentService].src;
  mainImg.alt = services[currentService].title;
  serviceTitle.textContent = services[currentService].title;
  mainImg.classList.add('spin');
  mainImg.addEventListener('animationend', () => {
    mainImg.classList.remove('spin');
  }, { once: true });
  styleThumbnails();
  centerThumbnail();
}

prevBtn.addEventListener('click', () => updateCarousel(currentService - 1));
nextBtn.addEventListener('click', () => updateCarousel(currentService + 1));

renderThumbnails();
updateCarousel(0);
