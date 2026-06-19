const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const list = document.getElementById("transaction-list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveToStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTransactions() {
  list.innerHTML = "";

  transactions.forEach((transaction, index) => {
    const li = document.createElement("li");

    <span>${transaction.amount > 0 ? "+" : ""}$${transaction.amount}</span>
      <button onclick="deleteTransaction(${index})">❌</button>
    `;

    list.appendChild(li);
  });
}

function deleteTransaction(index) {
  transactions.splice(index, 1);

  saveToStorage();
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
