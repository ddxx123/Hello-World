const cardsData = [
  {
    name: "Avery Kim",
    role: "Product Designer",
    location: "New York, USA",
    team: "Design",
  },
  {
    name: "Luca Romano",
    role: "Frontend Engineer",
    location: "Milan, Italy",
    team: "Engineering",
  },
  {
    name: "Nia Patel",
    role: "QA Analyst",
    location: "London, UK",
    team: "Quality",
  },
];

const cardGrid = document.getElementById("card-grid");

const cardMarkup = cardsData
  .map(
    ({ name, role, location, team }) => `
      <article class="card">
        <h2>${name}</h2>
        <p>${role}</p>
        <p>${location}</p>
        <span class="tag">${team}</span>
      </article>
    `
  )
  .join("");

cardGrid.innerHTML = cardMarkup;
