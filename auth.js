/* =====================================================
   ZENVORA AUTOMATIVE - js/auth.js
   Client-side register / login / logout + page gate.

   NOTE: this is a static site with no server, so accounts are
   stored in the visitor's own browser (localStorage). That is fine
   for a coursework demo, but it is NOT real security - a real site
   must verify passwords on a server.
   ===================================================== */

const USERS_KEY = "zenvora_users";
const SESSION_KEY = "zenvora_session";
const PUBLIC_PAGES = ["login.html", "register.html"];
// Pages that need an account. Anything not listed here is open to everyone.
// To lock the whole site, add every page name; to open it up, empty the list.
const PROTECTED_PAGES = [];

/* ---------- storage helpers ---------- */
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
  catch (e) { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch (e) { return null; }
}
function currentPage() {
  const p = decodeURIComponent(window.location.pathname.split("/").pop());
  return p || "Home.html";
}

/* ---------- password hashing (SHA-256 + random salt) ---------- */
async function hashPassword(password, salt) {
  const data = salt + password;
  if (window.crypto && window.crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback for browsers without SubtleCrypto (e.g. some file:// contexts)
  let h = 5381;
  for (let i = 0; i < data.length; i++) h = ((h << 5) + h + data.charCodeAt(i)) >>> 0;
  return "fallback-" + h.toString(16);
}
function randomSalt() {
  const arr = new Uint8Array(16);
  (window.crypto || window.msCrypto).getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ---------- page gate (runs immediately, before the page paints) ---------- */
(function gate() {
  const page = currentPage();
  const session = getSession();
  const isPublic = PUBLIC_PAGES.includes(page);

  if (!session && PROTECTED_PAGES.includes(page)) {
    window.location.replace("login.html?next=" + encodeURIComponent(page));
  } else if (session && isPublic) {
    window.location.replace("Home.html");
  }
})();

/* ---------- UI helpers ---------- */
function authError(input, message) {
  const field = input.closest(".field");
  field.querySelector(".error-message").textContent = message;
  input.classList.toggle("invalid", Boolean(message));
}
function authStatus(el, message, type) {
  el.textContent = message;
  el.className = "form-status " + type;
}

document.addEventListener("DOMContentLoaded", () => {
  const session = getSession();

  // Top-right account links: Login / Sign up, or greeting / Logout
  const bar = document.querySelector(".nav-container");
  if (bar) {
    const box = document.createElement("div");
    box.className = "auth-links";
    const page = currentPage();

    if (session) {
      const greet = document.createElement("span");
      greet.className = "nav-user";
      greet.textContent = "Hi, " + session.name.split(" ")[0];
      const out = document.createElement("a");
      out.href = "#";
      out.className = "auth-btn";
      out.textContent = "Logout";
      out.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem(SESSION_KEY);
        window.location.href = PROTECTED_PAGES.includes(page) ? "login.html" : page;
      });
      box.append(greet, out);
    } else {
      const login = document.createElement("a");
      login.href = "login.html";
      login.className = "auth-btn";
      login.textContent = "Login";
      const signup = document.createElement("a");
      signup.href = "register.html";
      signup.className = "auth-btn auth-btn-primary";
      signup.textContent = "Sign up";
      box.append(login, signup);
    }
    bar.appendChild(box);
  }

  const registerForm = document.getElementById("register-form");
  if (registerForm) initRegister(registerForm);

  const loginForm = document.getElementById("login-form");
  if (loginForm) initLogin(loginForm);
});

/* ---------- Register ---------- */
function initRegister(form) {
  const name = form.querySelector("#reg-name");
  const email = form.querySelector("#reg-email");
  const pass = form.querySelector("#reg-password");
  const confirm = form.querySelector("#reg-confirm");
  const status = document.getElementById("register-status");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let ok = true;

    if (!/^[A-Za-z\s'-]{2,}$/.test(name.value.trim())) {
      authError(name, "Please enter your name (letters only)."); ok = false;
    } else authError(name, "");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      authError(email, "Please enter a valid email address."); ok = false;
    } else authError(email, "");

    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(pass.value)) {
      authError(pass, "Password must be 8+ characters with a letter and a number."); ok = false;
    } else authError(pass, "");

    if (confirm.value !== pass.value || !confirm.value) {
      authError(confirm, "Passwords do not match."); ok = false;
    } else authError(confirm, "");

    if (!ok) { authStatus(status, "Please fix the highlighted fields.", "error"); return; }

    const users = getUsers();
    const emailKey = email.value.trim().toLowerCase();
    if (users.some((u) => u.email === emailKey)) {
      authError(email, "An account with this email already exists.");
      authStatus(status, "That email is already registered - try logging in.", "error");
      return;
    }

    const salt = randomSalt();
    users.push({
      name: name.value.trim(),
      email: emailKey,
      salt,
      hash: await hashPassword(pass.value, salt),
    });
    saveUsers(users);

    authStatus(status, "Account created! Redirecting you to log in...", "success");
    setTimeout(() => { window.location.href = "login.html?registered=1"; }, 1200);
  });
}

/* ---------- Login ---------- */
function initLogin(form) {
  const email = form.querySelector("#login-email");
  const pass = form.querySelector("#login-password");
  const status = document.getElementById("login-status");
  const params = new URLSearchParams(window.location.search);

  if (params.get("registered")) {
    authStatus(status, "Registration successful - please log in.", "success");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let ok = true;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      authError(email, "Please enter a valid email address."); ok = false;
    } else authError(email, "");
    if (!pass.value) { authError(pass, "Please enter your password."); ok = false; }
    else authError(pass, "");
    if (!ok) { authStatus(status, "Please fix the highlighted fields.", "error"); return; }

    const user = getUsers().find((u) => u.email === email.value.trim().toLowerCase());
    const hash = user ? await hashPassword(pass.value, user.salt) : null;

    if (!user || hash !== user.hash) {
      authStatus(status, "Incorrect email or password.", "error");
      return;
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
    const next = params.get("next");
    // only allow redirects to our own known pages
    const safe = next && /^[\w %.-]+\.html$/.test(next) && !PUBLIC_PAGES.includes(next);
    window.location.href = safe ? next : "Home.html";
  });
}
