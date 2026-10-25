/*
 * SSL Contractor interactions
 * ---------------------------
 * This file adds the app-like behaviours without a framework:
 * mobile navigation, scroll reveal, gallery filters/lightbox, contact form,
 * social links, and service-worker registration.
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Mobile navigation drawer.
  const menuToggle = document.getElementById("menuToggle");
  const siteNav = document.getElementById("siteNav");
  const navLinks = [...document.querySelectorAll(".nav-link")];

  function closeMenu() {
    siteNav.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  [...navLinks, ...document.querySelectorAll(".nav-mobile-actions a")].forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // 2. Load fallback photos if a local image has not been added yet.
  // Replace the local WebP files for best speed and offline support.
  document.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener("error", () => {
      if (image.dataset.fallback && image.src !== image.dataset.fallback) {
        image.src = image.dataset.fallback;
      }
    }, { once: true });
  });

  // 3. Reveal elements as they enter the viewport.
  // Fallback: show everything if IntersectionObserver is unsupported.
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
  }

  // 4. Highlight the navigation item for the section currently in view.
  const pageSections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    pageSections.forEach((section) => sectionObserver.observe(section));
  }

  // 5. Gallery category filter. aria-pressed tells assistive tech which filter is active.
  const filterButtons = [...document.querySelectorAll(".filter-button")];
  const galleryItems = [...document.querySelectorAll(".gallery-item")];

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;
      filterButtons.forEach((filterButton) => {
        const selected = filterButton === button;
        filterButton.classList.toggle("active", selected);
        filterButton.setAttribute("aria-pressed", String(selected));
      });
      galleryItems.forEach((item) => {
        item.hidden = !(selectedCategory === "all" || item.dataset.category === selectedCategory);
      });
    });
  });

  // 6. Accessible project image viewer. Native <dialog> handles Escape and focus.
  const galleryDialog = document.getElementById("galleryDialog");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeLightboxButton = document.getElementById("lightboxClose");
  let currentImageIndex = 0;

  function visibleGalleryItems() {
    return galleryItems.filter((item) => !item.hidden);
  }

  function displayGalleryImage(index) {
    const items = visibleGalleryItems();
    if (!items.length) return;
    currentImageIndex = (index + items.length) % items.length;
    const selectedItem = items[currentImageIndex];
    const thumbnail = selectedItem.querySelector("img");
    lightboxImage.src = selectedItem.dataset.full || thumbnail.currentSrc || thumbnail.src;
    lightboxImage.alt = thumbnail.alt;
    lightboxCaption.textContent = selectedItem.dataset.caption || thumbnail.alt;
  }

  function openLightbox(item) {
    currentImageIndex = visibleGalleryItems().indexOf(item);
    displayGalleryImage(currentImageIndex);
    if (typeof galleryDialog.showModal === "function") {
      galleryDialog.showModal();
    } else {
      // Basic fallback for older browsers without native dialog support.
      galleryDialog.setAttribute("open", "");
    }
    document.body.classList.add("dialog-open");
    closeLightboxButton.focus();
  }

  function closeLightbox() {
    if (typeof galleryDialog.close === "function" && galleryDialog.open) {
      galleryDialog.close();
    } else {
      galleryDialog.removeAttribute("open");
    }
    document.body.classList.remove("dialog-open");
  }

  galleryItems.forEach((item) => item.addEventListener("click", () => openLightbox(item)));
  closeLightboxButton.addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev").addEventListener("click", () => displayGalleryImage(currentImageIndex - 1));
  document.getElementById("lightboxNext").addEventListener("click", () => displayGalleryImage(currentImageIndex + 1));
  galleryDialog.addEventListener("click", (event) => {
    if (event.target === galleryDialog) closeLightbox();
  });
  galleryDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
  document.addEventListener("keydown", (event) => {
    if (!galleryDialog.open) return;
    if (event.key === "ArrowLeft") displayGalleryImage(currentImageIndex - 1);
    if (event.key === "ArrowRight") displayGalleryImage(currentImageIndex + 1);
    if (event.key === "Escape") document.body.classList.remove("dialog-open");
  });

  // 7. Contact form validation and WhatsApp message composition.
  // No form information is stored by this static website.
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const values = new FormData(contactForm);
    const name = String(values.get("name") || "").trim();
    const phone = String(values.get("phone") || "").trim();
    const service = String(values.get("service") || "").trim();
    const details = String(values.get("details") || "").trim();

    const lines = [
      "Hello SSL Contractor, I would like to enquire about a project.",
      "",
      `Name: ${name}`,
      `My phone: ${phone}`,
      `Service: ${service}`,
      details ? `Project details: ${details}` : ""
    ];
    const whatsappUrl = `https://wa.me/919855306181?text=${encodeURIComponent(lines.filter(Boolean).join("\n"))}`;
    formStatus.textContent = "Opening WhatsApp with your enquiry…";

    // This call is made directly inside the form-submit event to reduce popup blocking.
    const openedWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!openedWindow) {
      formStatus.textContent = "WhatsApp did not open. Use the WhatsApp button or allow pop-ups and try again.";
    } else {
      formStatus.textContent = "Your message is ready in WhatsApp. Review it and press Send there.";
    }
  });

  // 8. Social links: paste your real profile URLs here before publishing.
  const INSTAGRAM_URL = ""; // Example: "https://www.instagram.com/your_username/"
  const FACEBOOK_URL = "";  // Example: "https://www.facebook.com/your_page/"
  const socialUrls = { instagram: INSTAGRAM_URL, facebook: FACEBOOK_URL };

  document.querySelectorAll("[data-social]").forEach((link) => {
    const url = socialUrls[link.dataset.social];
    if (url) {
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      // Keep placeholders harmless until the official profile URLs are added.
      link.addEventListener("click", (event) => {
        event.preventDefault();
        formStatus.textContent = "Add your official Instagram and Facebook URLs in js/script.js before publishing.";
        document.getElementById("contactForm").scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }
  });

  // 9. Update the copyright year automatically.
  document.getElementById("currentYear").textContent = String(new Date().getFullYear());

  // 10. Register the service worker only on localhost or HTTPS.
  // This enables PWA caching and supports repeat visits with weak connectivity.
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.warn("Service worker could not be registered:", error);
      });
    });
  }
});
