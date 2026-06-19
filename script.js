list.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;

  if (button.classList.contains("delete-btn")) {
    transactions = transactions.filter((t) => t.id !== id);
    updateUI();
    return;
  }

  if (!button.classList.contains("edit-btn")) return;

  const tx = transactions.find((t) => t.id === id);
  if (!tx) return;

  description.value = tx.description;
  amount.value = tx.amount;
  editId = id;

  description.focus();
});description.select();
