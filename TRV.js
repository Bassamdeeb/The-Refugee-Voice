// Shared JS: language toggle, mobile nav, swap texts, active nav highlight
document.addEventListener('DOMContentLoaded', ()=> {
  const LANG_KEY = 'site_lang_v1';
  const defaultLang = localStorage.getItem(LANG_KEY) || 'en';
  const langToggleBtn = document.querySelector('.lang-toggle');
  const mobileToggle = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const navLinks = document.querySelectorAll('.nav a, .mobile-nav a');

  // swap texts function: looks for [data-en] attributes
  function applyLanguage(lang){
    document.documentElement.lang = (lang === 'ar') ? 'ar' : 'en';
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    // swap content for any element with data-en/data-ar
    document.querySelectorAll('[data-en]').forEach(el=>{
      const en = el.getAttribute('data-en') || '';
      const ar = el.getAttribute('data-ar') || '';
      // if element is input/textarea/placeholders
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'){
        if (el.hasAttribute('data-ph-en') || el.hasAttribute('data-ph-ar')){
          // placeholder swapping
          el.placeholder = (lang === 'ar') ? el.getAttribute('data-ph-ar') : el.getAttribute('data-ph-en');
        } else {
          el.placeholder = (lang === 'ar') ? ar : en;
        }
      } else {
        // set innerHTML -> preserve simple markup if any
        el.innerHTML = (lang === 'ar') ? ar : en;
      }

      // alignment for RTL cases on elements that should mirror
      if (lang === 'ar') {
        el.style.textAlign = el.datasetAlignRtl || 'right';
      } else {
        el.style.textAlign = el.datasetAlignLtr || 'left';
      }
    });

    // update toggle button label
    if (langToggleBtn){
      langToggleBtn.setAttribute('data-current', lang);
      langToggleBtn.innerHTML = (lang === 'ar') ? 'ع' : 'EN';
      // small decorative dot color
      const dot = document.createElement('span'); dot.className='dot';
      langToggleBtn.appendChild(dot);
    }
    localStorage.setItem(LANG_KEY, lang);
  }

  // initialize language
  applyLanguage(defaultLang);

  // button click toggles language
  if (langToggleBtn){
    langToggleBtn.addEventListener('click', ()=> {
      const current = localStorage.getItem(LANG_KEY) || 'en';
      const next = (current === 'en') ? 'ar' : 'en';
      applyLanguage(next);
    });
  }

  // mobile nav toggle
  if (mobileToggle && mobileNav){
    mobileToggle.addEventListener('click', ()=> {
      mobileNav.classList.toggle('open');
      mobileNav.style.display = mobileNav.style.display === 'flex' ? 'none' : 'flex';
    });

    // close on outside click
    document.addEventListener('click', (e)=>{
      if (!mobileNav.contains(e.target) && !mobileToggle.contains(e.target)){
        mobileNav.style.display = 'none';
      }
    });
  }

  // highlight active nav based on pathname
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .mobile-nav a').forEach(a=>{
    if (a.getAttribute('href') === path || (path === '' && a.getAttribute('href') === 'index.html')){
      a.classList.add('active');
    }
  });

  // reveal on scroll
  const faders = document.querySelectorAll('.fade-up');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if (en.isIntersecting) en.target.classList.add('visible');
    });
  }, {threshold:0.12});
  faders.forEach(f=> io.observe(f));
});

// Hero slideshow
const slides = document.querySelectorAll(".hero-slideshow img");
let currentSlide = 0;

function showNextSlide() {
  slides[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
}

// Change slide every 2 seconds
setInterval(showNextSlide, 2000);

// contact us
const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent default reload
  const data = new FormData(form);
  fetch("/submit-form", {
    method: "POST",
    body: data
  })
  .then(res => alert("Form submitted successfully!"))
  .catch(err => alert("Error submitting form."));
});
