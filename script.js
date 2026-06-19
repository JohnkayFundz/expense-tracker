const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const list = document.getElementById("transaction-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateUI() {
  list.innerHTML = "";

  let total = 0;
  let incomeTotal = 0;
  let expenseTotal = 0;

  transactions.forEach((transaction, index) => {
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
        <button class="delete-btn" data-index="${index}">
          Delete
        </button>
      </div>
    `;

    list.appendChild(li);
  });

  balance.textContent = "$" + total.toFixed(2);
  income.textContent = incomeTotal.toFixed(2);
  expense.textContent = expenseTotal.toFixed(2);

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!description.value || !amount.value) return;

  transactions.push({
    description: description.value,
    amount: Number(amount.value),
    date: new Date().toLocaleDateString()
  });

  updateUI();

  description.value = "";
  amount.value = "";
});

// EVENT DELEGATION (clean delete system)
list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.dataset.index;
    transactions.splice(index, 1);
    updateUI();
  }
});

updateUI();
