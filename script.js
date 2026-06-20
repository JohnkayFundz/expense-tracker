const list = document.getElementById("transaction-list");

const type = document.getElementById("type");
const category = document.getElementById("category");function deleteTransaction(index) {
  transactions.splice(index, 1);

  saveToStorage();
  renderTransactions();
}

function updateStats() {
  // stats code here
}function renderTransactions() {
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
}const transaction = {
  description: description.value,
  amount: Number(amount.value),
  type: type.value,
  category: category.value
};description.value = "";
amount.value = "";localStorage.clear();
