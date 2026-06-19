let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveToStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}function updateStorageAndUI() {
  saveToStorage();
  updateUI();
}transactions.push(newTransaction);
updateStorageAndUI();transactions = transactions.filter((t) => t.id !== id);
updateStorageAndUI();transactions = transactions.map((t) =>
  t.id === editId ? { ...t, description: desc, amount: amt } : t
);

updateStorageAndUI();transactions.push / filter / mapupdateStorageAndUI()
