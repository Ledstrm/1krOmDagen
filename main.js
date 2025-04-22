document.addEventListener('DOMContentLoaded', () => {
  // === Menyfunktion ===
  const menuButton = document.getElementById("open-menu");
  const closeButton = document.getElementById("close-menu");
  const sideMenu = document.getElementById("side-menu");
  const overlay = document.getElementById("overlay");

  menuButton.addEventListener("click", () => {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
  });

  closeButton.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  });

  // === Sökmöjlighet ===
  const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    performSearch();
  }
});

// Funktion för att utföra sökningen
function performSearch() {
  const query = searchInput.value.toLowerCase().trim();
  if (query === "") {
    displayOrganizations(jsonData); // visa allt igen om inget sökord
    return;
  }const filtered = [];

  if (filtered.length === 0) {
    const container = document.getElementById('org-container');
    container.innerHTML = `<p style="color:red; font-weight:bold;">Inga organisationer matchade din sökning.</p>`;
    return;
  }

  

  jsonData.forEach(group => {
    const matchingOrgs = group.organisationer.filter(org => {
      return (
        org.namn.toLowerCase().includes(query) ||
        org.beskrivning.toLowerCase().includes(query) ||
        group.kategori.toLowerCase().includes(query)
      );
    });

    if (matchingOrgs.length > 0) {
      filtered.push({
        kategori: group.kategori,
        organisationer: matchingOrgs
      });
    }
  });

    displayOrganizations(filtered);
  }

  // === SPA-visning ===
  function showPage(id) {
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => {
      page.style.display = "none";
    });

    const target = document.querySelector(id);
    if (target) {
      target.style.display = "block";
    }
  }

  window.addEventListener("hashchange", () => {
    showPage(window.location.hash);
  });

  showPage(window.location.hash || "#home"); // Kör vid start

  // === Kortfunktioner ===
  document.querySelectorAll('.card-link').forEach(button => {
    button.addEventListener('click', () => {
      const clickedCard = button.closest('.card');
      const clickedExtra = clickedCard.querySelector('.card-extra');

      // Stäng alla andra kort
      document.querySelectorAll('.card').forEach(card => {
        const extra = card.querySelector('.card-extra');
        const btn = card.querySelector('.card-link');
        if (card !== clickedCard) {
          extra.classList.remove('expanded');
          btn.textContent = 'Läs mer';
        }
      });

      // Växla för det klickade kortet
      const isExpanded = clickedExtra.classList.toggle('expanded');
      button.textContent = isExpanded ? 'Dölj' : 'Läs mer';
    });
  });

  // === Organisationer från JSON ===
  const container = document.getElementById('org-container');
  let jsonData = [];

  fetch('organisationer.json')
    .then(response => {
      if (!response.ok) throw new Error('Kunde inte hämta data');
      return response.json();
    })
    .then(data => {
      jsonData = data;
      displayOrganizations(jsonData);
    })
    .catch(error => {
      if (container) {
        container.innerHTML = `<p style="color:red;">${error.message}</p>`;
      }
    });

  // === Filtrering ===
  const filter = document.getElementById('category-filter');
  if (filter) {
    filter.addEventListener('change', filterOrganizations);
  }

  function displayOrganizations(organizations) {
    if (!container) return;

    container.innerHTML = '';
    organizations.forEach(grupp => {
      const groupSection = document.createElement('section');
      groupSection.classList.add('category-section');
      groupSection.innerHTML = `<h2>${grupp.kategori}</h2>`;

      const grid = document.createElement('div');
      grid.classList.add('grid-container');

      grupp.organisationer.forEach(org => {
        const card = document.createElement('div');
        card.classList.add('org-card');
        card.dataset.category = org.kategori;

        card.innerHTML = `
          <img src="${org.bild}" alt="${org.namn}" />
          <h3>${org.namn}</h3>
          <p>${org.beskrivning}</p>
          <a href="${org.url}" target="_blank" class="extern-lank">Läs mer</a>
        `;

        const link = card.querySelector('.extern-lank');
        link.addEventListener('click', function (event) {
          event.preventDefault();
          const confirmRedirect = confirm("Du är på väg att lämna sidan. Vill du fortsätta till en extern sida?");
          if (confirmRedirect) {
            window.open(this.href, '_blank');
          }
        });

        grid.appendChild(card);
      });

      groupSection.appendChild(grid);
      container.appendChild(groupSection);
    });
  }

  function filterOrganizations() {
    const category = filter.value;
    const sections = document.querySelectorAll('.category-section');

    sections.forEach(section => {
      if (category === "" || section.querySelector('h2').textContent === category) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });
  }
});