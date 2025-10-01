// Elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const chatList = document.getElementById('chat-list');
const searchChatInput = document.getElementById('search-chat');
const newChatBtn = document.getElementById('new-chat-btn');
const narrowNewChatBtn = document.getElementById('narrow-new-chat');
const narrowSearchBtn = document.getElementById('narrow-search');
const narrowModelsBtn = document.getElementById('narrow-models');
const mainChat = document.getElementById('main-chat');
const getApiBtn = document.getElementById('get-api-btn');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const userInput = document.getElementById('user-input');
const chatContainer = document.getElementById('chat-container');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');

// Chat state
let chats = [{ id: 1, title: "First Chat" }];
let menuOpenChatId = null;
let history = []; // <-- keeps AI chat history

// --- RENDER CHATS ---
function renderChats(filter = "") {
  chatList.innerHTML = "";

  const filteredChats = chats.filter(c =>
    c.title.toLowerCase().includes(filter.toLowerCase())
  );

  filteredChats.forEach(chat => {
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.dataset.id = chat.id;

    const titleSpan = document.createElement('span');
    titleSpan.textContent = chat.title;

    const menuBtn = document.createElement('button');
    menuBtn.className = 'chat-menu-btn';
    menuBtn.innerHTML = '⋮';
    menuBtn.title = 'Chat options';

    const menu = document.createElement('div');
    menu.className = 'chat-menu';

    ['Share', 'Rename', 'Delete'].forEach(action => {
      const btn = document.createElement('button');
      btn.textContent = action;
      btn.addEventListener('click', e => {
        e.stopPropagation();
        handleChatAction(action.toLowerCase(), chat.id);
        closeMenu();
      });
      menu.appendChild(btn);
    });

    menuBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (menuOpenChatId === chat.id) {
        closeMenu();
      } else {
        openMenu(chat.id, chatItem, menu);
      }
    });

    document.addEventListener('click', closeMenu);

    chatItem.appendChild(titleSpan);
    chatItem.appendChild(menuBtn);
    chatItem.appendChild(menu);

    chatItem.addEventListener('click', () => {
      alert(`Chat switching not implemented yet.`);
    });

    chatList.appendChild(chatItem);
  });
}

function openMenu(chatId, chatItem, menu) {
  closeMenu();
  menuOpenChatId = chatId;
  chatItem.classList.add('menu-open');
}

function closeMenu() {
  if (menuOpenChatId === null) return;
  const openMenuItem = document.querySelector('.chat-item.menu-open');
  if (openMenuItem) openMenuItem.classList.remove('menu-open');
  menuOpenChatId = null;
}

// --- CHAT ACTION HANDLERS ---
function handleChatAction(action, chatId) {
  const chat = chats.find(c => c.id === chatId);
  if (!chat) return;

  if (action === 'share') {
    alert(`Sharing chat: "${chat.title}"`);
  } else if (action === 'rename') {
    const newTitle = prompt('Rename chat:', chat.title);
    if (newTitle && newTitle.trim() !== '') {
      chat.title = newTitle.trim();
      renderChats(searchChatInput.value);
    }
  } else if (action === 'delete') {
    if (confirm(`Are you sure you want to delete "${chat.title}"?`)) {
      chats = chats.filter(c => c.id !== chatId);
      renderChats(searchChatInput.value);
    }
  }
}

// --- SEARCH CHAT ---
searchChatInput.addEventListener('input', e => {
  renderChats(e.target.value);
});

// --- NEW CHAT ---
newChatBtn.addEventListener('click', () => {
  const newTitle = prompt('Enter chat name:');
  if (newTitle && newTitle.trim() !== '') {
    const newId = chats.length ? Math.max(...chats.map(c => c.id)) + 1 : 1;
    chats.push({ id: newId, title: newTitle.trim() });
    renderChats(searchChatInput.value);

    // reset history for new chat
    history = [];
    chatContainer.innerHTML = "";
  }
});

// --- NARROW SIDEBAR BUTTONS ---
narrowNewChatBtn.addEventListener('click', () => newChatBtn.click());
narrowSearchBtn.addEventListener('click', () => { openSidebar(); searchChatInput.focus(); });
narrowModelsBtn.addEventListener('click', () => { openSidebar(); document.getElementById('version-select').focus(); });

// --- CLOSE SIDEBAR BUTTON ---
closeSidebarBtn.addEventListener('click', () => closeSidebar());

// --- SIDEBAR TOGGLE ---
sidebarToggle.addEventListener('click', () => {
  if (sidebar.classList.contains('closed')) openSidebar();
  else closeSidebar();
});

// --- OPEN / CLOSE SIDEBAR ---
function openSidebar() { sidebar.classList.remove('closed'); }
function closeSidebar() { sidebar.classList.add('closed'); }

// --- GET API BUTTON ---
getApiBtn.addEventListener('click', () => {
  alert("No API keys are currently available. This feature is under development by Arihant Sinha.");
  window.location.href = "index.html";
});

// --- SEND BUTTON ---
sendBtn.addEventListener('click', async () => {
  const text = userInput.value.trim();
  if (!text) return;

  // Add user's message
  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'message user-message';
  userMsgDiv.textContent = text;
  chatContainer.appendChild(userMsgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Add to history
  history.push({ role: "user", content: text });

  userInput.value = "";

  try {
    // Call backend API
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        history: history
      })
    });

    const data = await response.json();

    // Add AI's message
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'message bot-message';
    botMsgDiv.textContent = data.reply || "⚠️ No response from AI.";
    chatContainer.appendChild(botMsgDiv);

    // Save to history
    history.push({ role: "assistant", content: data.reply });

    chatContainer.scrollTop = chatContainer.scrollHeight;

  } catch (err) {
    const errorMsgDiv = document.createElement('div');
    errorMsgDiv.className = 'message bot-message error';
    errorMsgDiv.textContent = "⚠️ Error: Could not connect to AI backend.";
    chatContainer.appendChild(errorMsgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    console.error(err);
  }
});

// --- MICROPHONE BUTTON (STT) ---
let recognition;
if ('webkitSpeechRecognition' in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => micBtn.classList.add('recording');
  recognition.onend = () => micBtn.classList.remove('recording');
  recognition.onresult = event => { userInput.value = event.results[0][0].transcript; };
} else {
  micBtn.disabled = true;
  micBtn.title = "Speech-to-text not supported in this browser.";
}

micBtn.addEventListener('click', () => { if(recognition) recognition.start(); });

// --- INITIAL SETUP ---
closeSidebar();
renderChats();
