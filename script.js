darkModeToggle.addEventListener("change", () => {
  const isDark = darkModeToggle.checked;
  document.body.classList.toggle("dark-mode", isDark);

  // Save preference
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");

  renderCategoryChart(transactions); // re-render chart with new colors
});
window.addEventListener("DOMContentLoaded", () => {
  const darkPref = localStorage.getItem("darkMode");
  if (darkPref === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  } else {
    document.body.classList.remove("dark-mode");
    darkModeToggle.checked = false;
  }

  renderCategoryChart(transactions); // render chart with correct theme
});
