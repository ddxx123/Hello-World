const flashcards = [
  {
    term: "Superior (Cranial)",
    definition: "Toward the head or upper part of a structure."
  },
  {
    term: "Inferior (Caudal)",
    definition: "Away from the head or toward the lower part of a structure."
  },
  {
    term: "Anterior (Ventral)",
    definition: "Toward the front of the body."
  },
  {
    term: "Posterior (Dorsal)",
    definition: "Toward the back of the body."
  },
  {
    term: "Medial",
    definition: "Toward the body's midline."
  },
  {
    term: "Lateral",
    definition: "Away from the body's midline."
  },
  {
    term: "Intermediate",
    definition: "Between a more medial and a more lateral structure."
  },
  {
    term: "Proximal",
    definition: "Nearer to the trunk or point of origin."
  },
  {
    term: "Distal",
    definition: "Farther from the trunk or point of origin."
  },
  {
    term: "Superficial",
    definition: "Toward or at the body surface."
  },
  {
    term: "Deep",
    definition: "Away from the body surface; more internal."
  },
  {
    term: "Ipsilateral / Contralateral",
    definition: "Ipsilateral = same side of body; contralateral = opposite sides."
  }
];

const matchingTerms = [
  ["Superior", "Toward the head or upper part"],
  ["Inferior", "Toward the feet or lower part"],
  ["Anterior", "Toward the front of the body"],
  ["Posterior", "Toward the back of the body"],
  ["Medial", "Toward the midline"],
  ["Lateral", "Away from the midline"],
  ["Proximal", "Nearer to the point of attachment"],
  ["Distal", "Farther from the point of attachment"],
  ["Superficial", "Toward the body surface"],
  ["Deep", "Away from the body surface"]
];

const quizQuestions = [
  {
    question: "In anatomical position, the palms face:",
    options: ["Backward", "Forward", "Toward each other", "Downward"],
    answer: "Forward"
  },
  {
    question: "Which statement is part of the anatomical position?",
    options: [
      "Feet crossed and toes outward",
      "Feet shoulder-width apart with toes forward",
      "Elbows flexed with palms inward",
      "Body lying supine"
    ],
    answer: "Feet shoulder-width apart with toes forward"
  },
  {
    question: "The sternum is ____ to the vertebral column.",
    options: ["Posterior", "Distal", "Anterior", "Inferior"],
    answer: "Anterior"
  },
  {
    question: "The elbow is ____ to the wrist.",
    options: ["Distal", "Proximal", "Lateral", "Superficial"],
    answer: "Proximal"
  },
  {
    question: "A skin abrasion is usually ____ to the skeletal muscles.",
    options: ["Deep", "Superior", "Superficial", "Contralateral"],
    answer: "Superficial"
  }
];

let activeCardIndex = 0;
let isFlipped = false;

const flashcardEl = document.getElementById("flashcard");
const cardFrontEl = document.getElementById("cardFront");
const cardBackEl = document.getElementById("cardBack");
const cardHintEl = document.getElementById("cardHint");
const cardIndexEl = document.getElementById("cardIndex");

function renderCard() {
  const card = flashcards[activeCardIndex];
  cardFrontEl.textContent = card.term;
  cardBackEl.textContent = card.definition;
  isFlipped = false;
  cardFrontEl.classList.remove("hidden");
  cardBackEl.classList.add("hidden");
  cardHintEl.textContent = "Click or press Enter/Space to flip";
  cardIndexEl.textContent = `Card ${activeCardIndex + 1} of ${flashcards.length}`;
}

function flipCard() {
  isFlipped = !isFlipped;
  cardFrontEl.classList.toggle("hidden", isFlipped);
  cardBackEl.classList.toggle("hidden", !isFlipped);
  cardHintEl.textContent = isFlipped
    ? "Showing definition"
    : "Showing term";
}

document.getElementById("nextCard").addEventListener("click", () => {
  activeCardIndex = (activeCardIndex + 1) % flashcards.length;
  renderCard();
});

document.getElementById("prevCard").addEventListener("click", () => {
  activeCardIndex = (activeCardIndex - 1 + flashcards.length) % flashcards.length;
  renderCard();
});

document.getElementById("shuffleBtn").addEventListener("click", () => {
  for (let i = flashcards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
  }
  activeCardIndex = 0;
  renderCard();
});

flashcardEl.addEventListener("click", flipCard);
flashcardEl.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    flipCard();
  }
});

const matchingGridEl = document.getElementById("matchingGrid");

function renderMatching() {
  const meanings = matchingTerms
    .map(([, meaning]) => meaning)
    .sort(() => Math.random() - 0.5);

  matchingGridEl.innerHTML = "";

  matchingTerms.forEach(([term], index) => {
    const row = document.createElement("div");
    row.className = "matching-row";

    const label = document.createElement("label");
    label.textContent = term;
    label.setAttribute("for", `match-${index}`);

    const select = document.createElement("select");
    select.id = `match-${index}`;
    select.dataset.term = term;
    select.innerHTML = `<option value="">Select a meaning...</option>`;

    meanings.forEach(meaning => {
      const option = document.createElement("option");
      option.value = meaning;
      option.textContent = meaning;
      select.append(option);
    });

    row.append(label, select);
    matchingGridEl.append(row);
  });
}

function checkMatchingAnswers() {
  const selects = [...matchingGridEl.querySelectorAll("select")];
  let correct = 0;

  selects.forEach(select => {
    const term = select.dataset.term;
    const expected = matchingTerms.find(([key]) => key === term)?.[1];
    if (select.value === expected) {
      correct += 1;
    }
  });

  const feedback = document.getElementById("matchingFeedback");
  const total = matchingTerms.length;
  feedback.textContent = `You got ${correct} out of ${total} correct.`;
  feedback.className = correct === total ? "correct" : "incorrect";
}

document
  .getElementById("checkMatching")
  .addEventListener("click", checkMatchingAnswers);

document.getElementById("resetMatching").addEventListener("click", () => {
  renderMatching();
  const feedback = document.getElementById("matchingFeedback");
  feedback.textContent = "";
  feedback.className = "muted";
});

const quizForm = document.getElementById("quizForm");

function renderQuiz() {
  quizForm.innerHTML = "";

  quizQuestions.forEach((item, qIndex) => {
    const wrapper = document.createElement("fieldset");
    wrapper.className = "quiz-question";

    const legend = document.createElement("legend");
    legend.textContent = `${qIndex + 1}. ${item.question}`;

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "quiz-options";

    item.options.forEach(option => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q-${qIndex}`;
      input.value = option;
      label.append(input, ` ${option}`);
      optionsWrap.append(label);
    });

    wrapper.append(legend, optionsWrap);
    quizForm.append(wrapper);
  });
}

function submitQuiz() {
  let score = 0;

  quizQuestions.forEach((item, qIndex) => {
    const chosen = quizForm.querySelector(`input[name="q-${qIndex}"]:checked`);
    if (chosen?.value === item.answer) {
      score += 1;
    }
  });

  const result = document.getElementById("quizResult");
  result.textContent = `Quiz score: ${score} / ${quizQuestions.length}`;
  result.className = score >= quizQuestions.length - 1 ? "correct" : "incorrect";
}

document.getElementById("submitQuiz").addEventListener("click", submitQuiz);

document.getElementById("retryQuiz").addEventListener("click", () => {
  renderQuiz();
  const result = document.getElementById("quizResult");
  result.textContent = "";
  result.className = "muted";
});

renderCard();
renderMatching();
renderQuiz();
