// Chatbot Widget Script - gianlucademontis.xyz

(function() {
    'use strict';
    
    // FAQ Database
    const faqData = {
        'chi-sei': {
            question: 'Chi è Gianluca?',
            answer: 'Gianluca Demontis è un Tech Coach, innovatore in automazione e content creator. Mette insieme didattica, automazione e creatività per costruire percorsi formativi, flussi di lavoro intelligenti e progetti tecnologici con un impatto concreto.'
        },
        'servizi': {
            question: 'Quali servizi offri?',
            answer: 'Offro diversi servizi:\n\n📚 Formazione in elettronica, programmazione 3D e automazione\n🎥 Content creation su YouTube con focus su video production e AI\n💡 Consulenza su progetti innovativi in real estate, energie rinnovabili e criptovalute\n🤖 Sviluppo di soluzioni di automazione personalizzate'
        },
        'contatti': {
            question: 'Come posso contattarti?',
            answer: 'Puoi contattarmi via email a: info@gianlucademontis.xyz\n\nOppure seguimi sui social:\n• YouTube\n• LinkedIn\n• Instagram\n• Facebook'
        },
        'youtube': {
            question: 'Dove trovo i tuoi video?',
            answer: 'Puoi trovare i miei video sul mio canale YouTube! Produco contenuti su video production, strumenti di Intelligenza Artificiale e tutorial tech. L\'obiettivo è accompagnare le persone nell\'uso consapevole della tecnologia.'
        },
        'formazione': {
            keywords: ['formazione', 'corso', 'insegnamento', 'imparare', 'studiare', 'lezioni'],
            answer: 'Ho esperienza nell\'insegnamento di elettronica, programmazione 3D e automazione. Lavoro con studenti e tirocinanti aiutandoli a trasformare concetti complessi in competenze pratiche, con un approccio pedagogico, chiaro e orientato al fare.'
        },
        'automazione': {
            keywords: ['automazione', 'automatizzare', 'workflow', 'flusso', 'processo'],
            answer: 'Sono specializzato in automazione e creazione di flussi di lavoro intelligenti. Posso aiutarti a ottimizzare i tuoi processi e a implementare soluzioni tecnologiche che migliorano l\'efficienza.'
        },
        'progetti': {
            keywords: ['progetti', 'innovazione', 'real estate', 'rinnovabili', 'crypto', 'criptovalute', 'solare', 'eolico'],
            answer: 'Porto avanti progetti in diversi ambiti:\n• Real estate\n• Energie rinnovabili (solare/eolico)\n• Criptovalute\n\nCon un focus particolare su analisi di redditività e sostenibilità.'
        },
        'aiuto': {
            keywords: ['aiuto', 'help', 'supporto', 'assistenza'],
            answer: 'Sono qui per aiutarti! Puoi:\n\n1. Usare i pulsanti rapidi qui sopra per domande frequenti\n2. Scrivermi direttamente una domanda\n3. Contattarmi via email: info@gianlucademontis.xyz'
        }
    };

    // Wait for DOM to be ready
    function init() {
        // Elements
        const chatbotButton = document.getElementById('chatbot-button');
        const chatbotWindow = document.getElementById('chatbot-window');
        const chatbotClose = document.getElementById('chatbot-close');
        const chatbotMessages = document.getElementById('chatbot-messages');
        const chatbotInput = document.getElementById('chatbot-input');
        const chatbotSend = document.getElementById('chatbot-send');
        const quickReplies = document.querySelectorAll('.quick-reply');

        if (!chatbotButton || !chatbotWindow) {
            console.error('Chatbot elements not found');
            return;
        }

        // Toggle chatbot
        chatbotButton.addEventListener('click', () => {
            chatbotWindow.classList.toggle('chatbot-hidden');
            if (!chatbotWindow.classList.contains('chatbot-hidden')) {
                chatbotInput.focus();
            }
        });

        chatbotClose.addEventListener('click', () => {
            chatbotWindow.classList.add('chatbot-hidden');
        });

        // Add message to chat
        function addMessage(text, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = text;
            
            messageDiv.appendChild(contentDiv);
            chatbotMessages.appendChild(messageDiv);
            
            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        // Find answer based on user message
        function findAnswer(userMessage) {
            const message = userMessage.toLowerCase();
            
            // Check direct FAQ match by keywords
            for (const [key, data] of Object.entries(faqData)) {
                if (data.keywords) {
                    if (data.keywords.some(keyword => message.includes(keyword))) {
                        return data.answer;
                    }
                }
            }
            
            // Check for greetings
            if (message.match(/\b(ciao|salve|buongiorno|buonasera|hey|hello)\b/)) {
                return 'Ciao! 👋 Come posso aiutarti oggi? Usa i pulsanti rapidi qui sopra per le domande più comuni!';
            }
            
            // Check for thanks
            if (message.match(/\b(grazie|thanks|thank you)\b/)) {
                return 'Prego! Sono qui se hai altre domande. 😊';
            }
            
            // Default response
            return 'Grazie per il tuo messaggio! Per informazioni specifiche, prova a usare i pulsanti rapidi qui sopra oppure contattami direttamente a info@gianlucademontis.xyz 📧';
        }

        // Handle quick replies
        quickReplies.forEach(button => {
            button.addEventListener('click', () => {
                const questionKey = button.dataset.question;
                const faq = faqData[questionKey];
                
                if (faq) {
                    addMessage(faq.question, true);
                    setTimeout(() => {
                        addMessage(faq.answer, false);
                    }, 500);
                }
            });
        });

        // Handle send message
        function sendMessage() {
            const message = chatbotInput.value.trim();
            
            if (message) {
                addMessage(message, true);
                chatbotInput.value = '';
                
                // Simulate typing delay
                setTimeout(() => {
                    const answer = findAnswer(message);
                    addMessage(answer, false);
                }, 500);
            }
        }

        chatbotSend.addEventListener('click', sendMessage);
        
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
