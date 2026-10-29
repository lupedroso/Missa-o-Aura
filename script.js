
const profiles = {
  technology: {
    title: "Engenharia de Software",
    category: "TECNOLOGIA · CONSTRUÇÃO",
    image: "imagens/perfil-1.jpg",
    description:
      "Você demonstra interesse por desafios práticos, tecnologia e soluções. Engenharia de Software pode ser uma área interessante para explorar se você gosta de entender como as coisas funcionam e transformar ideias em ferramentas digitais.",
    skills: ["Lógica", "Resolução de problemas", "Tecnologia", "Criatividade"],
    extra:
      "Você também pode pesquisar desenvolvimento de aplicativos, programação e segurança digital."
  },

  science: {
    title: "Ciência e Pesquisa",
    category: "CIÊNCIA · INVESTIGAÇÃO",
    image: "imagens/perfil-2.jpg",
    description:
      "Você parece gostar de investigar, aprender e entender o que existe por trás das coisas. A ciência oferece oportunidades para fazer perguntas, analisar informações e contribuir para novas descobertas.",
    skills: ["Curiosidade", "Análise", "Investigação", "Aprendizado"],
    extra:
      "Você também pode explorar biologia, química, pesquisa ambiental e diferentes áreas científicas."
  },

  creative: {
    title: "Direção de Arte",
    category: "DESIGN · CRIATIVIDADE",
    image: "imagens/perfil-3.jpg",
    description:
      "Você demonstra afinidade com ideias originais e expressão visual. A Direção de Arte pode combinar com quem gosta de criar conceitos, identidades visuais e projetos que comunicam ideias.",
    skills: ["Criatividade", "Comunicação visual", "Imaginação", "Design"],
    extra:
      "Você também pode pesquisar Publicidade e Propaganda, Design Gráfico, fotografia e produção de conteúdo."
  },

  management: {
    title: "Gestão de Projetos",
    category: "LIDERANÇA · PLANEJAMENTO",
    image: "imagens/perfil-4.jpg",
    description:
      "Você parece se interessar por organização, planejamento e realização de objetivos. A Gestão de Projetos envolve conectar pessoas, organizar tarefas e acompanhar ideias até a conclusão.",
    skills: ["Organização", "Planejamento", "Comunicação", "Liderança"],
    extra:
      "Você também pode explorar Administração, produção de eventos, gestão de equipes e empreendedorismo."
  }
};

const form = document.getElementById("profile-form");
const nameInput = document.getElementById("name");
const birthdateInput = document.getElementById("birthdate");
const formError = document.getElementById("form-error");

const progressFill = document.getElementById("progress-fill");
const progressLabel = document.getElementById("progress-label");
const progressPercent = document.getElementById("progress-percent");

const resultsSection = document.getElementById("results");
const resultImage = document.getElementById("result-image");

const today = new Date();

const todayString = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

birthdateInput.max = todayString;
birthdateInput.min = "1900-01-01";

// Encontra a área inteira da imagem no cartão
function getImageContainer() {
  return resultImage.closest(".result-image");
}

// Atualiza o progresso das perguntas
function updateProgress() {
  let answered = 0;

  for (let i = 1; i <= 4; i++) {
    if (form.querySelector(`input[name="q${i}"]:checked`)) {
      answered++;
    }
  }

  const percentage = answered * 25;

  progressFill.style.width = `${percentage}%`;
  progressLabel.textContent = `${answered} DE 4 RESPONDIDAS`;
  progressPercent.textContent = `${percentage}%`;
}

form.addEventListener("change", (event) => {
  if (event.target.matches('input[type="radio"]')) {
    updateProgress();
    formError.textContent = "";
  }
});

// Calcula a idade pela data de nascimento
function calculateAge(dateString) {
  const birthDate = new Date(`${dateString}T12:00:00`);
  const currentDate = new Date();

  let age =
    currentDate.getFullYear() - birthDate.getFullYear();

  const birthdayPassed =
    currentDate.getMonth() > birthDate.getMonth() ||
    (
      currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() >= birthDate.getDate()
    );

  if (!birthdayPassed) {
    age--;
  }

  return age;
}

// Calcula qual perfil recebeu mais respostas
function getSelectedProfile() {
  const scores = {
    technology: 0,
    science: 0,
    creative: 0,
    management: 0
  };

  for (let i = 1; i <= 4; i++) {
    const selected = form.querySelector(
      `input[name="q${i}"]:checked`
    );

    if (selected && Object.hasOwn(scores, selected.value)) {
      scores[selected.value]++;
    }
  }

  const highestScore = Math.max(...Object.values(scores));

  const winners = Object.keys(scores).filter(
    key => scores[key] === highestScore
  );

  return {
    profile: profiles[winners[0]],
    tiedProfiles: winners.map(key => profiles[key]),
    isTie: winners.length > 1
  };
}

// Cria as etiquetas das áreas e habilidades
function renderSkills(skillsList) {
  const skillsContainer = document.getElementById("result-skills");

  skillsContainer.replaceChildren();

  skillsList.forEach(skill => {
    const tag = document.createElement("span");

    tag.className = "skill-tag";
    tag.textContent = skill;

    skillsContainer.appendChild(tag);
  });
}

// Resultado normal: mostra a imagem da profissão
function showResult(profile, name, age) {
  document.getElementById("result-greeting").textContent =
    `OI, ${name.toLocaleUpperCase("pt-BR")}!`;

  document.getElementById("result-category").textContent =
    profile.category;

  document.getElementById("result-title").textContent =
    profile.title;

  document.getElementById("result-text").textContent =
    profile.description;

  const imageContainer = getImageContainer();

  if (imageContainer) {
    imageContainer.style.display = "";
  }

  resultImage.style.display = "block";
  resultImage.src = profile.image;
  resultImage.alt = `Imagem ilustrativa de ${profile.title}`;

  renderSkills(profile.skills);

  document.getElementById("result-extra").textContent =
    `Sua idade: ${age} anos. ${profile.extra}`;

  resultsSection.classList.remove("tie-result");
  resultsSection.hidden = false;

  resultsSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// Resultado de empate: remove a imagem e sua coluna
function showTieResult(tiedProfiles, name, age) {
  document.getElementById("result-greeting").textContent =
    `OI, ${name.toLocaleUpperCase("pt-BR")}!`;

  document.getElementById("result-category").textContent =
    "RESULTADO · EMPATE";

  document.getElementById("result-title").textContent =
    "Você combina com mais de uma área!";

  document.getElementById("result-text").textContent =
    "Suas respostas ficaram empatadas entre estas áreas. Isso pode ser uma oportunidade para explorar diferentes interesses e descobrir o que você mais gosta.";

  const imageContainer = getImageContainer();

  // Esconde a área inteira, não apenas a foto
  if (imageContainer) {
    imageContainer.style.display = "none";
  }

  resultImage.style.display = "none";
  resultImage.removeAttribute("src");
  resultImage.alt = "";

  renderSkills(tiedProfiles.map(profile => profile.title));

  const tiedNames = tiedProfiles
    .map(profile => profile.title)
    .join(", ");

  document.getElementById("result-extra").textContent =
    `Empate entre: ${tiedNames}. Sua idade: ${age} anos. Explore cada uma dessas áreas para descobrir qual desperta mais seu interesse!`;

  resultsSection.classList.add("tie-result");
  resultsSection.hidden = false;

  resultsSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// Valida os dados e exibe o resultado
form.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.textContent = "";

  const name = nameInput.value.trim();
  const birthdate = birthdateInput.value;

  if (name.length < 2) {
    formError.textContent =
      "Digite seu nome com pelo menos 2 caracteres.";
    nameInput.focus();
    return;
  }

  if (!birthdate) {
    formError.textContent = "Informe sua data de nascimento.";
    birthdateInput.focus();
    return;
  }

  if (
    birthdate < "1900-01-01" ||
    birthdate > todayString
  ) {
    formError.textContent = "Confira sua data de nascimento.";
    birthdateInput.focus();
    return;
  }

  const answered = form.querySelectorAll(
    'input[type="radio"]:checked'
  ).length;

  if (answered !== 4) {
    formError.textContent =
      "Responda às quatro perguntas antes de ver seu resultado.";

    const firstUnanswered = [1, 2, 3, 4].find(number =>
      !form.querySelector(`input[name="q${number}"]:checked`)
    );

    document.querySelector(
      `[data-question="${firstUnanswered}"]`
    ).scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    return;
  }

  const age = calculateAge(birthdate);
  const result = getSelectedProfile();

  if (result.isTie) {
    showTieResult(result.tiedProfiles, name, age);
  } else {
    showResult(result.profile, name, age);
  }
});

// Botão para refazer o teste
document.getElementById("retry-button").addEventListener("click", () => {
  form.reset();
  updateProgress();

  formError.textContent = "";

  const imageContainer = getImageContainer();

  if (imageContainer) {
    imageContainer.style.display = "";
  }

  resultImage.style.display = "block";
  resultImage.removeAttribute("src");
  resultImage.alt = "";

  resultsSection.classList.remove("tie-result");
  resultsSection.hidden = true;

  document.getElementById("quiz").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Inicializa a barra de progresso
updateProgress();
