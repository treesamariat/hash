
// Chatbot logic and voice interaction
function showInstructions(type) {
    let instructionsDiv = document.getElementById('instructions');
    let textToRead = '';

    if(type === 'heart') {
        instructionsDiv.innerHTML = `
            <h2>Heart Attack First-Aid Steps</h2>
            <ol>
                <li>Call emergency services immediately.</li>
                <li>Keep the person calm and seated.</li>
                <li>Give aspirin if available and not allergic.</li>
            </ol>
        `;
        textToRead = 'Heart Attack First-Aid Steps. Call emergency services immediately. Keep the person calm and seated. Give aspirin if available and not allergic.';
    } else if(type === 'snake') {
        instructionsDiv.innerHTML = `
            <h2>Snake Bite First-Aid Steps</h2>
            <ol>
                <li>Keep the victim calm and still.</li>
                <li>Keep the bitten limb below heart level.</li>
                <li>Go to the nearest hospital immediately.</li>
            </ol>
        `;
        textToRead = 'Snake Bite First-Aid Steps. Keep the victim calm and still. Keep the bitten limb below heart level. Go to the nearest hospital immediately.';
    } else if(type === 'accident') {
        instructionsDiv.innerHTML = `
            <h2>Road Accident First-Aid Steps</h2>
            <ol>
                <li>Ensure the scene is safe.</li>
                <li>Call emergency services.</li>
                <li>Do not move the injured unless necessary.</li>
            </ol>
        `;
        textToRead = 'Road Accident First-Aid Steps. Ensure the scene is safe. Call emergency services. Do not move the injured unless necessary.';
    }

    // Automatically read aloud the instructions
    if (textToRead) {
        const utterance = new window.SpeechSynthesisUtterance(textToRead);
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    }
}

// Chatbot UI logic
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const voiceBtn = document.getElementById('voice-btn');

function addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.style.margin = '8px 0';
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getFirstAidResponse(userMsg) {
    userMsg = userMsg.toLowerCase();
    // Hindi keywords
    if (userMsg.includes('दिल') || userMsg.includes('heart')) {
        if (userMsg.includes('दिल')) {
            return 'दिल का दौरा पड़ने पर तुरंत आपातकालीन सेवाओं को बुलाएं। व्यक्ति को शांत और बैठा रखें। यदि एलर्जी न हो तो एस्पिरिन दें।';
        }
        return 'Heart Attack First-Aid Steps: Call emergency services immediately. Keep the person calm and seated. Give aspirin if available and not allergic.';
    } else if (userMsg.includes('साँप') || userMsg.includes('snake')) {
        if (userMsg.includes('साँप')) {
            return 'साँप के काटने पर पीड़ित को शांत और स्थिर रखें। काटे गए अंग को हृदय के स्तर से नीचे रखें। तुरंत अस्पताल जाएं।';
        }
        return 'Snake Bite First-Aid Steps: Keep the victim calm and still. Keep the bitten limb below heart level. Go to the nearest hospital immediately.';
    } else if (userMsg.includes('सड़क') || userMsg.includes('accident') || userMsg.includes('road')) {
        if (userMsg.includes('सड़क')) {
            return 'सड़क दुर्घटना के बाद सुनिश्चित करें कि स्थान सुरक्षित है। आपातकालीन सेवाओं को बुलाएं। जब तक आवश्यक न हो घायल को न हिलाएं।';
        }
        return 'Road Accident First-Aid Steps: Ensure the scene is safe. Call emergency services. Do not move the injured unless necessary.';
    } else {
        if (userMsg.match(/[\u0900-\u097F]/)) {
            return 'माफ़ कीजिए, मैं दिल का दौरा, साँप के काटने, या सड़क दुर्घटना में मदद कर सकता हूँ। कृपया इनमें से किसी के बारे में पूछें।';
        }
        return "I'm sorry, I can help with heart attack, snake bite, or road accident first aid. Please ask about one of these.";
    }
}

function speakText(text) {
    const utterance = new window.SpeechSynthesisUtterance(text);
    // Detect Hindi
    if (text.match(/[\u0900-\u097F]/)) {
        utterance.lang = 'hi-IN';
    } else {
        utterance.lang = 'en-US';
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

sendBtn.addEventListener('click', function() {
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;
    addMessage('You', userMsg);
    const botResponse = getFirstAidResponse(userMsg);
    addMessage('Bot', botResponse);
    speakText(botResponse);
    chatInput.value = '';
});

chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

// Voice recognition
let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Default to English

    voiceBtn.addEventListener('click', function() {
        // Try to detect Hindi from last message or let user choose
        let lastMsg = chatInput.value.trim();
        if (lastMsg.match(/[\u0900-\u097F]/)) {
            recognition.lang = 'hi-IN';
        } else {
            recognition.lang = 'en-US';
        }
        recognition.start();
        voiceBtn.disabled = true;
        voiceBtn.textContent = '🎤...';
    });

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        chatInput.value = transcript;
        sendBtn.click();
    };
    recognition.onend = function() {
        voiceBtn.disabled = false;
        voiceBtn.textContent = '🎤';
    };
}

