
const track = document.getElementById("carouselTrack");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentSlide = 0;
const totalSlides = slides.length;
const AUTOPLAY_DELAY = 5000; // ms
let autoplayTimer = null;

function goToSlide(index) {
  currentSlide = (index + totalSlides) % totalSlides;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
}

function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);
}

function stopAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
}

prevBtn.addEventListener("click", () => {
  prevSlide();
  startAutoplay(); 
});

nextBtn.addEventListener("click", () => {
  nextSlide();
  startAutoplay();
});

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    goToSlide(i);
    startAutoplay();
  });
});

const carouselEl = document.getElementById("carousel");
carouselEl.addEventListener("mouseenter", stopAutoplay);
carouselEl.addEventListener("mouseleave", startAutoplay);

document.addEventListener("keydown", (e) => {
  if (document.querySelector(".modal-overlay.active")) return; // ignore when modal open
  if (e.key === "ArrowLeft") { prevSlide(); startAutoplay(); }
  if (e.key === "ArrowRight") { nextSlide(); startAutoplay(); }
});

let touchStartX = 0;
let touchEndX = 0;

carouselEl.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselEl.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const diff = touchStartX - touchEndX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextSlide();
    else prevSlide();
    startAutoplay();
  }
}, { passive: true });


startAutoplay();


function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  stopAutoplay();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
  startAutoplay();
}


document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.remove("active");
      document.body.style.overflow = "";
      startAutoplay();
    }
  });
});


document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const open = document.querySelector(".modal-overlay.active");
    if (open) {
      open.classList.remove("active");
      document.body.style.overflow = "";
      startAutoplay();
    }
  }
});



function scrollToContact(event, modalId) {
  event.preventDefault();
  closeModal(modalId);

  // Small delay so modal close animation feels natural before scroll starts
  setTimeout(() => {
    const target = document.getElementById("hubungi-kami");
    if (!target) return;

    const headerOffset = 70; // sticky header height + small gap
    const startY = window.scrollY;
    const targetY =
      target.getBoundingClientRect().top + window.scrollY - headerOffset;
    const distance = targetY - startY;
    const duration = 500; // 500ms = fast & smooth feel
    const startTime = performance.now();

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, 200);
}



document.querySelectorAll(".contact-card").forEach((card) => {
  card.addEventListener("click", () => {
    const phone = card.dataset.phone; // e.g. "6288211295515"
    if (!phone) return;
    const message = encodeURIComponent(
      "Halo Mbak! mau tanya"
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  });
});