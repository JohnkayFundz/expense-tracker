const tx = transactions.find((t) => t.id === id);
if (!tx) return;list.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;

  if (button.classList.contains("delete-btn")) {
    transactions = transactions.filter((t) => t.id !== id);
    updateUI();
  }

  if (button.classList.contains("edit-btn")) {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    description.value = tx.description;
    amount.value = tx.amount;
    editId = id;
  }
});function renderChart(incomeTotal, expenseTotal) {
  if (!chart) {
    chart = new Chart(chartCanvas, {
      type: "doughnut",
      data: {
        labels: ["Income", "Expense"],
        datasets: [
          {
            data: [incomeTotal, expenseTotal],
            backgroundColor: ["#22c55e", "#ef4444"],
            borderWidth: 0,
          },
        ],
      },
    });
  } else {
    chart.data.datasets[0].data = [incomeTotal, expenseTotal];
    chart.update();
  }
}const type = filter?.value;

const filtered = transactions.filter((t) => {
  if (type === "income") return t.amount > 0;
  if (type === "expense") return t.amount < 0;
  return true;
});editId = null;
form.reset();
