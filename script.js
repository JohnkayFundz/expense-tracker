function saveToStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}let transactions = JSON.parse(localStorage.getItem("transactions")) || [];transactions.push(newTransaction);
saveToStorage();
updateUI();transactions = transactions.filter((t) => t.id !== id);
saveToStorage();
updateUI();transactions = transactions.map((t) =>
  t.id === editId ? { ...t, description: desc, amount: amt } : t
);

saveToStorage();
updateUI();function updateStorageAndUI() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateUI();
}updateStorageAndUI();
