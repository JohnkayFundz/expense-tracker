# Spendwise — Expense Tracker

A responsive, mobile-friendly personal finance dashboard built with HTML, CSS, and vanilla JavaScript. Track income and expenses in Nigerian naira (NGN), understand your balance, and review spending categories.

## Features

- Dashboard summary for total balance, income, and expenses
- Add income or expense transactions with description, amount, category, and date
- Search and filter transaction history
- Delete transactions
- Automatic spending breakdown by category
- Light and dark themes with a saved preference
- Responsive layout for phones, tablets, and desktops
- Browser local storage for transactions and theme preferences
- No account, backend, external API, or paid service required

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.

The project uses plain HTML, CSS, and JavaScript, so there is no package installation or build step.

## Deploy with GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Choose **Deploy from a branch**.
3. Select the `main` branch and `/(root)`, then save.
4. Wait for GitHub Pages to publish the site.

## Privacy

Transactions are stored in this browser using `localStorage`. They are not sent to a server. Clearing browser storage or switching browsers/devices may remove or hide your saved transactions, so this version is intended for personal tracking on one device. Do not treat it as a bank account or official financial record.

## Project files

```text
expense-tracker/
├── index.html   # Dashboard and transaction form
├── style.css    # Responsive layout, themes, and components
├── script.js    # Transaction logic, storage, and summaries
├── README.md
└── LICENSE
```

## Technology

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Browser localStorage

## License

MIT
