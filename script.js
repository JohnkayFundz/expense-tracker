const categoryColors = {
  Food: "rgba(75, 192, 192, 0.6)",       // teal
  Transport: "rgba(255, 99, 132, 0.6)",  // red
  Entertainment: "rgba(255, 206, 86, 0.6)", // yellow
  Shopping: "rgba(54, 162, 235, 0.6)",   // blue
  Bills: "rgba(153, 102, 255, 0.6)",     // purple
  Other: "rgba(255, 159, 64, 0.6)"       // orange
};
const chartTypeSelect = document.getElementById("chartType");
let categoryChart; // global reference

function renderCategoryChart(filteredTransactions) {
  // Aggregate totals by category
  const categoryTotals = {};

  filteredTransactions.forEach(t => {
    if (!categoryTotals[t.category]) {
      categoryTotals[t.category] = { income: 0, expense: 0 };
    }
    if (t.type === "income") {
      categoryTotals[t.category].income += t.amount;
    } else {
      categoryTotals[t.category].expense += t.amount;
    }
  });

  const categories = Object.keys(categoryTotals);
  const incomeData = categories.map(c => categoryTotals[c].income);
  const expenseData = categories.map(c => categoryTotals[c].expense);

  const ctx = document.getElementById("categoryChart").getContext("2d");

  // Destroy old chart if exists
  if (categoryChart) {
    categoryChart.destroy();
  }

  const selectedType = chartTypeSelect.value;

  if (selectedType === "bar") {
    categoryChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: categories,
        datasets: [
          {
            label: "Income",
            data: incomeData,
            backgroundColor: "rgba(75, 192, 192, 0.6)"
          },
          {
            label: "Expense",
            data: expenseData,
            backgroundColor: "rgba(255, 99, 132, 0.6)"
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Income vs Expense by Category"
          }
        }
      }
    });
  } else {
    // For pie/doughnut, combine income + expense per category
    const totalData = categories.map(c => categoryTotals[c].income + categoryTotals[c].expense);

    categoryChart = new Chart(ctx, {
      type: selectedType, // "pie" or "doughnut"
      data: {
        labels: categories,
        datasets: [
          {
            label: "Total",
            data: totalData,
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(153, 102, 255, 0.6)",
              "rgba(255, 159, 64, 0.6)"
            ]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Total by Category"
          }
        }
      }
    });
  }
}

// Re-render chart when chart type changes
chartTypeSelect.addEventListener("change", () => {
  renderCategoryChart(transactions);
});
