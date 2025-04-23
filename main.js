document.addEventListener('DOMContentLoaded', () => {
  console.log("Kontaktsida finns:", document.querySelector("#contact") !== null);
  console.log("Kontaktformulär finns:", document.querySelector("#contactForm") !== null);
  
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

  const testButton = document.getElementById("test-button");
  if (testButton) {
    testButton.addEventListener("click", () => {
      
    });
  } else {
    console.error("Testknappen hittades inte i DOM");
  }

  // === Sökmöjlighet ===
  const searchInput = document.querySelector('.search-input');
  const searchButton = document.querySelector('.search-button');
  let currentQuery = "";

  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  });

  function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    // Spara sökfrågan för highlightText-funktionen
    currentQuery = query;
    
    if (query === "") {
      displayOrganizations(jsonData); // visa allt igen om inget sökord
      return;
    }
    
    const filtered = [];
    
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

    if (filtered.length === 0) {
      const container = document.getElementById('org-container');
      container.innerHTML = `<p style="color:red; font-weight:bold;">Inga organisationer matchade din sökning.</p>`;
    } else {
      displayOrganizations(filtered);
    }
    
    // Rensa sökfältet efter sökning
    searchInput.value = '';
  }

  function highlightText(text, query) {
    if (!query || query === "") return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  

  // === SPA-visning ===
  function showPage(id) {
    console.log("Visar sida:", id);
    const pages = document.querySelectorAll(".page");
    pages.forEach(page => {
      page.style.display = "none";
    });

    const target = document.querySelector(id);
    if (target) {
      target.style.display = "block";
      
      // Om man navigerar till favoritsidan, uppdatera den
      if (id === "#favorites") {
        displayFavorites();
      }
      if (id === "#contact") {
        resetContactForm();
      }
    }else{
      console.error("Sidan hittades inte:", id);
    }
  } 

  window.addEventListener("hashchange", () => {
    showPage(window.location.hash);
  });

  showPage(window.location.hash || "#home"); // Kör vid start
  // För felsökning av SPA-navigationen
document.querySelectorAll('.side-menu a').forEach(link => {
  link.addEventListener('click', function(e) {
    console.log("Klickad länk:", this.getAttribute('href'));
    // Stäng menyn när en länk klickas
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
  });
});
 // === Kontaktformulär === 
 function resetContactForm() {
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  
  if (form) {
    form.reset();
    if (formStatus) {
      formStatus.className = 'form-status';
      formStatus.textContent = '';
    }
  }
}

// Hantera formulärinlämning
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitButton = document.getElementById('submitButton');
  
  // Förhindra flera klick
  submitButton.disabled = true;
  submitButton.textContent = 'Skickar...';
  
  // Samla formulärdata
  const formData = {
    name: form.name.value,
    email: form.email.value,
    subject: form.subject.value,
    message: form.message.value
  };
  
  // Simulera AJAX-anrop (ersätt med din faktiska server-URL)
  setTimeout(() => {
    // Simulera en lyckad serverrespons
    const success = true; // Ändra till false för att testa felmeddelanden
    
    if (success) {
      formStatus.textContent = 'Tack för ditt meddelande! Vi återkommer så snart som möjligt.';
      formStatus.className = 'form-status success';
      form.reset();
    } else {
      formStatus.textContent = 'Ett fel uppstod. Försök igen senare eller kontakta oss via e-post.';
      formStatus.className = 'form-status error';
    }
    
    submitButton.disabled = false;
    submitButton.textContent = 'Skicka';
  }, 1500);
  
  return false;
}

// Koppla formuläret till handleFormSubmit-funktionen
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', handleFormSubmit);
} else {
  console.error("Kontaktformuläret hittades inte i DOM");
}

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

  // === Favoritfunktioner ===
  // Hämta sparade favoriter från localStorage
  function getFavorites() {
    const favoritesString = localStorage.getItem('favorites');
    return favoritesString ? JSON.parse(favoritesString) : [];
  }

  // Spara favoriter till localStorage
  function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  // Lägg till eller ta bort favorit
  function toggleFavorite(orgId, orgName) {
    const favorites = getFavorites();
    const existingIndex = favorites.findIndex(fav => fav.id === orgId);
    
    if (existingIndex !== -1) {
      // Ta bort från favoriter
      favorites.splice(existingIndex, 1);
      saveFavorites(favorites);
      return false; // Inte favorit längre
    } else {
      // Lägg till som favorit
      favorites.push({ id: orgId, name: orgName });
      saveFavorites(favorites);
      return true; // Nu favorit
    }
  }

  // Kontrollera om en org är favorit
  function isFavorite(orgId) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === orgId);
  }

  // Visa favoriter på favoritssidan
  function displayFavorites() {
    const favorites = getFavorites();
    const container = document.getElementById('favorite-container');
    
    if (!container) return;
    
    if (favorites.length === 0) {
      container.innerHTML = '<p>Du har inga favoritorganisationer ännu.</p>';
      return;
    }
    
    container.innerHTML = '';
    
    // Skapa en grid för favoriter
    const grid = document.createElement('div');
    grid.classList.add('grid-container');
    
    // Hitta och visa alla favoritorgs
    favorites.forEach(favorite => {
      // Sök genom jsonData för att hitta organisationen
      let foundOrg = null;
      let orgCategory = "";
      
      jsonData.forEach(group => {
        group.organisationer.forEach(org => {
          if (org.id === favorite.id) {
            foundOrg = org;
            orgCategory = group.kategori;
          }
        });
      });
      
      if (foundOrg) {
        const card = createOrgCard(foundOrg, orgCategory);
        grid.appendChild(card);
      }
    });
    
    container.appendChild(grid);
  }
// === Matchningstest ===
  const testForm = document.getElementById('match-test');
  const resultContainer = document.getElementById('test-result');

  testForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(testForm);
    const values = [];
    formData.forEach(value => values.push(value));

    const matchScores = {};
    values.forEach(cat => {
      matchScores[cat] = (matchScores[cat] || 0) + 1;
    });

    // Hitta toppkategorier (sorterat efter poäng)
    const sortedCategories = Object.entries(matchScores)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    const topCategory = sortedCategories[0];
    if (!topCategory) {
      resultContainer.innerHTML = '<p>Välj minst ett alternativ för att få matchningar.</p>';
      return;
    }

    // Visa matchande organisationer från jsonData
    const matches = [];
    jsonData.forEach(group => {
      if (group.kategori === topCategory) {
        matches.push(...group.organisationer);
      }
    });

    resultContainer.innerHTML = `
      <h3>Du matchar med kategorin: ${topCategory}</h3>
      <div class="grid-container">
        ${matches.slice(0, 5).map(org => `
          <div class="org-card">
            <img src="${org.bild}" alt="${org.namn}" />
            <h4>${org.namn}</h4>
            <p>${org.beskrivning}</p>
            <a href="${org.url}" target="_blank">Läs mer</a>
          </div>
        `).join('')}
      </div>
    `;
  });

  // === Organisationer från JSON === (Ställer till problem? prova ändra till document.queryselector("main").innerHTML = generateHTML;
  //  eller doument.body.innerHTML = generateHTML;) 
  const container = document.getElementById('org-container');
  let jsonData = [];

  fetch('organisationer.json')
    .then(response => {
      if (!response.ok) throw new Error('Kunde inte hämta data');
      return response.json();
    })
    .then(data => {
      // Se till att varje organisation har ett unikt ID
      data.forEach((group, groupIndex) => {
        group.organisationer.forEach((org, orgIndex) => {
          if (!org.id) {
            org.id = `org-${groupIndex}-${orgIndex}`;
          }
        });
      });
      
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

  // Skapa organisationskort med favorit-funktion
  function createOrgCard(org, category) {
    const card = document.createElement('div');
    card.classList.add('org-card');
    card.dataset.category = category;
    
    // Stjärn-ikon (använder unicode-stjärna)
    const isFav = isFavorite(org.id);
    const starClass = isFav ? 'favorite active' : 'favorite';
    
    card.innerHTML = `
    <img src="${org.bild}" alt="${org.namn}" />
    <h3>${highlightText(org.namn, currentQuery)}</h3>
    <p>${highlightText(org.beskrivning, currentQuery)}</p>
    <div class="org-card-footer">
      <a href="${org.url}" target="_blank" class="extern-lank">Läs mer</a>
      <span class="${isFavorite(org.id) ? 'favorite active' : 'favorite'}" data-id="${org.id}" data-name="${org.namn}">★</span>
    </div>
  `;
    
    // Lägg till klick-event för stjärnor
    const star = card.querySelector('.favorite');
    star.addEventListener('click', function() {
      const orgId = this.dataset.id;
      const orgName = this.dataset.name;
      const isNowFavorite = toggleFavorite(orgId, orgName);
      
      if (isNowFavorite) {
        this.classList.add('active');
      } else {
        this.classList.remove('active');
      }
    });
    
    // Lägg till klick-event för länken
    const link = card.querySelector('.extern-lank');
    link.addEventListener('click', function (event) {
      event.preventDefault();
      const confirmRedirect = confirm("Du är på väg att lämna sidan. Vill du fortsätta till en extern sida?");
      if (confirmRedirect) {
        window.open(this.href, '_blank');
      }
    });
    
    return card;
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
        const card = createOrgCard(org, grupp.kategori);
        grid.appendChild(card);
      });

      groupSection.appendChild(grid);
      container.appendChild(groupSection);
    });
  }

  function filterOrganizations() {
    const category = filter.value;
    
    // Om användaren väljer "se alla" eller byter kategori, återställ sökningen
    if (currentQuery) {
      currentQuery = "";
      displayOrganizations(jsonData); // Visa alla organisationer igen
    }
    
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