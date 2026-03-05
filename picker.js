const username = window.location.pathname.split('/')[1]; 
const EXPORT_URL = `https://letterboxd.com/${username}/watchlist/export/`;

browser.runtime.sendMessage({ type: "FETCH_EXPORT", url: EXPORT_URL });


fetch(EXPORT_URL)
  .then(res => res.text())
  .then(text => {
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    const data = parsed.data.map(row => {
      return {
        col2: row["Name"],
        col4: row["Letterboxd URL"]
      };
    });
    browser.storage.local.set({ exportedData: data });
    console.log(data);
  })
  .catch(err => console.error("Fetch failed:", err));

// Create button
const button = document.createElement('button');
button.textContent = 'Pick Random';
button.style.cssText = `
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  padding: 10px 20px;
  cursor: pointer;
`;
document.body.appendChild(button);

// Create overlay
const overlay = document.createElement('div');
overlay.style.cssText = `
  position: fixed;
  top: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  z-index: 9999;
  display: none;
`;
const link = document.createElement('a');
link.target = '_blank';
overlay.appendChild(link);
document.body.appendChild(overlay);

// Button click handler
button.addEventListener('click', () => {
  browser.storage.local.get('exportedData').then(({ exportedData }) => {
    const random = exportedData[Math.floor(Math.random() * exportedData.length)];
    link.textContent = random.col2;
    link.href = random.col4;
    overlay.style.display = 'block';
  });
});
