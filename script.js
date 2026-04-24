// 1. Lógica da Tela de Login Real
const loginBtn = document.getElementById('login-btn');
const authOverlay = document.getElementById('login-overlay');
const accessCodeInput = document.getElementById('access-code');

loginBtn.addEventListener('click', () => {
    const code = accessCodeInput.value.trim().toUpperCase();
    if (code === 'SKYNET-2026') {
        authOverlay.style.display = 'none';
    } else {
        alert('CÓDIGO DE ACESSO INVÁLIDO OU EXPIRADO.');
        accessCodeInput.value = '';
    }
});

// 2. Lógica de Troca de Temas
const themeBtns = document.querySelectorAll('.theme-btn');
themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        themeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.documentElement.setAttribute('data-theme', btn.getAttribute('data-set-theme'));
    });
});

// 3. Lógica das Ferramentas (Mudando a personalidade da IA)
let currentSystemPrompt = ""; // Vazio = usa o padrão da API
const userInput = document.getElementById('user-input');

document.getElementById('btn-osint').addEventListener('click', () => {
    currentSystemPrompt = "Você é um especialista em OSINT (Inteligência de Fontes Abertas). O usuário vai te dar um alvo e você deve listar técnicas reais e ferramentas (como Maltego, Shodan, etc) para investigar esse alvo. Aja como um investigador profissional.";
    userInput.placeholder = "Modo OSINT Ativado. Digite o alvo...";
    userInput.focus();
});

document.getElementById('btn-pentest').addEventListener('click', () => {
    currentSystemPrompt = "Você é um Pentester Sênior. O usuário fará perguntas sobre vulnerabilidades, exploits e testes de intrusão. Responda de forma técnica, detalhando vetores de ataque e mitigações em ambientes controlados.";
    userInput.placeholder = "Pentest Assistant Ativado. Qual o vetor de ataque?";
    userInput.focus();
});

document.getElementById('btn-code').addEventListener('click', () => {
    currentSystemPrompt = "Você é um programador Full-Stack nível sênior focado em performance. Retorne apenas o código otimizado e comentários breves.";
    userInput.placeholder = "Modo Programador. O que vamos codar?";
    userInput.focus();
});

document.getElementById('btn-web').addEventListener('click', () => {
    currentSystemPrompt = ""; // Volta pro normal
    userInput.placeholder = "Explore qualquer assunto...";
    userInput.focus();
});

// 4. Lógica de Envio de Mensagem (Chat)
const sendBtn = document.getElementById('send-btn');
const chatWindow = document.getElementById('chat-window');
const welcomeScreen = document.querySelector('.welcome-screen');

function addMessage(text, type) {
    if (welcomeScreen) welcomeScreen.style.display = 'none'; // Some com a grade quando começa o chat
    
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type);
    msgDiv.innerText = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

sendBtn.addEventListener('click', async () => {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    userInput.value = '';
    
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'system');
    loadingDiv.innerText = "Analisando dados...";
    chatWindow.appendChild(loadingDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Agora enviamos o prompt da ferramenta escolhida junto com a mensagem
            body: JSON.stringify({ message: text, systemPrompt: currentSystemPrompt })
        });

        if (!response.ok) throw new Error('Erro na comunicação');
        
        const data = await response.json();
        loadingDiv.innerText = data.reply || "Erro: Sistema não respondeu.";
    } catch (error) {
        loadingDiv.innerText = "Falha crítica no sistema de comunicação.";
    }
});
