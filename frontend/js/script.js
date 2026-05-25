/* ===================================== */
/* AMPARA - SCRIPT GERAL */
/* script.js */
/* ===================================== */


/* ===================================== */
/* SCROLL SUAVE DOS LINKS */
/* ===================================== */

const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach(link => {

  link.addEventListener("click", (event) => {

    const targetId = link.getAttribute("href");

    if (targetId === "#") return;

    event.preventDefault();

    const targetSection = document.querySelector(targetId);

    targetSection.scrollIntoView({
      behavior: "smooth"
    });

  });

});


/* ===================================== */
/* HEADER COM SOMBRA AO ROLAR */
/* ===================================== */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

  if (window.scrollY > 20) {

    header.style.boxShadow =
      "0 4px 20px rgba(0,0,0,0.08)";

  } else {

    header.style.boxShadow = "none";

  }

});


/* ===================================== */
/* ANIMAÇÃO SUAVE DOS CARDS */
/* ===================================== */

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if (entry.isIntersecting) {

      entry.target.classList.add("show-card");

    }

  });

}, {
  threshold: 0.2
});


cards.forEach((card) => {

  card.classList.add("hidden-card");

  observer.observe(card);

});


/* ===================================== */
/* ANIMAÇÃO HERO */
/* ===================================== */

window.addEventListener("load", () => {

  const heroText = document.querySelector(".hero-text");

  const heroImage = document.querySelector(".hero-image");

  heroText.classList.add("show-hero");

  heroImage.classList.add("show-hero");

});


/* ===================================== */
/* BOTÃO VOLTAR AO TOPO */
/* ===================================== */

const backToTopButton = document.createElement("button");

backToTopButton.innerHTML = "↑";

backToTopButton.classList.add("back-to-top");

document.body.appendChild(backToTopButton);


/* ===================================== */
/* MOSTRAR BOTÃO */
/* ===================================== */

window.addEventListener("scroll", () => {

  if (window.scrollY > 400) {

    backToTopButton.classList.add("show-button");

  } else {

    backToTopButton.classList.remove("show-button");

  }

});


/* ===================================== */
/* VOLTAR AO TOPO */
/* ===================================== */

backToTopButton.addEventListener("click", () => {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});