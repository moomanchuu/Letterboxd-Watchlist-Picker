browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FETCH_EXPORT") {
    fetch(message.url)
      .then(res => res.text())
      .then(text => sendResponse({ text }))
      .catch(err => sendResponse({ error: err.message }));
    return true; // keeps the message channel open for async response
  }
});
