
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const titles = {
  overview: "Overview",
  schedule: "Delivery Schedule",
  track: "Track Delivery",
  billing: "Billing History",
  profile: "My Plan & Profile",
  extras: "Order Extras",
  wallet: "Wallet",
  offers: "Offers & Referrals",
  help: "Help & Support"
};

/* THEME AND DIRECTION */

const themeToggle = $("#themeToggle");
const themeIcon = $("#themeIcon");
const directionToggle = $("#directionToggle");
const directionLabel = $("#directionLabel");

function readPreference(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (error) {
    return fallback;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // The dashboard remains usable if storage is unavailable.
  }
}

function applyTheme(theme) {
  const dark = theme === "dark";

  document.documentElement.classList.toggle("dark-mode", dark);

  if (themeIcon) {
    themeIcon.innerHTML =
      `<use href="#${dark ? "i-sun" : "i-moon"}"></use>`;
  }

  if (themeToggle) {
    const label = dark ? "Switch to light mode" : "Switch to dark mode";
    themeToggle.setAttribute("aria-label", label);
    themeToggle.title = label;
  }

  savePreference("evergreenTheme", dark ? "dark" : "light");
}

function applyDirection(direction) {
  const rtl = direction === "rtl";

  document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");

  if (directionLabel) {
    directionLabel.textContent = rtl ? "LTR" : "RTL";
  }

  if (directionToggle) {
    const label = rtl
      ? "Switch to left-to-right layout"
      : "Switch to right-to-left layout";

    directionToggle.setAttribute("aria-label", label);
    directionToggle.title = label;
  }

  savePreference("evergreenDirection", rtl ? "rtl" : "ltr");
}

applyTheme(readPreference("evergreenTheme", "light"));
applyDirection(readPreference("evergreenDirection", "ltr"));

themeToggle?.addEventListener("click", () => {
  const dark = document.documentElement.classList.contains("dark-mode");
  applyTheme(dark ? "light" : "dark");
});

directionToggle?.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("dir") || "ltr";
  applyDirection(current === "rtl" ? "ltr" : "rtl");
});

/* SAMPLE DATA */

const week = [
  ["Mon", 1.5], ["Tue", 1], ["Wed", 1], ["Thu", 1],
  ["Fri", 1], ["Sat", 1.5], ["Sun", 1.5]
];

const upcoming = [
  ["13", "Oct", "Tuesday", "1 L milk + curd"],
  ["14", "Oct", "Wednesday", "1 L milk + curd"]
];

const recent = [
  ["Mon, 12 Oct", "1 L milk + 500 g curd", "—", "Out for delivery"],
  ["Sun, 11 Oct", "1.5 L milk + 500 g curd", "6:31 AM", "Delivered"],
  ["Sat, 10 Oct", "1.5 L milk + 500 g curd", "6:35 AM", "Delivered"],
  ["Fri, 9 Oct", "1 L milk + 500 g curd", "—", "Skipped"]
];

const invoices = [
  ["INV-2610", "Oct 2026", "₹2,100", "1 Nov 2026", "Due"],
  ["INV-2609", "Sep 2026", "₹2,100", "1 Oct 2026", "Paid"],
  ["INV-2608", "Aug 2026", "₹2,100", "1 Sep 2026", "Paid"],
  ["INV-2607", "Jul 2026", "₹2,100", "1 Aug 2026", "Paid"],
  ["INV-2606", "Jun 2026", "₹2,100", "1 Jul 2026", "Paid"]
];

const notes = [
  ["Delivery on the way", "Ravi is 1.2 km away. Arriving by 6:42 AM."],
  ["Invoice generated", "Your October invoice of ₹2,100 is ready."],
  ["Plan renewal", "Your Family Plan renews on 1 Nov 2026."]
];

const days = [
  "Monday", "Tuesday", "Wednesday", "Thursday",
  "Friday", "Saturday", "Sunday"
];

const slots = [
  "6:00 – 7:00 AM",
  "6:30 – 7:30 AM",
  "7:00 – 8:00 AM",
  "5:30 – 6:30 AM"
];

const stepNames = [
  ["Packed", "5:40 AM"],
  ["Dispatched", "6:05 AM"],
  ["Out for delivery", "6:25 AM"],
  ["Delivered", "6:41 AM"]
];

const badge = status => {
  const cls =
    status === "Due" || status === "Open" ? "due" :
    status === "Skipped" ? "skip" :
    status === "Out for delivery" ? "out" : "";

  return `<span class="badge ${cls}">${status}</span>`;
};

/* TOAST */

let toastTimer;

function toast(message) {
  const element = $("#toast");
  if (!element) return;

  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    element.classList.remove("show");
  }, 2600);
}

/* RENDER DASHBOARD */

$("#bars").innerHTML = week.map((item, index) =>
  `<i class="${index === 0 ? "t" : ""}" style="height:${item[1] / 1.5 * 100}%"><em>${item[0]}</em></i>`
).join("");

$("#upcoming").innerHTML = upcoming.map(item =>
  `<div class="row">
    <div class="d">${item[0]}<small>${item[1]}</small></div>
    <div><b>${item[2]}</b><div class="s">${item[3]}</div></div>
  </div>`
).join("");

$("#recent").innerHTML = recent.map(item =>
  `<tr>
    <td>${item[0]}</td>
    <td>${item[1]}</td>
    <td>${item[2]}</td>
    <td>${badge(item[3])}</td>
  </tr>`
).join("");

$("#inv").innerHTML = invoices.map(item =>
  `<tr data-s="${item[4]}">
    <td><b>${item[0]}</b></td>
    <td>${item[1]}</td>
    <td>${item[2]}</td>
    <td>${item[3]}</td>
    <td>${badge(item[4])}</td>
    <td>
      ${item[4] === "Due"
        ? `<button class="btn btn-sm" data-toast="Redirecting to secure payment...">Pay now</button>`
        : `<button class="btn o btn-sm" data-toast="Downloading ${item[0]}.pdf">Download</button>`}
    </td>
  </tr>`
).join("");

$("#days").innerHTML = days.map((day, index) =>
  `<div class="day">
    <b>${day}</b>
    <label class="sw" aria-label="Enable ${day} delivery">
      <input type="checkbox" checked>
      <span></span>
    </label>
    <div class="qty">
      <button type="button" aria-label="Decrease ${day} quantity">−</button>
      <output>${week[index][1]}</output>
      <button type="button" aria-label="Increase ${day} quantity">+</button>
    </div>
    <select aria-label="${day} delivery time">
      ${slots.map(slot => `<option>${slot}</option>`).join("")}
    </select>
  </div>`
).join("");

$("#notes").innerHTML = notes.map(item =>
  `<button class="note new" type="button">
    <span><b>${item[0]}</b><small>${item[1]}</small></span>
  </button>`
).join("");

$("#today").textContent =
  "Today is " +
  new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }) +
  ". Your next delivery is tomorrow at 6:30 AM.";

/* NAVIGATION */

function show(id) {
  if (!titles[id]) return;

  $$(".view").forEach(view => {
    view.classList.toggle("on", view.id === id);
  });

  $$(".nav button").forEach(button => {
    button.classList.toggle("on", button.dataset.p === id);
  });

  $("#sub").textContent = titles[id];
  $("#side").classList.remove("open");
  $("#burger").setAttribute("aria-expanded", "false");

  $$(".menu").forEach(menu => menu.classList.remove("open"));
  $(".views").scrollTop = 0;
}

$$("[data-p]").forEach(button => {
  button.addEventListener("click", () => show(button.dataset.p));
});

$("#burger").addEventListener("click", () => {
  const side = $("#side");
  const open = side.classList.toggle("open");

  $("#burger").setAttribute("aria-expanded", String(open));
});

/* MENUS AND NOTIFICATIONS */

function setCount() {
  const count = $$(".note.new").length;
  $("#cnt").textContent = count;
  $("#cnt").style.display = count ? "" : "none";
}

$("#bell").addEventListener("click", event => {
  event.stopPropagation();

  $("#avaMenu").classList.remove("open");
  const menu = $("#bellMenu");
  menu.classList.toggle("open");

  $("#bell").setAttribute("aria-expanded", String(menu.classList.contains("open")));
  $("#ava").setAttribute("aria-expanded", "false");
});

$("#ava").addEventListener("click", event => {
  event.stopPropagation();

  $("#bellMenu").classList.remove("open");
  const menu = $("#avaMenu");
  menu.classList.toggle("open");

  $("#ava").setAttribute("aria-expanded", String(menu.classList.contains("open")));
  $("#bell").setAttribute("aria-expanded", "false");
});

$("#notes").addEventListener("click", event => {
  const note = event.target.closest(".note");
  if (!note) return;

  note.classList.remove("new");
  setCount();
});

$("#readAll").addEventListener("click", () => {
  $$(".note").forEach(note => note.classList.remove("new"));
  setCount();
});

setCount();

document.addEventListener("click", event => {
  if (!event.target.closest(".dd")) {
    $$(".menu").forEach(menu => menu.classList.remove("open"));
    $("#bell").setAttribute("aria-expanded", "false");
    $("#ava").setAttribute("aria-expanded", "false");
  }

  if (!event.target.closest("#side") && !event.target.closest("#burger")) {
    if (window.innerWidth <= 900) {
      $("#side").classList.remove("open");
      $("#burger").setAttribute("aria-expanded", "false");
    }
  }
});

/* LOGOUT AND BUTTON MESSAGES */

$$("[data-logout]").forEach(button => {
  button.addEventListener("click", () => {
    $$(".menu").forEach(menu => menu.classList.remove("open"));
    $("#modal").classList.add("open");
  });
});

$("#cancel").addEventListener("click", () => {
  $("#modal").classList.remove("open");
});

$("#modal").addEventListener("click", event => {
  if (event.target.id === "modal") {
    $("#modal").classList.remove("open");
  }
});

$("#confirm").addEventListener("click", () => {
  window.location.href = "login.html";
});

document.addEventListener("click", event => {
  const button = event.target.closest("[data-toast]");
  if (button) toast(button.dataset.toast);
});

/* SCHEDULE */

function sumUp() {
  let count = 0;
  let litres = 0;

  $$(".day").forEach(day => {
    const enabled = day.querySelector('input[type="checkbox"]').checked;
    day.classList.toggle("off", !enabled);

    if (enabled) {
      count++;
      litres += parseFloat(day.querySelector("output").textContent);
    }
  });

  $("#sDays").textContent = count;
  $("#sL").textContent = litres + " L";
  $("#sC").textContent = "₹" +
    Math.round(litres * 60 * 30 / 7).toLocaleString("en-IN");
}

$("#days").addEventListener("click", event => {
  const button = event.target.closest(".qty button");
  if (!button) return;

  const output = button.parentNode.querySelector("output");
  const increase = button.textContent.trim() === "+";
  let quantity = parseFloat(output.textContent);

  quantity += increase ? 0.5 : -0.5;
  quantity = Math.min(5, Math.max(0.5, quantity));

  output.textContent = quantity;
  sumUp();
});

$("#days").addEventListener("change", sumUp);
sumUp();

/* TRACKING */

let currentStep = 2;

function renderTrack() {
  $("#steps").innerHTML = stepNames.map((step, index) =>
    `<div class="step ${index < currentStep ? "done" : index === currentStep ? "now" : ""}">
      <i>${index < currentStep ? "✓" : index + 1}</i>
      <b>${step[0]}</b>
      <span>${step[1]}</span>
    </div>`
  ).join("");

  const status = stepNames[Math.min(currentStep, 3)][0];

  $("#trStatus").textContent = status;
  $("#ovStatus").textContent = status;

  $("#eta").textContent = currentStep >= 3
    ? "Delivered at 6:41 AM"
    : "Estimated arrival 6:42 AM";

  $("#dist").textContent = currentStep >= 3
    ? "Enjoy your fresh milk!"
    : currentStep === 2
      ? "1.2 km away"
      : "Preparing your order";

  $("#refresh").disabled = currentStep >= 3;
  $("#refresh").style.opacity = currentStep >= 3 ? ".4" : "1";
}

$("#refresh").addEventListener("click", () => {
  if (currentStep < 3) {
    currentStep++;
    renderTrack();
    toast("Status updated: " + stepNames[currentStep][0]);
  }
});

renderTrack();

/* BILLING FILTER */

$("#tabs").addEventListener("click", event => {
  const button = event.target.closest("button[data-f]");
  if (!button) return;

  $$("#tabs button").forEach(item => {
    item.classList.toggle("on", item === button);
  });

  $$("#inv tr").forEach(row => {
    row.style.display =
      button.dataset.f === "all" || row.dataset.s === button.dataset.f
        ? ""
        : "none";
  });
});

/* ORDER EXTRAS */

const products = [
  ["Pure Ghee", "500 g", 450],
  ["Fresh Paneer", "250 g", 95],
  ["Fresh Butter", "100 g", 55],
  ["Cheese", "200 g", 90],
  ["Buttermilk", "500 ml", 20],
  ["Fresh Curd", "500 g", 40]
];

const productQuantities = products.map(() => 0);

$("#shop").innerHTML = products.map((product, index) =>
  `<div class="prod">
    <span class="pi"><svg><use href="#i-drop"/></svg></span>
    <b>${product[0]}</b>
    <span class="s">${product[1]}</span>
    <div class="num">₹${product[2]}</div>
    <div class="qty">
      <button type="button" data-i="${index}" aria-label="Decrease ${product[0]}">−</button>
      <output>0</output>
      <button type="button" data-i="${index}" aria-label="Increase ${product[0]}">+</button>
    </div>
  </div>`
).join("");

function drawCart() {
  let total = 0;
  let rows = "";

  products.forEach((product, index) => {
    const quantity = productQuantities[index];

    if (quantity) {
      const subtotal = quantity * product[2];
      total += subtotal;

      rows += `<div class="cl">
        <span>${product[0]} ${product[1]} × ${quantity}</span>
        <b>₹${subtotal}</b>
      </div>`;
    }
  });

  $("#cart").innerHTML =
    rows || '<p class="s">Your basket is empty. Add something fresh!</p>';

  $("#cartTotal").textContent = "₹" + total;
  return total;
}

$("#shop").addEventListener("click", event => {
  const button = event.target.closest("button[data-i]");
  if (!button) return;

  const index = Number(button.dataset.i);
  const increase = button.textContent.trim() === "+";

  productQuantities[index] = Math.max(
    0,
    Math.min(9, productQuantities[index] + (increase ? 1 : -1))
  );

  button.parentNode.querySelector("output").textContent =
    productQuantities[index];

  drawCart();
});

$("#placeOrder").addEventListener("click", () => {
  const total = drawCart();

  if (!total) {
    toast("Your basket is empty.");
    return;
  }

  toast("Order placed! ₹" + total + " will be added to tomorrow's delivery.");

  productQuantities.fill(0);
  $$("#shop output").forEach(output => output.textContent = "0");

  drawCart();
});

drawCart();

/* WALLET */

let balance = 450;

const transactions = [
  ["Wallet top-up", "11 Oct", "+₹500", "cr"],
  ["Extras: Pure Ghee 500 g", "9 Oct", "−₹450", "dr"],
  ["Referral reward", "5 Oct", "+₹100", "cr"],
  ["Extras: Fresh Paneer 250 g", "2 Oct", "−₹95", "dr"]
];

function drawTransactions() {
  $("#txns").innerHTML = transactions.map(item =>
    `<div class="row tx">
      <div><b>${item[0]}</b><div class="s">${item[1]}</div></div>
      <b class="${item[3]}">${item[2]}</b>
    </div>`
  ).join("");
}

$("#amts").addEventListener("click", event => {
  const button = event.target.closest("button[data-a]");
  if (!button) return;

  $$("#amts button").forEach(item => {
    item.classList.toggle("on", item === button);
  });

  $("#amt").value = button.dataset.a;
});

$("#addMoney").addEventListener("click", () => {
  const amount = Number($("#amt").value);

  if (!Number.isFinite(amount) || amount < 50) {
    toast("Please enter at least ₹50.");
    return;
  }

  if (!Number.isInteger(amount)) {
    toast("Please enter a whole number.");
    return;
  }

  balance += amount;
  $("#bal").textContent = "₹" + balance.toLocaleString("en-IN");

  transactions.unshift(["Wallet top-up", "Today", "+₹" + amount, "cr"]);
  drawTransactions();

  toast("₹" + amount.toLocaleString("en-IN") + " added to your wallet.");
});

drawTransactions();

/* OFFERS AND REFERRALS */

const offers = [
  ["15% off your first month", "Code FRESH15 · valid till 31 Oct"],
  ["Free ghee 250 g", "On Premium upgrade · code GHEE250"],
  ["₹50 off extras", "Orders above ₹500 · code EXTRA50"]
];

$("#offerList").innerHTML = offers.map(offer =>
  `<div class="row">
    <div><b>${offer[0]}</b><div class="s">${offer[1]}</div></div>
    <button class="btn o btn-sm" data-o="${offer[0]}">Apply</button>
  </div>`
).join("");

$("#offerList").addEventListener("click", event => {
  const button = event.target.closest("button[data-o]");
  if (button) toast("Offer applied: " + button.dataset.o);
});

$("#copyCode").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("PRIYA-EVG15");
    toast("Referral code copied!");
  } catch (error) {
    toast("Your referral code is PRIYA-EVG15");
  }
});

/* HELP AND SUPPORT */

const tickets = [
  ["Invoice question", "Open"],
  ["Late delivery on 5 Oct", "Resolved"]
];

function drawTickets() {
  $("#tickets").innerHTML = tickets.map(ticket =>
    `<div class="row">
      <div><b>${ticket[0]}</b></div>
      ${badge(ticket[1])}
    </div>`
  ).join("");
}

$("#sendTicket").addEventListener("click", () => {
  const message = $("#tMsg").value.trim();

  if (!message) {
    toast("Please write a short message.");
    $("#tMsg").focus();
    return;
  }

  tickets.unshift([$("#tTopic").value, "Open"]);

  drawTickets();
  $("#tMsg").value = "";

  toast("Request sent. We will reply soon.");
});

drawTickets();
