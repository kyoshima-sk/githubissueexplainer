console.log('Content script loaded');

async function scrapeIssueComments() {
  console.log('Scraping issue comments');
  const comments = [];
  document.querySelectorAll('.js-comment-body').forEach(comment => {
    comments.push(comment.innerText);
  });
  console.log('Scraped comments:', comments);
  return comments;
}

async function sendToLLMAPI(comments) {
  console.log('Sending comments to LLM API');
  const response = await new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      type: 'proxyRequest',
      url: 'https://api.ai71.ai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ai71-api-1767965a-61fd-47a9-8965-6606fac97950'
      },
      body: JSON.stringify({
        model: 'tiiuae/falcon-180B-chat',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: `Here are the comments from the GitHub issue: ${comments.join('\n')}` }
        ]
      })
    }, response => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(response);
      }
    });
  });

  console.log('Explanation received:', response);
  if (response.error) {
    alert(response.error);
  } else {
    alert(response.choices[0].message.content);
  }
}

async function main() {
  console.log('Main function started');
  const comments = await scrapeIssueComments();
  await sendToLLMAPI(comments);
  console.log('Main function completed');
}

main();
