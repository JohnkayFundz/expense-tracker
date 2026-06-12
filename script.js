```javascript
const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const list = document.getElementById("transaction-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let transactions =
  JSON.parse(localStorage.getItem("transactions")) || [];

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

    li.innerHTML = `
      ${transaction.description}: $${transaction.amount}
      <button onclick="deleteTransaction(${index})">
        Delete
      </button>
    `;

    list.appendChild(li);
  });

  balance.textContent = "$" + total.toFixed(2);
  income.textContent = incomeTotal.toFixed(2);
  expense.textContent = expenseTotal.toFixed(2);

  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  transactions.push({
    description: description.value,
    amount: Number(amount.value)
  });

  updateUI();

  description.value = "";
  amount.value = "";
});

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

updateUI();
```
