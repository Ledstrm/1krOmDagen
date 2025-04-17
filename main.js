document.addEventListener("DOMContentLoaded", function() {
    const menuButton = document.getElementById("open-menu");
    const closeButton = document.getElementById("close-menu");
    const sideMenu = document.getElementById("side-menu");
    const overlay = document.getElementById("overlay");

    menuButton.addEventListener("click", function() {
        sideMenu.classList.add("active");
        overlay.classList.add("active");
    });

    closeButton.addEventListener("click", function() {
        sideMenu.classList.remove("active");
        overlay.classList.remove("active");
    });

    overlay.addEventListener("click", function() {
        sideMenu.classList.remove("active");
        overlay.classList.remove("active");
    });
});

// för dolt extrainnehåll i informationskort
document.querySelectorAll('.card-link').forEach(button => {
  button.addEventListener('click', () => {
    const extraContent = button.previousElementSibling;
    extraContent.classList.toggle('expanded');

    if (extraContent.classList.contains('expanded')) {
      button.textContent = '';
    } else {
      button.textContent = 'Läs mer';
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('org-container');
  let jsonData = []; // Skapa en variabel för att lagra JSON-data

  // Hämta organisationer från JSON-fil
  fetch('organisationer.json')
    .then(response => {
      if (!response.ok) throw new Error('Kunde inte hämta data');
      return response.json();
    })
    .then(data => {
      jsonData = data; // Spara data i global variabel
      displayOrganizations(jsonData); // Visa alla organisationer vid initial visning
    })
    .catch(error => {
      container.innerHTML = `<p style="color:red;">${error.message}</p>`;
    });

  // Filtrering av kategorier
  document.getElementById('category-filter').addEventListener('change', filterOrganizations);


  // Funktion för att visa organisationer
  function displayOrganizations(organizations) {
    const orgContainer = document.getElementById('org-container');
    orgContainer.innerHTML = ''; // Rensa tidigare visade organisationer

    organizations.forEach(grupp => {
      const groupSection = document.createElement('section');
      groupSection.classList.add('category-section'); // Lägg till klass för kategorin
      groupSection.innerHTML = `<h2>${grupp.kategori}</h2>`;

      const grid = document.createElement('div');
      grid.classList.add('grid-container');

      grupp.organisationer.forEach(org => {
        const card = document.createElement('div');
        card.classList.add('org-card');
        card.dataset.category = org.kategori; // Sätt rätt kategori på varje card

        card.innerHTML = `
          <img src="${org.bild}" alt="${org.namn}" />
          <h3>${org.namn}</h3>
          <p>${org.beskrivning}</p>
          <a href="${org.url}" target="_blank" class="extern-lank">Läs mer</a>
        `;

      // Hämta länken och lägg till en eventlyssnare för bekräftelse
      const link = card.querySelector('.extern-lank');
      link.addEventListener('click', function(event) {
        event.preventDefault(); // Stoppa omedelbar navigering
        const confirmRedirect = confirm("Du är på väg att lämna sidan. Vill du fortsätta till en extern sida?");
        if (confirmRedirect) {
          window.open(this.href, '_blank');
        }
      });

      grid.appendChild(card);
    });

    groupSection.appendChild(grid);
    orgContainer.appendChild(groupSection);
  });
}

  // Filtrera organisationer baserat på kategori
  function filterOrganizations() {
    const category = document.getElementById('category-filter').value;
    const sections = document.querySelectorAll('.category-section'); // Hämta alla sektioner för kategorier

    // Om "Visa alla" är valt, visa alla sektioner, annars visa bara den valda kategorin
    sections.forEach(section => {
      if (category === "" || section.querySelector('h2').textContent === category) {
        section.style.display = 'block'; // Visa sektionen
      } else {
        section.style.display = 'none'; // Dölja sektionen
      }
    });
  }
});