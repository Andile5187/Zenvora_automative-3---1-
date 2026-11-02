
   // DATA (would normally come from a database/API)
   
const CARS = [
  { id: 1, name: "BMW X5",                        price: 419950, image: "images/Image one.jpg",   status: "In Stock" },
  { id: 2, name: "Volkswagen Polo 1.0 TSI",       price: 275000, image: "images/Image five.jpg",  status: "In Stock" },
  { id: 3, name: "Aston Martin",                  price: 2250000, image: "images/Image six.jpg",   status: "Reserved" },
  { id: 4, name: "BMW 355 I.S",                   price: 1120000, image: "images/Image seven.jpg", status: "In Stock" },
  { id: 6, name: "Hyundai i20",                   price: 610000, image: "images/Image nine.jpg",  status: "In Stock" },
  { id: 7, name: "Range rover",                  price: 1595000, image: "images/Image ten.jpg",    status: "In Stock" },
  
];

const SERVICES = [
  {
    id: "servicing",
    name: "Vehicle Servicing",
    costRange: "R450 - R1 200",
    availability: "Mon-Fri 08:00-16:00, Sat 08:00-12:00",
  },
  {
    id: "diagnostics",
    name: "Vehicle Diagnostics",
    costRange: "R350 - R800",
    availability: "Mon-Fri 08:00-16:00",
  },
  {
    id: "parts",
    name: "Spare Parts & Accessories",
    costRange: "Price varies by part - request a quote",
    availability: "In-store, Mon-Sat",
  },
  {
    id: "inspection",
    name: "Vehicle Inspections",
    costRange: "R500 - R900",
    availability: "By appointment, Mon-Sat",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  initAccordion();
  initRevealOnScroll();
  initShowroom();
  initLightbox();
  initContactForm();
  initEnquiryForm();
  initContactMap();
});


   // Interactive element: accordion (Services page)
   
function initAccordion() {
  const items = document.querySelectorAll(".accordion-item");
  if (!items.length) return;

  items.forEach((item) => {
    const header = item.querySelector(".accordion-header");
    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // close all, then open the clicked one (unless it was already open)
      items.forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
}


   // Animation: fade/slide elements in as they scroll,into view (IntersectionObserver + CSS transition)
   
function initRevealOnScroll() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}


   //Dynamic content: build the Showroom gallery from the CARS array (DOM manipulation) + live search
   
function initShowroom() {
  const gallery = document.getElementById("car-gallery");
  if (!gallery) return;

  const searchInput = document.getElementById("car-search");
  const statusFilter = document.getElementById("car-status-filter");
  const resultCount = document.getElementById("car-result-count");

  function formatPrice(num) {
    return "R " + num.toLocaleString("en-ZA");
  }

  function render(list) {
    gallery.innerHTML = "";

    if (list.length === 0) {
      gallery.innerHTML = '<p class="no-results">No vehicles match your search.</p>';
    }

    list.forEach((car) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-item";

      figure.innerHTML = `
        <img src="${car.image}" class="gallery-img" alt="${car.name}" loading="lazy" data-full="${car.image}" data-caption="${car.name}">
        <figcaption class="car-info">
          <span class="car-name">${car.name}</span>
          <span class="car-price">${formatPrice(car.price)}</span>
        </figcaption>
        <div class="car-status status-${car.status.toLowerCase().replace(/\s+/g, "-")}">${car.status}</div>
        <a class="enquire-btn" href="enquiry.html?type=vehicle&amp;item=${encodeURIComponent(car.name)}">Enquire about this vehicle</a>
      `;
      gallery.appendChild(figure);
    });

    if (resultCount) {
      resultCount.textContent = `${list.length} vehicle${list.length === 1 ? "" : "s"} found`;
    }
  }

  function applyFilters() {
    const term = (searchInput?.value || "").trim().toLowerCase();
    const status = statusFilter?.value || "all";

    const filtered = CARS.filter((car) => {
      const matchesTerm = car.name.toLowerCase().includes(term);
      const matchesStatus = status === "all" || car.status === status;
      return matchesTerm && matchesStatus;
    });

    render(filtered);
  }

  searchInput?.addEventListener("input", applyFilters);
  statusFilter?.addEventListener("change", applyFilters);

  render(CARS);
}


   //Gallery lightbox: click an image to view it large,with next/prev and keyboard (Esc / arrows) support
   
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  let currentImages = [];
  let currentIndex = 0;

  function openAt(index) {
    currentIndex = index;
    const img = currentImages[currentIndex];
    lightboxImg.src = img.dataset.full || img.src;
    lightboxCaption.textContent = img.dataset.caption || img.alt || "";
    lightbox.classList.add("open");
  }

  function close() {
    lightbox.classList.remove("open");
  }

  function show(delta) {
    currentIndex = (currentIndex + delta + currentImages.length) % currentImages.length;
    openAt(currentIndex);
  }

  // Delegate clicks so this also works for images rendered dynamically
  document.addEventListener("click", (e) => {
    const target = e.target.closest(".gallery-img");
    if (!target) return;

    const container = target.closest(".gallery");
    currentImages = Array.from(container.querySelectorAll(".gallery-img"));
    const index = currentImages.indexOf(target);
    openAt(index);
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(-1));
  nextBtn.addEventListener("click", () => show(1));

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(1);
    if (e.key === "ArrowLeft") show(-1);
  });
}


   // Form validation helpers
   
function showError(input, message) {
  const field = input.closest(".field");
  const errorEl = field.querySelector(".error-message");
  if (errorEl) errorEl.textContent = message;
  input.classList.toggle("invalid", Boolean(message));
}

function validateRequired(input, label) {
  if (!input.value.trim()) {
    showError(input, `${label} is required.`);
    return false;
  }
  showError(input, "");
  return true;
}

function validateName(input) {
  const pattern = /^[A-Za-z\s'-]{2,}$/;
  if (!pattern.test(input.value.trim())) {
    showError(input, "Please enter a valid name (letters only).");
    return false;
  }
  showError(input, "");
  return true;
}

function validateEmail(input) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(input.value.trim())) {
    showError(input, "Please enter a valid email address.");
    return false;
  }
  showError(input, "");
  return true;
}

function validatePhone(input) {
  const pattern = /^0\d{9}$|^\+27\d{9}$/;
  if (!pattern.test(input.value.trim().replace(/\s+/g, ""))) {
    showError(input, "Enter a valid SA phone number, e.g. 011 515 7089.");
    return false;
  }
  showError(input, "");
  return true;
}

function validateMessage(input, minLength = 10) {
  if (input.value.trim().length < minLength) {
    showError(input, `Message must be at least ${minLength} characters.`);
    return false;
  }
  showError(input, "");
  return true;
}


   //Contact Us form: validate, compile the message and hand it to the user's email client (mailto), or POST it with fetch/AJAX if an endpoint is set.
   
const CONTACT_RECIPIENT = "info@zenvoraautomative.co.za";
// Optional: set this to a form-processing endpoint (e.g. a Formspree
// or Netlify Forms URL) to send the message over AJAX instead of
// opening the visitor's email app. Leave blank to use mailto.
const CONTACT_FORM_ENDPOINT = "";

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const fullname = form.querySelector("#Fullname");
  const email = form.querySelector("#Email");
  const phone = form.querySelector("#phone");
  const subject = form.querySelector("#Subject");
  const message = form.querySelector("#message");
  const statusBox = document.getElementById("contact-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const validName = validateName(fullname);
    const validEmail = validateEmail(email);
    const validPhone = validatePhone(phone);
    const validSubject = validateRequired(subject, "Subject");
    const validMessage = validateMessage(message);

    if (!(validName && validEmail && validPhone && validSubject && validMessage)) {
      statusBox.textContent = "Please fix the highlighted fields and try again.";
      statusBox.className = "form-status error";
      return;
    }

    const body =
      `Name: ${fullname.value}\n` +
      `Email: ${email.value}\n` +
      `Phone: ${phone.value}\n\n` +
      `${message.value}`;

    if (CONTACT_FORM_ENDPOINT) {
      // AJAX submission
      fetch(CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullname.value,
          email: email.value,
          phone: phone.value,
          subject: subject.value,
          message: message.value,
        }),
      })
        .then(() => {
          statusBox.textContent = "Thank you! Your message has been sent.";
          statusBox.className = "form-status success";
          form.reset();
        })
        .catch(() => {
          statusBox.textContent = "Something went wrong sending your message. Please try again.";
          statusBox.className = "form-status error";
        });
    } else {
      // Fallback for a static site with no backend: compile the
      // message and open it in the visitor's own email app.
      const mailto =
        `mailto:${CONTACT_RECIPIENT}` +
        `?subject=${encodeURIComponent(subject.value)}` +
        `&body=${encodeURIComponent(body)}`;

      statusBox.textContent = "Message ready! Your email app will now open so you can send it.";
      statusBox.className = "form-status success";
      window.location.href = mailto;
      form.reset();
    }
  });

  [fullname, email, phone, subject, message].forEach((input) => {
    input.addEventListener("blur", () => {
      if (input === fullname) validateName(input);
      if (input === email) validateEmail(input);
      if (input === phone) validatePhone(input);
      if (input === subject) validateRequired(input, "Subject");
      if (input === message) validateMessage(input);
    });
  });
}


    //Enquiry form: type -> item select populated via JS, then a cost/availability response is generated
  
function initEnquiryForm() {
  const form = document.getElementById("enquiry-form");
  if (!form) return;

  const typeSelect = form.querySelector("#enquiry-type");
  const itemSelect = form.querySelector("#enquiry-item");
  const fullname = form.querySelector("#enq-name");
  const email = form.querySelector("#enq-email");
  const phone = form.querySelector("#enq-phone");
  const message = form.querySelector("#enq-message");
  const responseBox = document.getElementById("enquiry-response");

  function populateItems() {
    itemSelect.innerHTML = "";
    const type = typeSelect.value;
    let options = [];

    if (type === "service") {
      options = SERVICES.map((s) => ({ value: s.id, label: s.name }));
    } else if (type === "vehicle") {
      options = CARS.map((c) => ({ value: c.id, label: c.name }));
    } else {
      options = [{ value: "general", label: "General sponsorship / volunteering enquiry" }];
    }

    options.forEach((opt) => {
      const el = document.createElement("option");
      el.value = opt.value;
      el.textContent = opt.label;
      itemSelect.appendChild(el);
    });
  }

  typeSelect.addEventListener("change", populateItems);
  populateItems();

  // Pre-select from a query string, e.g. enquiry.html?type=vehicle&item=Audi%20Q3
  const params = new URLSearchParams(window.location.search);
  if (params.get("type")) {
    typeSelect.value = params.get("type");
    populateItems();
  }
  if (params.get("item")) {
    const match = CARS.find((c) => c.name === params.get("item"));
    if (match) itemSelect.value = match.id;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const validName = validateName(fullname);
    const validEmail = validateEmail(email);
    const validPhone = validatePhone(phone);
    const validMessage = validateMessage(message, 5);

    if (!(validName && validEmail && validPhone && validMessage)) {
      responseBox.textContent = "Please fix the highlighted fields and try again.";
      responseBox.className = "form-status error";
      return;
    }

    const type = typeSelect.value;
    let reply = "";

    if (type === "service") {
      const service = SERVICES.find((s) => s.id === itemSelect.value);
      reply =
        `Thank you, ${fullname.value.split(" ")[0]}. Estimated cost for ${service.name}: ` +
        `${service.costRange}. Availability: ${service.availability}. ` +
        `We will also email you at ${email.value} with confirmation.`;
    } else if (type === "vehicle") {
      const car = CARS.find((c) => String(c.id) === String(itemSelect.value));
      reply =
        `Thank you, ${fullname.value.split(" ")[0]}. The ${car.name} is currently ${car.status}. ` +
        (car.status === "In Stock"
          ? "It is available for a test drive - our sales team will contact you to arrange a time."
          : "It is not currently available, but we will let you know if a similar vehicle becomes available.");
    } else {
      reply =
        `Thank you, ${fullname.value.split(" ")[0]}. Your sponsorship/volunteering enquiry has been received. ` +
        `Our community relations team will contact you within 2 business days.`;
    }

    responseBox.textContent = reply;
    responseBox.className = "form-status success";
    form.reset();
    populateItems();
  });
}


   //Interactive map (Leaflet) on the Contact Us page
   
function initContactMap() {
  const mapEl = document.getElementById("contact-map");
  if (!mapEl) return;

  // If the Leaflet library could not load (offline / blocked CDN), show a link instead of a blank box
  if (typeof L === "undefined") {
    mapEl.innerHTML =
      '<p><a href="https://www.openstreetmap.org/search?query=Malibongwe%20Drive%20and%20Republic%20Road%2C%20President%20Ridge%2C%20Randburg%2C%202194" ' +
      'target="_blank" rel="noopener">View our location on OpenStreetMap</a></p>';
    return;
  }

  // APPROXIMATE coordinates for the corner of Malibongwe Dr & Republic Rd, President Ridge.
  // Right-click the exact spot in Google Maps and copy the lat/long to fine-tune the pin.
  const coords = [-26.0916, 27.9686];

  const map = L.map(mapEl).setView(coords, 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  L.marker(coords)
    .addTo(map)
    .bindPopup("<strong>Zenvora Automative</strong><br>Cnr Malibongwe Dr &amp; Republic Rd,<br>President Ridge, Randburg, 2194<br>" +
      '<a href="https://www.google.com/maps/search/?api=1&query=Malibongwe+Drive+and+Republic+Road+President+Ridge+Randburg+2194" target="_blank" rel="noopener">Open in Google Maps</a>')
    .openPopup();
}
