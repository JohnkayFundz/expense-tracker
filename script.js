const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const list = document.getElementById("transaction-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const filter = document.getElementById("filter");
const chartCanvas = document.getElementById("expenseChart");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let editId = null;
let chart;

const format = (num) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);

function generateID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/* ---------- CHART ---------- */
function renderChart(incomeTotal, expenseTotal) {
  if (chart) chart.destroy();

  chart = new Chart(chartCanvas, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          data: [incomeTotal, expenseTotal],
          backgroundColor: ["#22c55e", "#ef4444"],
          borderWidth: 0,
        },
      ],
    },
  });
}

/* ---------- UI ---------- */
function updateUI() {
  list.innerHTML = "";

  let incomeTotal = 0;
  let expenseTotal = 0;

  let filtered = transactions;

  if (filter?.value === "income") {
    filtered = transactions.filter((t) => t.amount > 0);
  } else if (filter?.value === "expense") {
    filtered = transactions.filter((t) => t.amount < 0);
  }

  filtered.forEach((t) => {
    if (t.amount > 0) incomeTotal += t.amount;
    else expenseTotal += Math.abs(t.amount);

    const li = document.createElement("li");
    li.className = t.amount > 0 ? "income-item" : "expense-item";

    li.innerHTML = `
      <div>
        <strong>${t.description}</strong><br>
        <small>${t.date}</small>
      </div>

      <div>
        ${format(t.amount)}

        <button class="edit-btn" data-id="${t.id}">Edit</button>
        <button class="delete-btn" data-id="${t.id}">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });

  const balanceTotal = incomeTotal - expenseTotal;

  balance.textContent = format(balanceTotal);
  income.textContent = format(incomeTotal);
  expense.textContent = format(expenseTotal);

  renderChart(incomeTotal, expenseTotal);

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

/* ---------- ADD / EDIT ---------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = description.value.trim();
  const amt = parseFloat(amount.value);

  if (!desc || isNaN(amt)) return;

  if (editId) {
    transactions = transactions.map((t) =>
      t.id === editId ? { ...t, description: desc, amount: amt } : t
    );
    editId = null;
  } else {
    transactions.push({
      id: generateID(),
      description: desc,
      amount: amt,
      date: new Date().toLocaleDateString(),
    });
  }

  description.value = "";
  amount.value = "";

  updateUI();
});

/* ---------- DELETE / EDIT ---------- */
list.addEventListener("click", (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    transactions = transactions.filter((t) => t.id !== id);
    updateUI();
  }

  if (e.target.classList.contains("edit-btn")) {
    const tx = transactions.find((t) => t.id === id);
    description.value = tx.description;
    amount.value = tx.amount;
    editId = id;
  }
});

/* ---------- FILTER ---------- */
filter?.addEventListener("change", updateUI);

updateUI();
