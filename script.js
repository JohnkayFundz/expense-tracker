function deleteTransaction(id) {
  transactions = transactions.filter(
    transaction => transaction.id !== id
  );

  saveToStorage();
  renderTransactions();
}

filteredTransactions.forEach((transaction) => {
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
        ${transaction.date || "No Date"}
      </small>
    </div>

    <div>
      ${sign}$${transaction.amount}
    </div>

    <button onclick="deleteTransaction(${transaction.id})">
      ❌
    </button>
  `;

  list.appendChild(li);
});searchInput.addEventListener(
  "input",
  renderTransactions
);

filterCategory.addEventListener(
  "change",
  renderTransactions
);form.addEventListener("submit", function (e) {
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
  renderTransactions();
});
