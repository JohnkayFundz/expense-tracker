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

  transactions.forEach((transaction) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${transaction.description}</span>
      <span>$${transaction.amount}</span>
    `;

    list.appendChild(li);
  });
}

renderTransactions();

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const transaction = {
    description: description.value,
    amount: Number(amount.value)
  };

  description.value = "";
  amount.value = "";

  description.focus();
});
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
