const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filter-category");

const averageExpenseEl =
  document.getElementById("average-expense");

const topCategoryEl =
  document.getElementById("top-category");const transaction = {
  description: description.value,
  amount: Number(amount.value),
  type: type.value,
  category: category.value,
  date: new Date().toLocaleDateString()
};function updateStats() {
  let income = 0;
  let expense = 0;
  let largestExpense = 0;

  let expenseCount = 0;

  const categoryTotals = {};

  transactions.forEach(transaction => {

    if (transaction.type === "income") {
      income += transaction.amount;
    } else {

      expense += transaction.amount;
      expenseCount++;

      if (transaction.amount > largestExpense) {
        largestExpense = transaction.amount;
      }

      categoryTotals[transaction.category] =
        (categoryTotals[transaction.category] || 0)
        + transaction.amount;
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

  const average =
    expenseCount > 0
      ? expense / expenseCount
      : 0;

  averageExpenseEl.textContent =
    `$${average.toFixed(2)}`;

  let topCategory = "None";
  let highestTotal = 0;

  for (const category in categoryTotals) {

    if (categoryTotals[category] > highestTotal) {

      highestTotal =
        categoryTotals[category];

      topCategory = category;
    }
  }

  topCategoryEl.textContent =
    topCategory;
}function renderTransactions() {

  list.innerHTML = "";

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
        ${transaction.date}
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
);
