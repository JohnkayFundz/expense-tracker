const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const list = document.getElementById("transaction-list");const type = document.getElementById("type");
const category = document.getElementById("category");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

const totalTransactionsEl = document.getElementById("total-transactions");
const largestExpenseEl = document.getElementById("largest-expense");

const emptyState = document.getElementById("empty-state");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveToStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTransactions() {
  list.innerHTML = "";

  transactions.forEach((transaction, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${transaction.description}</span>
      <span>${transaction.amount > 0 ? "+" : ""}$${transaction.amount}</span>
      <button onclick="deleteTransaction(${index})">❌</button>
    `;

    list.appendChild(li);
  });
}

function deleteTransaction(index) {
  transactions.splice(index, 1);

  saveToStorage();function updateStats() {
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

  totalTransactionsEl.textContent = transactions.length;
  largestExpenseEl.textContent = `$${largestExpense.toFixed(2)}`;
}
  renderTransactions();
}

renderTransactions();

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const transaction = {
    description: description.value,
    amount: Number(amount.value)
  };

  transactions.push(transaction);

  saveToStorage();
  renderTransactions();

  description.value = "";
  amount.value = "";
  description.focus();
});
