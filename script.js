list.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;

  const isDelete = button.classList.contains("delete-btn");
  const isEdit = button.classList.contains("edit-btn");

  if (isDelete) {
    transactions = transactions.filter((t) => t.id !== id);
    updateUI();
    return;
  }

  if (isEdit) {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    description.value = tx.description;
    amount.value = tx.amount;
    editId = id;
  }
});
