const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const searchInput =
  document.getElementById("search");
const type = document.getElementById("type");
const category = document.getElementById("category");

const list = document.getElementById("transaction-list");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

const totalTransactionsEl = document.getElementById("total-transactions");
const largestExpenseEl = document.getElementById("largest-expense");

const emptyState = document.getElementById("empty-state");

let transactions =
  JSON.parse(localStorage.getItem("transactions")) || [];

function saveToStorage() {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}

function updateStats() {
  let income = 0;
  let expense = 0;
  let largestExpense = 0;

  const searchTerm =
  searchInput.value.toLowerCase();

const filteredTransactions =
  transactions.filter(transaction =>
    transaction.description
      .toLowerCase()
      .includes(searchTerm)
  );

filteredTransactions.forEach((transaction, index) => {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;

      if (transaction.amount > largestExpense) {
        largestExpense = transaction.amount;
      }
    }
  });

  const balance = income - expense;

  balanceEl.textContent = `$${balance.toFixed(2)}`;
  incomeEl.textContent = `$${income.toFixed(2)}`;
  expenseEl.textContent = `$${expense.toFixed(2)}`;

  totalTransactionsEl.textContent =
    transactions.length;

  largestExpenseEl.textContent =
    `$${largestExpense.toFixed(2)}`;
}

function renderTransactions() {
  list.innerHTML = "";

  if (transactions.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  transactions.forEach((transaction, index) => {
    const li = document.createElement("li");

    const sign =
      transaction.type === "income"
        ? "+"
        : "-";

    li.innerHTML = `
      <div>
        <strong>${transaction.description}</strong>
        <br>
       <small>
  ${transaction.category}
  •
  ${transaction.date}
</small>
      </div>

      <div>
        ${sign}$${transaction.amount}
      </div>

      <button onclick="deleteTransaction(${index})">
        ❌
      </button>
    `;

    list.appendChild(li);
  });

  updateStats();
}

function deleteTransaction(index) {
  transactions.splice(index, 1);

  saveToStorage();
  renderTransactions();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

const transaction = {
  id: Date.now(),
  description: description.value,
  amount: Number(amount.value),
  type: type.value,
  category: category.value,
  date: new Date().toLocaleDateString()
};

  transactions.push(transaction);

  saveToStorage();
  searchInput.addEventListener(
  "input",
  renderTransactions
);
  renderTransactions();

  description.value = "";
  amount.value = "";

  type.value = "expense";
  category.value = "Food";

  description.focus();
});

renderTransactions();
