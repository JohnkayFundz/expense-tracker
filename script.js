(() => {
  "use strict";

  const STORAGE_KEY = "spendwise.transactions.v1";
  const THEME_KEY = "darkMode";
  const CATEGORIES = {
    expense: ["Food & Dining", "Transport", "Shopping", "Bills", "Health", "Education", "Entertainment", "Home", "Other"],
    income: ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"]
  };
  const state = { transactions: [], filter: "all", search: "", type: "expense", toastTimer: null };

  const $ = (selector) => document.querySelector(selector);
  const els = {
    balance: $("#balanceValue"),
    income: $("#incomeValue"),
    expense: $("#expenseValue"),
    count: $("#transactionCount"),
    list: $("#transactionList"),
    breakdown: $("#categoryBreakdown"),
    form: $("#transactionForm"),
    description: $("#description"),
    amount: $("#amount"),
    category: $("#category"),
    date: $("#date"),
    type: $("#transactionType"),
    error: $("#formError"),
    search: $("#searchInput"),
    theme: $("#darkModeToggle"),
    themeIcon: $("#themeIcon"),
    today: $("#todayLabel"),
    toast: $("#toast"),
    exportButton: $("#exportCsv")
  };

  const money = (value) => new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", minimumFractionDigits: 2, maximumFractionDigits: 2
  }).format(value);

  const localDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDate = (value) => {
    const parts = String(value).split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return "Date not set";
    return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" })
      .format(new Date(parts[0], parts[1] - 1, parts[2]));
  };

  const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);

  function loadTransactions() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(stored)) return [];
      return stored.filter((item) =>
        item && typeof item.id === "string" &&
        ["income", "expense"].includes(item.type) &&
        typeof item.description === "string" &&
        Number.isFinite(Number(item.amount)) && Number(item.amount) > 0 &&
        typeof item.category === "string" && typeof item.date === "string"
      ).map((item) => ({ ...item, amount: Number(item.amount) }));
    } catch (error) {
      console.warn("Could not load saved transactions.", error);
      return [];
    }
  }

  function persistTransactions() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.transactions));
      return true;
    } catch (error) {
      console.error("Could not save transactions.", error);
      showToast("Could not save. Check your browser storage settings.");
      return false;
    }
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => els.toast.classList.remove("show"), 2600);
  }

  function updateSummary() {
    const income = state.transactions.reduce((sum, item) => sum + (item.type === "income" ? item.amount : 0), 0);
    const expenses = state.transactions.reduce((sum, item) => sum + (item.type === "expense" ? item.amount : 0), 0);
    els.balance.textContent = money(income - expenses);
    els.income.textContent = money(income);
    els.expense.textContent = money(expenses);
    els.count.textContent = `${state.transactions.length} ${state.transactions.length === 1 ? "record" : "records"}`;
  }

  function filteredTransactions() {
    const search = state.search.trim().toLocaleLowerCase();
    return [...state.transactions]
      .filter((item) => state.filter === "all" || item.type === state.filter)
      .filter((item) => !search || `${item.description} ${item.category} ${item.date}`.toLocaleLowerCase().includes(search))
      .sort((a, b) => b.date.localeCompare(a.date) || (b.createdAt || 0) - (a.createdAt || 0));
  }

  function renderTransactions() {
    const items = filteredTransactions();
    if (!items.length) {
      const hasTransactions = state.transactions.length > 0;
      const title = hasTransactions ? "No matching transactions" : "No transactions yet";
      const message = hasTransactions
        ? "Try a different search or filter to find what you need."
        : "Add your first income or expense to see your money activity here.";
      els.list.innerHTML = `<div class="empty-state"><span class="empty-icon" aria-hidden="true">↗</span><strong>${title}</strong><p>${message}</p></div>`;
      return;
    }

    els.list.innerHTML = items.map((item) => {
      const income = item.type === "income";
      const symbol = income ? "↙" : "↗";
      const amount = `${income ? "+" : "−"}${money(item.amount)}`;
      return `<article class="transaction-row">
        <span class="transaction-symbol ${item.type}" aria-hidden="true">${symbol}</span>
        <span class="transaction-copy"><strong>${escapeHTML(item.description)}</strong><small>${escapeHTML(item.category)} · ${formatDate(item.date)}</small></span>
        <span class="transaction-amount ${item.type}">${amount}</span>
        <button class="delete-button" type="button" data-delete="${escapeHTML(item.id)}" aria-label="Delete ${escapeHTML(item.description)}" title="Delete transaction">×</button>
      </article>`;
    }).join("");
  }

  function exportTransactions() {
    if (!state.transactions.length) {
      showToast("Add a transaction before exporting.");
      return;
    }
    const rows = [
      ["Date", "Type", "Description", "Category", "Amount (NGN)"],
      ...[...state.transactions]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((item) => [item.date, item.type, item.description, item.category, item.amount.toFixed(2)])
    ];
    const csv = rows.map((row) => row.map((value) => {
      const safe = String(value).replace(/"/g, '""');
      return /[",\\r\\n]/.test(safe) ? `"${safe}"` : safe;
    }).join(",")).join("\\r\\n");
    const blob = new Blob(["\\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `spendwise-transactions-${localDateString()}.csv`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("CSV backup prepared for download.");
  }

  function renderCategoryBreakdown() {
    const totals = state.transactions
      .filter((item) => item.type === "expense")
      .reduce((result, item) => {
        result[item.category] = (result[item.category] || 0) + item.amount;
        return result;
      }, {});
    const categories = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (!categories.length) {
      els.breakdown.innerHTML = '<div class="insight-empty">Your spending categories will appear here after you add an expense.</div>';
      return;
    }
    const maximum = categories[0][1];
    els.breakdown.innerHTML = categories.map(([category, total]) => {
      const width = maximum > 0 ? Math.max(4, (total / maximum) * 100) : 0;
      return `<div class="category-item"><div class="category-topline"><span>${escapeHTML(category)}</span><strong>${money(total)}</strong></div><div class="progress-track" role="progressbar" aria-label="${escapeHTML(category)} spending" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(width)}"><div class="progress-fill" style="width:${width}%"></div></div></div>`;
    }).join("");
  }

  function render() {
    updateSummary();
    renderTransactions();
    renderCategoryBreakdown();
  }

  function updateCategories(preferredValue) {
    const choices = CATEGORIES[state.type];
    els.category.innerHTML = choices.map((category) => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join("");
    if (preferredValue && choices.includes(preferredValue)) els.category.value = preferredValue;
  }

  function setType(type) {
    if (!["income", "expense"].includes(type)) return;
    state.type = type;
    els.type.value = type;
    document.querySelectorAll("[data-type]").forEach((button) => {
      const active = button.dataset.type === type;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    updateCategories();
  }

  function setFilter(filter) {
    state.filter = filter;
    document.querySelectorAll("[data-filter]").forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderTransactions();
  }

  function setTheme(isDark, save = true) {
    document.body.classList.toggle("dark-mode", isDark);
    els.theme.setAttribute("aria-pressed", String(isDark));
    els.theme.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    els.themeIcon.textContent = isDark ? "☀" : "☾";
    if (save) {
      try { localStorage.setItem(THEME_KEY, isDark ? "enabled" : "disabled"); } catch (error) {
        console.warn("Could not save theme preference.", error);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    const description = els.description.value.trim();
    const amount = Number(els.amount.value);
    const category = els.category.value;
    const date = els.date.value;
    if (!description) return showError("Please enter a description.");
    if (!Number.isFinite(amount) || amount <= 0) return showError("Enter an amount greater than zero.");
    if (!date || date > localDateString()) return showError("Choose a valid date that is not in the future.");
    if (!category) return showError("Choose a category.");

    const transaction = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      description,
      amount: Math.round((amount + Number.EPSILON) * 100) / 100,
      category,
      date,
      type: state.type,
      createdAt: Date.now()
    };
    state.transactions.push(transaction);
    if (!persistTransactions()) {
      state.transactions.pop();
      return;
    }
    els.form.reset();
    els.date.value = localDateString();
    setType(state.type);
    els.error.hidden = true;
    render();
    showToast(`${state.type === "income" ? "Income" : "Expense"} saved successfully.`);
  }

  function showError(message) {
    els.error.textContent = message;
    els.error.hidden = false;
  }

  function handleDelete(id) {
    const transaction = state.transactions.find((item) => item.id === id);
    if (!transaction) return;
    const previous = state.transactions;
    state.transactions = previous.filter((item) => item.id !== id);
    if (!persistTransactions()) {
      state.transactions = previous;
      return;
    }
    render();
    showToast("Transaction deleted.");
  }

  function initialize() {
    state.transactions = loadTransactions();
    els.date.value = localDateString();
    els.today.textContent = new Intl.DateTimeFormat("en-NG", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(new Date());
    updateCategories();
    render();

    let savedTheme = "disabled";
    try { savedTheme = localStorage.getItem(THEME_KEY) || "disabled"; } catch (error) { console.warn("Theme preference unavailable.", error); }
    setTheme(savedTheme === "enabled", false);

    els.form.addEventListener("submit", handleSubmit);
    els.description.addEventListener("input", () => { els.error.hidden = true; });
    els.amount.addEventListener("input", () => { els.error.hidden = true; });
    els.search.addEventListener("input", (event) => {
      state.search = event.target.value;
      renderTransactions();
    });
    document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => setFilter(button.dataset.filter)));
    document.querySelectorAll("[data-type]").forEach((button) => button.addEventListener("click", () => setType(button.dataset.type)));
    els.list.addEventListener("click", (event) => {
      const button = event.target.closest("[data-delete]");
      if (button) handleDelete(button.dataset.delete);
    });
    els.theme.addEventListener("click", () => setTheme(!document.body.classList.contains("dark-mode")));
    els.exportButton.addEventListener("click", exportTransactions);
    $("#jumpToForm").addEventListener("click", () => {
      $("#addTransaction").scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => els.description.focus({ preventScroll: true }), 250);
    });
  }

  document.addEventListener("DOMContentLoaded", initialize);
})();
