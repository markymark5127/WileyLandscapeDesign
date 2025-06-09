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

  loadReviews();
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
    const wrapper = document.createElement('div');
    wrapper.className = 'thumbnail';
    wrapper.dataset.index = index;

    const img = document.createElement('img');
    img.src = service.src;
    img.alt = service.title;

    wrapper.appendChild(img);
    thumbContainer.appendChild(wrapper);
  });

  thumbContainer.querySelectorAll('.thumbnail').forEach(wrapper => {
    wrapper.addEventListener('click', () => updateCarousel(+wrapper.dataset.index));
  });
}

function styleThumbnails() {
  const thumbs = thumbContainer.querySelectorAll('.thumbnail');
  thumbs.forEach((wrapper, idx) => {
    let diff = idx - currentService;
    if (diff > services.length / 2) diff -= services.length;
    if (diff < -services.length / 2) diff += services.length;
    const scale = 1 - Math.min(Math.abs(diff) * 0.15, 0.45);
    const opacity = 1 - Math.min(Math.abs(diff) * 0.25, 0.75);
    const x = diff * 80;
    const z = -Math.abs(diff) * 100;
    const angle = diff * 30;
    wrapper.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${angle}deg) scale(${scale})`;
    wrapper.style.opacity = opacity;
    wrapper.style.zIndex = 100 - Math.abs(diff);
    wrapper.classList.toggle('selected', idx === currentService);
  });
}

function centerThumbnail() {
  /* no scrolling needed with 3D layout */
}

function updateCarousel(index) {
  const newIndex = (index + services.length) % services.length;
  if (newIndex === currentService) return;

  mainImg.classList.add('fade-out');
  serviceTitle.classList.add('fade-out');

  mainImg.addEventListener('transitionend', function handler() {
    mainImg.removeEventListener('transitionend', handler);
    currentService = newIndex;
    mainImg.src = services[currentService].src;
    mainImg.alt = services[currentService].title;
    serviceTitle.textContent = services[currentService].title;
    styleThumbnails();
    centerThumbnail();

    requestAnimationFrame(() => {
      mainImg.classList.remove('fade-out');
      serviceTitle.classList.remove('fade-out');
    });
  }, { once: true });
}

prevBtn.addEventListener('click', () => updateCarousel(currentService - 1));
nextBtn.addEventListener('click', () => updateCarousel(currentService + 1));

renderThumbnails();

// Position thumbnails immediately without animation
const initialThumbs = thumbContainer.querySelectorAll('.thumbnail');
initialThumbs.forEach(thumb => thumb.classList.add('initial')); // disable transitions
styleThumbnails();
centerThumbnail();
requestAnimationFrame(() => {
  initialThumbs.forEach(thumb => thumb.classList.remove('initial'));
});

updateCarousel(0);

// Google Reviews
function loadReviews() {
  const container = document.getElementById('reviews-container');
  if (!container || !window.google || !google.maps) {
    return;
  }
  const service = new google.maps.places.PlacesService(document.createElement('div'));
  service.getDetails(
    {
      placeId: 'ChIJm5rs6PjWxokRoQXkT0dU8yw',
      fields: ['reviews']
    },
    (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place.reviews) {
        container.innerHTML = '';
        place.reviews.slice(0, 5).forEach(r => {
          const div = document.createElement('div');
          div.className = 'review';
          div.innerHTML = `
            <p class="review-text">"${r.text}"</p>
            <p class="review-author">- ${r.author_name}</p>
          `;
          container.appendChild(div);
        });
      } else {
        container.textContent = 'Unable to load reviews.';
      }
    }
  );
}

// Contact Form
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  alert('Thank you! We\'ll be in touch soon.');
  e.target.reset();
});
