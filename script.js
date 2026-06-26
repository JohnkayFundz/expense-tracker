const sortSelect = document.getElementById("sort");

function renderTransactions() {
  list.innerHTML = "";

  const searchTerm = searchInput.value.toLowerCase();
  let filteredTransactions = transactions.filter(t =>
    t.description.toLowerCase().includes(searchTerm)
  );

  // Apply sorting
  const sortValue = sortSelect.value;
  if (sortValue === "newest") {
    filteredTransactions.sort((a, b) => b.id - a.id);
  } else if (sortValue === "oldest") {
    filteredTransactions.sort((a, b) => a.id - b.id);
  } else if (sortValue === "highest") {
    filteredTransactions.sort((a, b) => b.amount - a.amount);
  } else if (sortValue === "lowest") {
    filteredTransactions.sort((a, b) => a.amount - b.amount);
  }

  if (filteredTransactions.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  filteredTransactions.forEach(transaction => {
    const li = document.createElement("li");
    const sign = transaction.type === "income" ? "+" : "-";

    li.innerHTML = `
      <div>
        <strong>${transaction.description}</strong><br>
        <small>${transaction.category} • ${transaction.date}</small>
      </div>
      <div>${sign}$${transaction.amount}</div>
      <button onclick="deleteTransaction(${transaction.id})">❌</button>
    `;

    list.appendChild(li);
  });

  updateStats(filteredTransactions);
}

// Re-render when sort option changes
sortSelect.addEventListener("change", renderTransactions);
