const express = require('express');
const app = express();
const port = 3001;

app.use(express.urlencoded({ extended: true }));

// Home Page
app.get('/', (req, res) => {
  res.send(`
    <h2>Search Page</h2>
    <form method="POST" action="/search">
      <input type="text" name="query" placeholder="Enter search term" required>
      <button type="submit">Search</button>
    </form>
  `);
});

// Input validation function
function isMalicious(input) {
  const lower = input.toLowerCase();

  // Very basic XSS detection
  const xssPattern = /<script|<\/script|onerror=|onload=|<.*?>/;
  if (xssPattern.test(lower)) return true;

  // Very basic SQLi detection
  const sqliPattern = /('|--|;|=|union|select|insert|drop|or\s+1=1)/;
  if (sqliPattern.test(lower)) return true;

  return false;
}

// Result Page
app.post('/search', (req, res) => {
  const query = req.body.query || '';

  if (isMalicious(query)) {
    // Malicious input: stay on home page with empty field
    return res.redirect('/');
  }

  // Safe input: show result page
  res.send(`
    <h2>Search Result</h2>
    <p>You searched for: <strong>${escapeHtml(query)}</strong></p>
    <form action="/" method="get">
      <button type="submit">Back</button>
    </form>
  `);
});

// Escape HTML for safe rendering
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
