const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");

const type = document.getElementById("type");
const category = document.getElementById("category");

const list = document.getElementById("transaction-list");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

const totalTransactionsEl = document.getElementById("total-transactions");
const largestExpenseEl = document.getElementById("largest-expense");

const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filter-category");

const averageExpenseEl =
  document.getElementById("average-expense");

const topCategoryEl =
  document.getElementById("top-category");
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

  transactions.forEach(transaction => {
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
        <small>${transaction.category}</small>
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
    description: description.value,
    amount: Number(amount.value),
    type: type.value,
    category: category.value
  };

  transactions.push(transaction);

  saveToStorage();
  renderTransactions();

  description.value = "";
  amount.value = "";

  type.value = "expense";
  category.value = "Food";

  description.focus();
});

renderTransactions();
const searchTerm =
  searchInput.value.toLowerCase();

const selectedCategory =
  filterCategory.value;

const filteredTransactions =
  transactions.filter(transaction => {

    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm);

    const matchesCategory =
      selectedCategory === "all" ||
      transaction.category === selectedCategory;

    return matchesSearch &&
           matchesCategory;
  });
