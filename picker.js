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
button.textContent = 'Pick A Random Movie!';
button.style.cssText = `
  position: fixed;
  top: 60px;
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
  	left: 50%;
  	transform: translate(-50%, -50%);
  	background: #1a1a1a;
  	color: #e0e0e0;
  	padding: 30px 36px;
  	border-radius: 10px;
  	border: 1px solid #333;
  	z-index: 99999;
  	display: none;
  	width: 320px;
  	box-sizing: border-box;
  	text-align: center;
  	font-family: 'Georgia', serif;
`;
const link = document.createElement('a');
link.target = '_blank';
//overlay.appendChild(link);
//
link.style.cssText = `
  font-size: 20px;
  font-weight: bold;
  color: #00c030;
  text-decoration: none;
`;

const textAbove = document.createElement('p');
textAbove.textContent = "Your random movie is...";
overlay.appendChild(textAbove);

overlay.appendChild(link);

const textAfter = document.createElement('p');
textAfter.textContent = "!";
overlay.appendChild(textAfter);

document.body.appendChild(overlay);

// Button click handler
button.addEventListener('click', () => {
  browser.storage.local.get('exportedData').then(({ exportedData }) => {
    const random = exportedData[Math.floor(Math.random() * exportedData.length)];
    link.textContent = random.col2;
    link.href = random.col4;
    overlay.style.display = 'block';


    const w = overlay.offsetWidth;
    const h = overlay.offsetHeight;
    overlay.style.left = `calc(50vw - ${w / 2}px)`;
    overlay.style.top = `calc(50vh - ${h / 2}px`;
    overlay.style.transform = 'none';
  });
});
