chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'proxyRequest') {
    fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text(); // Capture the raw response text
    })
    .then(text => {
      try {
        const data = JSON.parse(text);
        console.log('Proxy response:', data);
        sendResponse(data);
      } catch (error) {
        console.error('Failed to parse JSON:', text);
        sendResponse({ error: 'Failed to parse JSON' });
      }
    })
    .catch(error => {
      console.error('Proxy error:', error);
      sendResponse({ error: error.message });
    });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});
