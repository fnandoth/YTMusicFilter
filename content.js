let blockedWords = [];
let lastSkippedTitle = "";

chrome.storage.local.get(["blockedWords"], ({ blockedWords: saved }) => {
  blockedWords = saved || [];
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedWords) {
    blockedWords = changes.blockedWords.newValue || [];
  }
});

function eraseBlockedSongs() {
  const queueItems = document.querySelectorAll("ytmusic-player-queue-item");
  const currentTitleEl = document.querySelector(".title.style-scope.ytmusic-player-bar");
  const currentTitle = currentTitleEl?.textContent?.toLowerCase() || "";

  queueItems.forEach(item => {
    const titleEl = item.querySelector(".song-title");
    if (!titleEl) return;
    const titleText = titleEl.textContent.toLowerCase();
    if (blockedWords.some(w => titleText.includes(w))) item.remove();
  });

  const shouldSkip = blockedWords.some(w => currentTitle.includes(w));
  if (shouldSkip && currentTitle !== lastSkippedTitle) {
    lastSkippedTitle = currentTitle;
    skipSong();
  }
}

function skipSong() {
  const skipButton = document.querySelector(".next-button button");
  if (skipButton) setTimeout(() => skipButton.click(), 300);
}

const observer = new MutationObserver(eraseBlockedSongs);
observer.observe(document.body, { childList: true, subtree: true });
eraseBlockedSongs();
