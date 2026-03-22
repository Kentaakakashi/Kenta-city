const buildings = [
  {
    id: "home",
    name: "Kenta House",
    type: "about me",
    district: "About Avenue",
    x: 6,
    y: 14,
    width: 24,
    height: 20,
    description:
      "A cozy little base where the user learns who you are, what you build, and why this entire city exists instead of a normal portfolio like a sane person.",
    cards: [
      {
        label: "profile",
        title: "Who am I?",
        text: "I'm Kenta. I like building cool digital stuff that feels alive instead of dead little boxes on a screen."
      },
      {
        label: "current arc",
        title: "What I'm doing",
        text: "Learning web dev from basically zero and building this city-style portfolio step by step on a phone."
      },
      {
        label: "energy",
        title: "Vibe check",
        text: "I want my work to feel fun, stylish, interactive, and memorable, not corporate drywall."
      },
      {
        label: "goals",
        title: "What I want",
        text: "Make people click my bio link and instantly think: damn, this guy actually cooked."
      }
    ]
  },
  {
    id: "projects",
    name: "Project Tower",
    type: "projects",
    district: "Project Plaza",
    x: 37,
    y: 10,
    width: 22,
    height: 28,
    description:
      "The main flex building. This is where your best work goes, your featured builds, your current experiments, and the stuff that proves you do more than install themes and pray.",
    cards: [
      {
        label: "featured",
        title: "Main project",
        text: "Put your best project here later with a screenshot, short pitch, and what stack you used."
      },
      {
        label: "lab notes",
        title: "Currently building",
        text: "This city website itself can be your first featured project. Very meta. Very annoying. Very effective."
      },
      {
        label: "stack",
        title: "Stuff I'm using",
        text: "HTML, CSS, JavaScript, GitHub, Netlify, patience, rage, and occasional divine intervention."
      },
      {
        label: "future",
        title: "Next upgrades",
        text: "Animations, better interiors, sound toggle, minimap polish, hidden unlockables, and prettier buildings."
      }
    ]
  },
  {
    id: "socials",
    name: "Social Café",
    type: "socials",
    district: "Social Street",
    x: 71,
    y: 37,
    width: 22,
    height: 18,
    description:
      "A little social hub where people can find your links, your online identity, and whatever corners of the internet you're lurking in.",
    cards: [
      {
        label: "links",
        title: "Where to find me",
        list: ["Discord", "GitHub", "Instagram", "Whatever else you actually want public"]
      },
      {
        label: "status",
        title: "Current status",
        text: "Probably building something, fixing something, or pretending not to be annoyed while fixing it."
      },
      {
        label: "contact",
        title: "Message me",
        text: "Later you can turn this into clickable buttons or icons with real profile links."
      },
      {
        label: "note",
        title: "Bio link mission",
        text: "This section exists so nobody has to hunt your socials like they’re chasing side quests."
      }
    ]
  },
  {
    id: "otaku",
    name: "Otaku Arcade",
    type: "anime & games",
    district: "Otaku Lane",
    x: 10,
    y: 67,
    width: 24,
    height: 18,
    description:
      "A louder, more chaotic building for your favorite anime, games, characters, opinions, and the stuff that gives your site actual personality.",
    cards: [
      {
        label: "anime",
        title: "Favorite anime",
        list: ["Put your top anime here", "Put your current watch here", "Put your hottest take here"]
      },
      {
        label: "games",
        title: "Game taste",
        text: "Use this space for the games you play, the kinds you want to build, or the worlds you obsess over."
      },
      {
        label: "characters",
        title: "Character wall",
        text: "This can become a poster shelf or favorite character panel later when we make interiors prettier."
      },
      {
        label: "energy",
        title: "Why this room exists",
        text: "Because sites with no personality feel like a bank login page, and we are not doing that."
      }
    ]
  },
  {
    id: "secret",
    name: "Back Alley",
    type: "secret",
    district: "???",
    x: 78,
    y: 10,
    width: 16,
    height: 16,
    description:
      "You found the hidden spot. Congratulations. You clicked the suspicious thing in the dark corner like every horror movie victim, but this time it paid off.",
    secret: true,
    cards: [
      {
        label: "classified",
        title: "Hidden room unlocked",
        text: "This is where you can put private lore, jokes, weird facts, future plans, or a cursed little easter egg page."
      },
      {
        label: "idea",
        title: "Good use for this",
        text: "Make this room reward curiosity. Hidden quotes, weird stats, fake system logs, or a secret project teaser."
      },
      {
        label: "warning",
        title: "Do not trust the alley",
        text: "Or do. It's your site. Cause problems with intent."
      }
    ]
  }
];

const buildingsLayer = document.getElementById("buildingsLayer");
const cityView = document.getElementById("cityView");
const interiorView = document.getElementById("interiorView");
const backButton = document.getElementById("backButton");
const themeToggle = document.getElementById("themeToggle");
const secretTrigger = document.getElementById("secretTrigger");

const interiorDistrict = document.getElementById("interiorDistrict");
const interiorTitle = document.getElementById("interiorTitle");
const interiorDescription = document.getElementById("interiorDescription");
const interiorMiniCards = document.getElementById("interiorMiniCards");

let activeBuildingId = null;
let isNightMode = true;

function createBuildingElement(building) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "building";
  button.dataset.id = building.id;
  button.style.left = `${building.x}%`;
  button.style.top = `${building.y}%`;
  button.style.width = `${building.width}%`;
  button.style.height = `${building.height}%`;
  button.setAttribute("aria-label", `Enter ${building.name}`);

  button.innerHTML = `
    <p class="building-type">${building.type}</p>
    <p class="building-name">${building.name}</p>
  `;

  button.addEventListener("click", () => openInterior(building.id));

  return button;
}

function renderBuildings() {
  buildingsLayer.innerHTML = "";

  buildings
    .filter((building) => !building.secret)
    .forEach((building) => {
      const element = createBuildingElement(building);
      buildingsLayer.appendChild(element);
    });
}

function buildMiniCard(card, index, isSecret) {
  const cardElement = document.createElement("article");
  const extraClass = index === 0 ? "tall" : "";
  const secretClass = isSecret ? " secret-card" : "";

  cardElement.className = `mini-card ${extraClass}${secretClass}`.trim();

  const content = card.list
    ? `<ul>${card.list.map((item) => `<li>${item}</li>`).join("")}</ul>`
    : `<p>${card.text}</p>`;

  cardElement.innerHTML = `
    <span class="mini-card-label">${card.label}</span>
    <h3>${card.title}</h3>
    ${content}
  `;

  return cardElement;
}

function openInterior(buildingId) {
  const building = buildings.find((item) => item.id === buildingId);
  if (!building) return;

  activeBuildingId = buildingId;

  document.querySelectorAll(".building").forEach((element) => {
    element.classList.toggle("is-active", element.dataset.id === buildingId);
  });

  interiorDistrict.textContent = building.district;
  interiorTitle.textContent = building.name;
  interiorDescription.textContent = building.description;

  interiorMiniCards.innerHTML = "";
  building.cards.forEach((card, index) => {
    const element = buildMiniCard(card, index, Boolean(building.secret));
    interiorMiniCards.appendChild(element);
  });

  cityView.classList.remove("active");
  interiorView.classList.add("active");
  interiorView.setAttribute("aria-hidden", "false");
  cityView.setAttribute("aria-hidden", "true");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goBackToCity() {
  activeBuildingId = null;

  document.querySelectorAll(".building").forEach((element) => {
    element.classList.remove("is-active");
  });

  interiorView.classList.remove("active");
  cityView.classList.add("active");
  interiorView.setAttribute("aria-hidden", "true");
  cityView.setAttribute("aria-hidden", "false");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleTheme() {
  isNightMode = !isNightMode;
  document.body.classList.toggle("day-mode", !isNightMode);
  themeToggle.textContent = isNightMode ? "Night mode" : "Day mode";
}

backButton.addEventListener("click", goBackToCity);
themeToggle.addEventListener("click", toggleTheme);
secretTrigger.addEventListener("click", () => openInterior("secret"));

renderBuildings();
themeToggle.textContent = "Night mode";
