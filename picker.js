const username = window.location.pathname.split('/')[1]; 
const EXPORT_URL = `https://letterboxd.com/${username}/watchlist/export/`;

browser.runtime.sendMessage({ type: "FETCH_EXPORT", url: EXPORT_URL })
  .then(response => {
    const parsed = Papa.parse(response.text, { header: true, skipEmptyLines: true });
    const data = parsed.data.map(row => ({
      col2: row[Object.keys(row)[1]],
      col4: row[Object.keys(row)[3]]
    }));
    browser.storage.local.set({ exportedData: data });
  });

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
  color: #000000;
  padding: 30px 36px;
  border-radius: 10px;
  border: 1px solid #333;
  z-index: 99999;
  display: none;
  box-sizing: border-box;
  text-align: center;
  font-family: 'Georgia', serif;
`;
overlay.style.backgroundImage = `url("${browser.runtime.getURL('gojo_nahidwin.png')}")`;
overlay.style.backgroundSize = 'cover';
overlay.style.backgroundPosition = 'center';
overlay.style.width = '550px';
overlay.style.height = '750px';

const link = document.createElement('a');
link.target = '_blank';
//overlay.appendChild(link);
//

const textAbove = document.createElement('p');
textAbove.textContent = "Your random movie is...";
// overlay.appendChild(textAbove);
// 
// overlay.appendChild(link);
// 
const textAfter = document.createElement('p');
textAfter.textContent = "!";
// overlay.appendChild(textAfter);
//
const textClickme = document.createElement('p');
textClickme.textContent = "Click the movie name :)";

const textContainer = document.createElement('div');
textContainer.style.cssText = `
  position: absolute;
  top: 70px;
  right: 25px;
`;

textAbove.style.cssText = `
  position: absolute;
  top: 20px;
  left: -160px;
  font-size: 12px;
`;

link.style.cssText = `
  position: absolute;
  top: 60px;
  right: 0px;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  white-space: nowrap;
`;

textAfter.style.cssText = `
  position: absolute;
  top: 100px;
  left: -100px;
  font-size: 12px;
`;

textClickme.style.cssText = `
  position: absolute;
  top: 120px;
  left: -120px;
  font-size: 12px;
`;

textAbove.style.whiteSpace = 'nowrap';
link.style.whiteSpace = 'nowrap';
textAfter.style.whiteSpace = 'nowrap';

textContainer.appendChild(textAbove);
textContainer.appendChild(link);
textContainer.appendChild(textAfter);
textContainer.appendChild(textClickme);
overlay.appendChild(textContainer);

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

const closeBtn = document.createElement('button');
closeBtn.textContent = '×';
closeBtn.style.cssText = `
  position: absolute;
  top: 8px;
  right: 10px;
  border: 2px solid black;
  color: black;
  font-size: 18px;
  cursor: pointer;
  border-radius: 4px;
`;
closeBtn.addEventListener('click', () => overlay.style.display = 'none');
overlay.appendChild(closeBtn);
