const transaction = {
  id: Date.now(),
  description: description.value,
  amount: Number(amount.value),
  type: type.value,
  category: category.value,
  date: new Date().toLocaleDateString()
};function deleteTransaction(id) {
  transactions = transactions.filter(
    transaction => transaction.id !== id
  );

  saveToStorage();
  renderTransactions();
}filteredTransactions.forEach((transaction) => {li.innerHTML = `
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
`;searchInput.addEventListener(
  "input",
  renderTransactions
);

filterCategory.addEventListener(
  "change",
  renderTransactions
);
