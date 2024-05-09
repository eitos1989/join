
// Funktion um die Animation zu erstellen und auszuführen für die Erfolgreiche Erstellung eines Kontakts
function showSuccessAnimation() {
  let button = document.createElement('div');
  button.style.display = 'block';
  button.className = 'button_succesful';
  if (button.dataset.action === 'create') {
    button.textContent = 'Create contact successful';
  } else if (button.dataset.action === 'edit') {
    button.textContent = 'Edit contact successful';
  }
  // Selektiert das 'contact_content' Element und fügt den Button hinzu
  let contactContent = document.querySelector('.contact_content');
  contactContent.appendChild(button);

  button.addEventListener('animationend', function() {
    // Check if the animation name is 'slideOut'
    if (event.animationName === 'slideOut') {
      button.remove();
    }
  });
}
//erstellt overlay für contact_card
function createOverlay() {
  let overlay = document.createElement("div");
  overlay.className = "overlay";
  document.body.appendChild(overlay);
  return overlay;
}

//erstellt eine card in der das Template gerändert wird
function createCardElement() {
  let card = document.createElement("div");
  card.className = "card_template";
  card.innerHTML = createCardHTML();
  document.body.appendChild(card);
  return card;
}
//slide out animation für card
function addSlideOutAnimation(card, overlay) {
  overlay.addEventListener("click", function () {
    card.classList.add("slide-out");
    setTimeout(function () {
      overlay.remove();
      card.remove();
    }, 125);
  });
}

function createCard() {
  let overlay = createOverlay();
  let card = createCardElement();
  addSlideOutAnimation(card, overlay);

  // Event-Listener für den "Create contact" Button
  card.querySelector('.contact_details_collumn').addEventListener('submit', function(event) {
    event.preventDefault();
    // Führt die Animation aus und entfernt das Overlay und die Karte
    card.classList.add('slide-out');
    card.addEventListener('animationend', function() {
      overlay.remove();
      card.remove();

      // Zeigt die Erfolgsanimation an
      showSuccessAnimation();
      

    });
  });
}

//Funktion um die Contact Details zu erstellen und die Namen und Emails anzuzeigen
function createContactDetails(name, email) {
  let details = document.createElement("div");
  details.className = "flex_col";

  let nameElement = document.createElement("h2");
  nameElement.textContent = name;
  details.appendChild(nameElement);

  let emailElement = document.createElement("a");
  emailElement.href = `mailto:${email}`;
  emailElement.textContent = email;
  details.appendChild(emailElement);

  return details;
}
// Funktion um das Contact Element zu erstellen und die Badge und Details anzuzeigen
function createContactElement(contact) {
  let contactElement = document.createElement("div");
  contactElement.className = "contact";
  contactElement.dataset.id = contact.id;

  let badge = createContactBadge(contact); // Pass the entire contact object
  contactElement.appendChild(badge);

  let details = createContactDetails(contact.name, contact.email);
  contactElement.appendChild(details);

  // Event-Listener hinzufügen
  contactElement.addEventListener("click", function() {
    updateContactDetails(contact);
  });

  return contactElement;
}
//template für die Detailansicht eines Contacts
function renderContactDetails(contact) {
  return `
    <div class="user_row">
      <div class="profil_badge_big" style="background-color: ${contact.color};"><h1>${contact.name[0].toUpperCase() + contact.name.split(" ")[1][0].toUpperCase()}</h1></div>
      <div class="flex_col">
        <h2>${contact.name}</h2>
        <div class="flex_row">
          <img src="./img/edit_pen_white.svg" alt="edit_pen_img" onclick="editContact('${contact.id}')" />
          <img src="./img/delete_basket_white.svg" alt="delete_img" onclick="removeContact('${contact.id}')" />
        </div>
      </div>
    </div>
    <h3 class="Contact_information_headline">Contact Information</h3>
    <h4 class="email_and_number">Email</h4>
    <a href="mailto:${contact.email}">${contact.email}</a>
    <h4 class="email_and_number">Phone</h4>
    <a href="tel:${contact.phone}">${contact.phone}</a>
  `;
}

//überarbeitet den main bereich der angeklickten Contact Details
function updateContactDetails(contact) {
  let contactContent = document.querySelector(".contact_content");
  contactContent.innerHTML = renderContactDetails(contact);
  updateActiveContact(contact);
}

//fügt eine 'active' Klasse zum angeklickten Kontakt hinzu
function updateActiveContact(contact) {
  // Remove the 'active' class from all contact divs
  let contactElements = document.querySelectorAll(".contact");
  contactElements.forEach(function(contactElement) {
    contactElement.classList.remove("active");
  });

  // Add the 'active' class to the selected contact
  let activeContactElement = document.querySelector(`.contact[data-id="${contact.id}"]`);
  if (activeContactElement) {
    activeContactElement.classList.add("active");
  }
}

//diese Funktion leert das Sidepanel
function clearSidePanel() {
  let contactContainer = document.querySelector(".contact_container");
  while (contactContainer.firstChild) {
    contactContainer.firstChild.remove();
  }
}

//diese Funktion erstellt den Buchstaben für die Contact Elemente
function createLetterElement(name) {
  let letter = document.createElement("div");
  letter.className = "letter";
  letter.innerHTML = `<h2>${name[0].toUpperCase()}</h2>`;
  return letter;
}

// diese Funktion erstellt den Grauen Seperator zwischen den Contact Elementen
function createSeparatorElement() {
  let separator = document.createElement("div");
  separator.className = "grey_seperator_1";
  return separator;
}

function createAndAppendLetterAndSeparator(contactContainer, name) {
  let letter = createLetterElement(name);
  letter.classList.add(`letter-${name[0].toUpperCase()}`);
  contactContainer.appendChild(letter);

  let separator = createSeparatorElement();
  contactContainer.appendChild(separator);
}

function createAndAppendContact(contactContainer, contact) {
  let contactElement = createContactElement(contact);
  contactContainer.appendChild(contactElement);
}

function renderContactsInSidePanel() {
  let contactContainer = document.querySelector(".contact_container");
  if (!contactContainer) {
    console.error("Contact container not found");
    return;
  }
  clearSidePanel();
  // Sort contacts alphabetically by name
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  let currentLetter = "";
  for (let contact of contacts) {
    if (contact.name && contact.name.includes(" ")) {
      let firstLetterOfName = contact.name[0].toUpperCase();
      if (firstLetterOfName !== currentLetter) {
        currentLetter = firstLetterOfName;
        createAndAppendLetterAndSeparator(contactContainer, contact.name);
      }
    }
    createAndAppendContact(contactContainer, contact);
  }
}


//generiert zufällige Farbe und returnt sie
function getRandomColor() {
  let randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

// diese FUnktion erstellt das Badge für die Contact Elemente es nimmt den ersten Buchstaben des Vornamens und des Nachnamens diese werden dann in Großbuchstaben umgewandelt und als Badge angezeigt mit einer Random Color
function createContactBadge(contact) {
  let badge = document.createElement("div");
  badge.className = "profil_badge";
  if (contact && contact.name) { // Überprüfen Sie, ob der Kontakt und sein Name existieren
    let names = contact.name.split(" ");
    if (names.length > 1) {
      badge.textContent = names[0][0].toUpperCase() + names[1][0].toUpperCase();
    } else if (names.length === 1) {
      badge.textContent = names[0][0].toUpperCase();
    }
    badge.style.backgroundColor = contact.color; // Use the color from the contact object
  }
  return badge;
}

function addHoverEffect(selector, hoverImagePath, originalImagePath) {
  const contactContent = document.querySelector(".contact_content");

  contactContent.addEventListener("mouseover", function (event) {
    if (event.target.matches(selector)) {
      event.target.src = hoverImagePath;

      event.target.addEventListener("mouseleave", function () {
        event.target.src = originalImagePath;
      }, { once: true });
    }
  });
}

addHoverEffect(
  'img[src="./img/edit_pen_white.svg"]',
  "./img/edit_pen_blue.svg",
  "./img/edit_pen_white.svg"
);
addHoverEffect(
  'img[src="./img/delete_basket_white.svg"]',
  "./img/delete_basket_blue.svg",
  "./img/delete_basket_white.svg"
);

//Kommunikation mit Backend
const BASE_URL = "https://contact-storage-f1196-default-rtdb.europe-west1.firebasedatabase.app/"

async function saveContact(event) {
  event.preventDefault();
  // Kontaktinformationen sammeln
  let contact = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    color: getRandomColor(),
  };

  // Kontakt zur Datenbank hinzufügen und ID erhalten
  let id = await addContactToDatabase(contact);
  contact.id = id; // Fügen Sie die ID dem Kontaktobjekt hinzu

  // Kontakt zum lokalen Array hinzufügen und Ansicht aktualisieren
  contacts.push(contact);
  renderContactsInSidePanel();
}


async function getContacts() {
  let response = await fetch(BASE_URL + "/contacts.json");
  let data = await response.json();
  let contacts = [];
  for (let id in data) {
    let contact = data[id];
    if (contact) { // Überprüfen Sie, ob der Kontakt existiert
      contact.id = id; // Add the ID to the contact object
      contacts.push(contact);
    }
  }
  return contacts;
}

async function addContactToDatabase(contact) {
  let response = await fetch(BASE_URL + "/contacts.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });
  let responseData = await response.json();
  return responseData.name; // Firebase generiert eine eindeutige ID, die hier zurückgegeben wird
}

async function loadContacts() {
  // Fetch contacts from the database
  let response = await getContacts();
  // Update the local contacts array
  contacts = response.map((contact) => {
    // If the contact doesn't have a color, assign a random one
    if (!contact.color) {
      contact.color = getRandomColor();
    }
    return contact;
  });
  renderContactsInSidePanel();
}

async function removeContact(id) {
  // Remove the contact from the database
  await fetch(BASE_URL + "/contacts/" + id + ".json", {
    method: "DELETE"
  });
  // Remove the contact from the local contacts array
  contacts = contacts.filter(contact => contact.id !== id);
  // Clear the contact content div
  let contactContent = document.querySelector(".contact_content");
  contactContent.innerHTML = '';
  // Re-render the contacts in the side panel
  renderContactsInSidePanel();
}

const FORM_SELECTOR = '.contact_details_collumn';
const CANCEL_BUTTON_SELECTOR = '.cancel_but';
const SAVE_BUTTON_SELECTOR = '.create__contact_but';

async function editContact(id) {
  await createCard();
  let contact = findContactById(id);
  fillFormWithContactInfo(contact);
  setFormSubmitEventToUpdateContact(id);
  setButtonActions(contact.id);
}

function findContactById(id) {
  return contacts.find(contact => contact.id === id);
}

function fillFormWithContactInfo(contact) {
  let nameInput = document.getElementById('name');
  let emailInput = document.getElementById('email');
  let phoneInput = document.getElementById('phone');
  nameInput.value = contact.name;
  emailInput.value = contact.email;
  phoneInput.value = contact.phone;
}

function setFormSubmitEventToUpdateContact(id) {
  let form = document.querySelector(FORM_SELECTOR);
  form.onsubmit = function(event) {
    event.preventDefault();
    updateContact(id);
  };
}

function setButtonActions(contactId) {
  let cancelButton = document.querySelector(CANCEL_BUTTON_SELECTOR);
  let saveButton = document.querySelector(SAVE_BUTTON_SELECTOR);
  cancelButton.innerHTML = 'Delete';
  cancelButton.onclick = function() { removeContact(contactId); };
  saveButton.innerHTML = 'Save <img src="./img/create_contact_check.svg" alt="Save_button_img" />';
  saveButton.addEventListener('click', function(event) {
    event.target.textContent = 'Contact updated successful';
  });
}


async function updateContact(id) {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let phone = document.getElementById('phone').value;
  let contact = contacts.find(contact => contact.id === id);
  contact.name = name;
  contact.email = email;
  contact.phone = phone;
  await fetch(BASE_URL + "/contacts/" + id + ".json", {
    method: "PUT",
    body: JSON.stringify(contact)
  });
  renderContactsInSidePanel();
  updateContactDetails(contact);
}

function closeCard() {
  let card = document.querySelector('.card_template');
  let overlay = document.querySelector('.overlay');
  overlay.remove();
  card.remove();
}