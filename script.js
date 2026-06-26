const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", darkModeToggle.checked);
  renderCategoryChart(transactions); // re-render chart with new colors
});

function renderCategoryChart(filteredTransactions) {
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
  const totalData = categories.map(c => categoryTotals[c].income + categoryTotals[c].expense);
  const ctx = document.getElementById("categoryChart").getContext("2d");

  if (categoryChart) categoryChart.destroy();

  const grandTotal = totalData.reduce((sum, val) => sum + val, 0);

  // Adjust colors based on dark mode
  const isDark = document.body.classList.contains("dark-mode");
  const textColor = isDark ? "#e0e0e0" : "#000000";

  categoryChart = new Chart(ctx, {
    type: chartTypeSelect.value,
    data: {
      labels: categories,
      datasets: [
        {
          label: "Total",
          data: totalData,
          backgroundColor: categories.map(c => categoryColors[c] || "rgba(200,200,200,0.6)")
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Totals and Percentages by Category",
          color: textColor
        },
        legend: {
          labels: {
            color: textColor,
            generateLabels: function (chart) {
              const data = chart.data;
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percent = ((value / grandTotal) * 100).toFixed(2);
                return {
                  text: `${label}: $${value.toFixed(2)} (${percent}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  index: i
                };
              });
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              const percent = ((value / grandTotal) * 100).toFixed(2);
              return `${context.label}: $${value.toFixed(2)} (${percent}%)`;
            }
          }
        }
      }
    }
  });
}
