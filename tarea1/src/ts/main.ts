type CV = {
  name: string;
  role: string;
  summary: string;
  contact: {
    email: string;
    phone?: string;
    location?: string;
    links?: Record<string, string>;
  };
  education: Array<{ school: string; degree: string; period: string }>;
  skills: {
    languages?: string[];
    tools?: string[];
    soft?: string[];
  };
  projects: Array<{ title: string; stack?: string[]; year?: number; desc?: string }>;
  contactForm: {
    service: "formsubmit" | "emailjs" | "getform" | string;
    action: string;
    extra?: Record<string, string>;
  }
};

const $ = <T extends HTMLElement = HTMLElement>(sel: string) =>
  document.querySelector<T>(sel)!;

async function loadCV(): Promise<CV> {
  const res = await fetch("./data/cv.json", { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar cv.json");
  return res.json();
}

function setText(id: string, text: string) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderList(ulSel: string, items: string[]) {
  const ul = $(ulSel) as HTMLUListElement;
  ul.innerHTML = items.map(i => `<li>${i}</li>`).join("");
}

function render() {
  setText("year", String(new Date().getFullYear()));
}

function hydrate(cv: CV) {
  setText("name", cv.name);
  setText("role", cv.role);
  setText("summary", cv.summary);

  const links = $("#links");
  links.innerHTML = "";
  if (cv.contact.links) {
    Object.entries(cv.contact.links).forEach(([k, v]) => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${v}" target="_blank" rel="noopener">${k}</a>`;
      links.appendChild(li);
    });
  }

  const edu = $("#education");
  edu.innerHTML = cv.education.map(e =>
    `<li><strong>${e.school}</strong> — ${e.degree} <span class="muted">(${e.period})</span></li>`
  ).join("");

  renderList("#skills-langs", cv.skills.languages ?? []);
  renderList("#skills-tools", cv.skills.tools ?? []);
  renderList("#skills-soft", cv.skills.soft ?? []);

  const projects = $("#projects");
  projects.innerHTML = cv.projects.map(p => `
    <article class="card">
      <h3>${p.title}</h3>
      ${p.year ? `<small class="muted">${p.year}</small>` : ""}
      ${p.stack?.length ? `<ul class="tags">${p.stack.map(s => `<li>${s}</li>`).join("")}</ul>` : ""}
      <p>${p.desc ?? ""}</p>
    </article>
  `).join("");

  setupForm(cv);
}

function setupForm(cv: CV) {
  const form = $("#contact-form") as HTMLFormElement;
  const status = $("#form-status");

  if (cv.contactForm.service.toLowerCase() === "formsubmit") {
    form.action = `${cv.contactForm.action.replace(/\/$/, "")}/${encodeURIComponent(cv.contact.email)}`;
    form.method = "POST";
    Object.entries(cv.contactForm.extra ?? {}).forEach(([k, v]) => {
      const hidden = document.createElement("input");
      hidden.type = "hidden"; hidden.name = k; hidden.value = v;
      form.appendChild(hidden);
    });
  } else {
    form.action = cv.contactForm.action;
    form.method = "POST";
  }

  form.addEventListener("submit", (e) => {
    clearErrors();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    let valid = true;
    if (!name) { showError("name", "Ingresa tu nombre."); valid = false; }
    if (!isValidEmail(email)) { showError("email", "Ingresa un email válido."); valid = false; }
    if (!message || message.length < 10) { showError("message", "Escribe al menos 10 caracteres."); valid = false; }

    if (!valid) {
      e.preventDefault();
      status.textContent = "Corrige los campos marcados.";
      return;
    }
    status.textContent = "Enviando…";

  });
}

function showError(field: string, msg: string) {
  const el = document.querySelector<HTMLElement>(`.error[data-for="${field}"]`);
  if (el) el.textContent = msg;
}
function clearErrors() {
  document.querySelectorAll<HTMLElement>(".error").forEach(e => e.textContent = "");
}
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

(async function init() {
  try {
    render();
    const cv = await loadCV();
    hydrate(cv);
  } catch (err) {
    console.error(err);
    const main = document.querySelector("main");
    if (main) main.innerHTML = `<p>No se pudo cargar el CV. Revisa <code>/data/cv.json</code>.</p>`;
  }
})();

