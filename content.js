const blockedWords = ["remix", "live", "sped up", "slowed", "reverb"];
let lastSkippedTitle = "";

function eraseBlockedSongs() {
  const queueItems = document.querySelectorAll("ytmusic-player-queue-item");
  console.log(`[YTM Filter] Revisando ${queueItems.length} canciones en cola...`);

  const currentTitleEl = document.querySelector(".title.style-scope.ytmusic-player-bar");
  const currentTitle = currentTitleEl?.textContent?.toLowerCase() || "";

  queueItems.forEach(item => {
    const titleEl = item.querySelector(".song-title");
    if (!titleEl) return;
    const titleText = titleEl.textContent.toLowerCase();
    const shouldErase = blockedWords.some(word => titleText.includes(word));
    if (shouldErase) {
      console.log(`[YTM Filter] Eliminando de cola: ${titleText}`);
      item.remove();
    }
  });

  const shouldSkip = blockedWords.some(word => currentTitle.includes(word));
  if (shouldSkip && currentTitle !== lastSkippedTitle) {
    console.log(`[YTM Filter] Saltando canción actual: ${currentTitle}`);
    lastSkippedTitle = currentTitle;
    skipSong();
  }
}

function skipSong() {
  const skipButton = document.querySelector(".next-button button");
  if (skipButton) {
    setTimeout(() => skipButton.click(), 300);
  } else {
    console.warn("[YTM Filter] No se encontró el botón 'Siguiente'.");
  }
}

const observer = new MutationObserver(eraseBlockedSongs);
observer.observe(document.body, { childList: true, subtree: true });

eraseBlockedSongs();
