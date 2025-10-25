const wordList = document.getElementById("word-list");
const addButton = document.getElementById("add-word");
const clearButton = document.getElementById("clear-all");
const input = document.getElementById("new-word");

chrome.storage.local.get(["blockedWords"], ({ blockedWords }) => {
  const words = blockedWords || [];
  renderList(words);
});

function renderList(words) {
  wordList.innerHTML = "";
  words.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    const del = document.createElement("button");
    del.textContent = "✕";
    del.addEventListener("click", () => removeWord(word));
    li.appendChild(del);
    wordList.appendChild(li);
  });
}

addButton.addEventListener("click", () => {
  const newWord = input.value.trim().toLowerCase();
  if (!newWord) return;

  chrome.storage.local.get(["blockedWords"], ({ blockedWords }) => {
    const words = blockedWords || [];
    if (!words.includes(newWord)) {
      words.push(newWord);
      chrome.storage.local.set({ blockedWords: words }, () => {
        input.value = "";
        renderList(words);
      });
    }
  });
});

function removeWord(word) {
  chrome.storage.local.get(["blockedWords"], ({ blockedWords }) => {
    const words = (blockedWords || []).filter(w => w !== word);
    chrome.storage.local.set({ blockedWords: words }, () => renderList(words));
  });
}

clearButton.addEventListener("click", () => {
  chrome.storage.local.set({ blockedWords: [] }, () => renderList([]));
});
