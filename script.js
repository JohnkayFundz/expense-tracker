const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const list = document.getElementById("transaction-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const filter = document.getElementById("filter"); // add this in HTML

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let editId = null;

function generateID() {
  return Date.now();
}

function updateUI() {
  list.innerHTML = "";

  let total = 0;
  let incomeTotal = 0;
  let expenseTotal = 0;

  let filtered = transactions;

  if (filter && filter.value === "income") {
    filtered = transactions.filter(t => t.amount > 0);
  } else if (filter && filter.value === "expense") {
    filtered = transactions.filter(t => t.amount < 0);
  }

  filtered.forEach((transaction) => {
    total += transaction.amount;

    if (transaction.amount > 0) {
      incomeTotal += transaction.amount;
    } else {
      expenseTotal += Math.abs(transaction.amount);
    }

    const li = document.createElement("li");
    li.className = transaction.amount > 0 ? "income-item" : "expense-item";

    const sign = transaction.amount < 0 ? "-" : "+";

    li.innerHTML = `
      <div>
        <strong>${transaction.description}</strong><br>
        <small>${transaction.date}</small>
      </div>

      <div>
        ${sign}$${Math.abs(transaction.amount).toFixed(2)}

        <button class="edit-btn" data-id="${transaction.id}">Edit</button>
        <button class="delete-btn" data-id="${transaction.id}">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });

  balance.textContent = "$" + total.toFixed(2);
  income.textContent = incomeTotal.toFixed(2);
  expense.textContent = expenseTotal.toFixed(2);

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

/* ADD / UPDATE TRANSACTION */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const desc = description.value.trim();
  const amountValue = parseFloat(amount.value);

  if (!desc || isNaN(amountValue)) return;

  if (editId) {
    transactions = transactions.map(t =>
      t.id === editId
        ? { ...t, description: desc, amount: amountValue }
        : t
    );
    editId = null;
  } else {
    transactions.push({
      id: generateID(),
      description: desc,
      amount: amountValue,
      date: new Date().toLocaleDateString()
    });
  }

  updateUI();

  description.value = "";
  amount.value = "";
});

/* CLICK EVENTS (DELETE + EDIT) */
list.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains("delete-btn")) {
    transactions = transactions.filter(t => t.id !== id);
    updateUI();
  }

  if (e.target.classList.contains("edit-btn")) {
    const tx = transactions.find(t => t.id === id);

    description.value = tx.description;
    amount.value = tx.amount;

    editId = id;
  }
});

/* FILTER */
if (filter) {
  filter.addEventListener("change", updateUI);
}

updateUI();
