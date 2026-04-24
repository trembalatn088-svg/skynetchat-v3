// Lógica de Troca de Temas
const themeSelector = document.getElementById('theme-selector');
themeSelector.addEventListener('change', (e) => {
    document.documentElement.setAttribute('data-theme', e.target.value);
});

// Lógica de Chat 
const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatWindow = document.getElementById('chat-window');

function addMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type);
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();
    if (!text) return;

    // 1. Envia a mensagem do usuário para a tela
    addMessage(text, 'user');
    userInput.value = '';
    
    // 2. Coloca a mensagem de carregamento do sistema
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'system');
    loadingDiv.innerText = "Processando no núcleo SKYNET...";
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    // 3. Comunica com o cérebro na Vercel (que fala com o Groq)
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        if (!response.ok) throw new Error('Erro na comunicação');
        
        const data = await response.json();
        
        // 4. Substitui o texto de carregamento pela resposta da IA
        loadingDiv.innerText = data.reply || "Erro: Sistema não respondeu.";
    } catch (error) {
        loadingDiv.innerText = "Falha crítica no sistema de comunicação.";
    }
});
