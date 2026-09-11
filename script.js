// ========================================
// SHUMKAR FIXED GEAR CALCULATOR
// ========================================

// ========================================
// ELEMENTS
// ========================================

const chainring = document.getElementById("chainring");
const sprocket = document.getElementById("sprocket");
const tire = document.getElementById("tire");
const ambidextrous = document.getElementById("ambidextrous");

const ratioOutput = document.getElementById("ratio");
const skidOutput = document.getElementById("skid");
const developmentOutput = document.getElementById("development");

const gearList = document.querySelector(".gear-list");

const speedCells = document.querySelectorAll(".speed-grid > div");

const unitInputs = document.querySelectorAll('input[name="units"]');

const languageInputs = document.querySelectorAll('input[name="language"]');

const aboutLink = document.getElementById("aboutLink");
const aboutModal = document.getElementById("aboutModal");
const closeAbout = document.getElementById("closeAbout");

// ========================================
// TRANSLATIONS
// ========================================

const translations = {
  en: {
    settings: "Settings",
    analysis: "Analysis",
    chainring: "Chain ring",
    sprocket: "Rear sprocket",
    tire: "Tire",
    ambidextrous: "Ambidextrous skid",
    ratio: "Ratio:",
    skid: "Skid patch:",
    development: "Development:",
    equivalent: "Equivalent gear ±2%",
    cadence: "Cadence / Speed",
    about: "About",
    aboutTitle: "About Shumkar",
    aboutText:
      "Shumkar Fixed Gear Calculator is a simple tool for calculating fixed gear ratios, skid patches, development and cadence speed.",
    aboutRatio: "Chainring divided by rear sprocket.",
    aboutSkid:
      "Theoretical positions where the rear tire can contact the road during a skid.",
    aboutDevelopment: "Distance traveled by the bicycle per crank revolution.",
    version: "Shumkar Fixed Gear Calculator · v1.0",
  },

  ru: {
    settings: "Настройки",
    analysis: "Анализ",
    chainring: "Передняя звезда",
    sprocket: "Задняя звезда",
    tire: "Покрышка",
    ambidextrous: "Skid обеими ногами",
    ratio: "Передаточное отношение:",
    skid: "Пятна skid:",
    development: "Развитие:",
    equivalent: "Эквивалентные передачи ±2%",
    cadence: "Каденс / Скорость",
    about: "О проекте",
    aboutTitle: "О Shumkar",
    aboutText:
      "Shumkar Fixed Gear Calculator — простой инструмент для расчёта передаточного отношения, skid patches, развития и скорости в зависимости от каденса.",
    aboutRatio:
      "Количество зубьев передней звезды, делённое на количество зубьев заднего ког.",
    aboutSkid:
      "Теоретические положения, в которых задняя покрышка может контактировать с дорогой во время skid.",
    aboutDevelopment:
      "Расстояние, которое велосипед проходит за один оборот шатуна.",
    version: "Shumkar Fixed Gear Calculator · v1.0",
  },

  ky: {
    settings: "Жөндөөлөр",
    analysis: "Талдоо",
    chainring: "Алдыңкы жылдызча",
    sprocket: "Арткы жылдызча",
    tire: "Дөңгөлөк",
    ambidextrous: "Эки бут менен skid",
    ratio: "Берүү катышы:",
    skid: "Skid тактары:",
    development: "Өнүгүү:",
    equivalent: "Эквиваленттүү берүүлөр ±2%",
    cadence: "Каденс / Ылдамдык",
    about: "Долбоор жөнүндө",
    aboutTitle: "Shumkar жөнүндө",
    aboutText:
      "Shumkar Fixed Gear Calculator — фикс-гир велосипеди үчүн берүү катышын, skid patches, өнүгүүнү жана каденске жараша ылдамдыкты эсептеген жөнөкөй курал.",
    aboutRatio:
      "Алдыңкы жылдызчанын тиштеринин санын арткы когдун тиштеринин санына бөлүү.",
    aboutSkid:
      "Skid учурунда арткы дөңгөлөктүн жолго тийиши мүмкүн болгон теориялык позициялар.",
    aboutDevelopment: "Шатундун бир айлануусунда велосипед басып өткөн аралык.",
    version: "Shumkar Fixed Gear Calculator · v1.0",
  },
};

// ========================================
// LANGUAGE
// ========================================

function changeLanguage(language) {
  const dictionary = translations[language];

  if (!dictionary) {
    return;
  }

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;

    if (dictionary[key]) {
      element.textContent = dictionary[key];
    }
  });

  // Save language
  localStorage.setItem("shumkar-language", language);
}

// ========================================
// LOAD LANGUAGE
// ========================================

function loadLanguage() {
  const savedLanguage = localStorage.getItem("shumkar-language");

  const language = savedLanguage || "en";

  const input = document.querySelector(
    `input[name="language"][value="${language}"]`,
  );

  if (input) {
    input.checked = true;
  }

  changeLanguage(language);
}

// ========================================
// ABOUT MODAL
// ========================================

if (aboutLink && aboutModal && closeAbout) {

  aboutLink.addEventListener("click", (event) => {

    event.preventDefault();

    aboutModal.classList.add("active");

  });


  closeAbout.addEventListener("click", () => {

    aboutModal.classList.remove("active");

  });


  aboutModal.addEventListener("click", (event) => {

    if (event.target === aboutModal) {
      aboutModal.classList.remove("active");
    }

  });

}


document.addEventListener("keydown", (event) => {

  if (event.key === "Escape" && aboutModal) {

    aboutModal.classList.remove("active");

  }

});

// ========================================
// HELPERS
// ========================================

function getNumber(value) {
  return parseFloat(value);
}

function gcd(a, b) {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }

  return Math.abs(a);
}

// ========================================
// TIRE
// ========================================

function getTireWidth() {
  const match = tire.value.match(/x(\d+)C/);

  if (!match) {
    return 25;
  }

  return Number(match[1]);
}

function getWheelDiameter() {
  // 700C BSD
  const rimDiameter = 622;

  const tireWidth = getTireWidth();

  return rimDiameter + tireWidth * 2;
}

function getWheelCircumference() {
  const diameter = getWheelDiameter();

  return (Math.PI * diameter) / 1000;
}

// ========================================
// RATIO
// ========================================

function calculateRatio(front, rear) {
  return front / rear;
}

// ========================================
// SKID PATCHES
// ========================================

function calculateSkidPatches(front, rear) {
  /*
        Theoretical skid patches.

        Example:

        49 × 17
        gcd = 1

        17 / 1 = 17 patches
    */

  const common = gcd(front, rear);

  const normalPatches = rear / common;

  /*
        Ambidextrous skid means
        both crank positions can be used.
    */

  if (ambidextrous.checked) {
    return normalPatches * 2;
  }

  return normalPatches;
}

// ========================================
// DEVELOPMENT
// ========================================

function calculateDevelopment(circumference, ratio) {
  return circumference * ratio;
}

// ========================================
// SPEED
// ========================================

function calculateSpeed(development, cadence, unit) {
  const metersPerHour = development * cadence * 60;

  if (unit === "metric") {
    return metersPerHour / 1000;
  }

  return metersPerHour / 1609.344;
}

// ========================================
// UNIT
// ========================================

function getUnit() {
  const checked = document.querySelector('input[name="units"]:checked');

  if (!checked) {
    return "imperial";
  }

  const units = Array.from(unitInputs);

  const index = units.indexOf(checked);

  return index === 1 ? "metric" : "imperial";
}

// ========================================
// EQUIVALENT GEARS
// ========================================

function calculateEquivalentGears(currentRatio) {
  gearList.innerHTML = "";

  for (let front = 28; front <= 59; front++) {
    for (let rear = 9; rear <= 23; rear++) {
      const ratio = front / rear;

      const difference = (Math.abs(ratio - currentRatio) / currentRatio) * 100;

      if (difference <= 2) {
        const button = document.createElement("button");

        button.textContent = `${front}×${rear}`;

        button.title = `Ratio: ${ratio.toFixed(2)}
Difference: ${difference.toFixed(2)}%`;

        button.addEventListener("click", () => {
          chainring.value = `${front} T`;

          sprocket.value = `${rear} T`;

          calculate();
        });

        gearList.appendChild(button);
      }
    }
  }
}

// ========================================
// CADENCE / SPEED
// ========================================

function calculateSpeeds(development) {
  const cadences = [50, 60, 70, 80, 90, 100, 110, 120, 130];

  const unit = getUnit();

  const speedUnit = unit === "metric" ? "km/h" : "mph";

  speedCells.forEach((cell, index) => {
    const cadence = cadences[index];

    if (cadence === undefined) {
      return;
    }

    const speed = calculateSpeed(development, cadence, unit);

    cell.innerHTML = `
                ${speed.toFixed(1)} ${speedUnit}
                <small>@${cadence} rpm</small>
            `;
  });
}

// ========================================
// MAIN CALCULATOR
// ========================================

function calculate() {
  const front = getNumber(chainring.value);

  const rear = getNumber(sprocket.value);

  if (!front || !rear) {
    return;
  }

  // Ratio
  const ratio = calculateRatio(front, rear);

  ratioOutput.textContent = ratio.toFixed(2);

  // Skid patches
  const skidPatches = calculateSkidPatches(front, rear);

  skidOutput.textContent = skidPatches;

  // Wheel
  const circumference = getWheelCircumference();

  // Development
  const development = calculateDevelopment(circumference, ratio);

  developmentOutput.textContent = development.toFixed(2) + " m";

  // Equivalent gears
  calculateEquivalentGears(ratio);

  // Speed
  calculateSpeeds(development);
}

// ========================================
// EVENTS
// ========================================

// Gear settings

chainring.addEventListener("change", calculate);

sprocket.addEventListener("change", calculate);

tire.addEventListener("change", calculate);

ambidextrous.addEventListener("change", calculate);

// Units

unitInputs.forEach((input) => {
  input.addEventListener("change", calculate);
});

// Languages

languageInputs.forEach((input) => {
  input.addEventListener("change", () => {
    changeLanguage(input.value);
  });
});

// ========================================
// START
// ========================================

loadLanguage();

calculate();
