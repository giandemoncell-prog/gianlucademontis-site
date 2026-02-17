// Chatbot Semplificato - Solo FAQ e Contatti
// Configurato per Gianluca Demontis - gianlucademontis.xyz
// VERSIONE SEMPLIFICATA (senza Calendly)

(function() {
    'use strict';
    
    // ===== CONFIGURAZIONE =====
    const CONFIG = {
        emailjs: {
            publicKey: 'sgwpSulF12rIGGleQ',
            serviceId: 'service_rk75llj',
            templateId: 'template_3llianq'
        }
    };
    
    // Inizializza EmailJS
    emailjs.init(CONFIG.emailjs.publicKey);
    
    // ===== STATO CONVERSAZIONE =====
    let conversationState = {
        mode: 'faq', // 'faq', 'contact_form'
        step: 0,
        data: {}
    };
    
    // ===== FAQ DATABASE =====
    const faqData = {
        'chi-sei': {
            question: 'Chi è Gianluca?',
            answer: 'Gianluca Demontis è un Tech Coach, formatore ed innovatore. Mette insieme didattica, automazione e creatività per costruire percorsi formativi e progetti tecnologici con impatto concreto. 🚀'
        },
        'servizi': {
            question: 'Quali servizi offri?',
            answer: '📚 Formazione (automazione, stampa 3D, STEM)\n🧠 Transizione digitale a scuola (Google Workspace, metodologie innovative)\n🧩 Contenuti e-learning (SCORM, video, interattivi)\n🕶️ Progetti AR/VR e mondi virtuali\n🏫 Supporto innovazione scolastica\n💡 Consulenza (real estate, rinnovabili, crypto)'
        },
        'formazione': {
            keywords: ['formazione', 'corso', 'imparare', 'insegnare', 'training', 'stem', '3d'],
            answer: 'Offro formazione su automazione, stampa e modellazione 3D, STEM e laboratori. Mi occupo anche di transizione digitale a scuola. Vuoi maggiori informazioni? Scrivimi! 📚'
        },
        'scuola': {
            keywords: ['scuola', 'scolastico', 'didattica', 'google workspace', 'digitale', 'innovazione'],
            answer: 'Supporto la transizione digitale nelle scuole con Google Workspace, ambienti di apprendimento innovativi e metodologie didattiche moderne. Parliamone! 🏫'
        },
        'elearning': {
            keywords: ['e-learning', 'elearning', 'scorm', 'video', 'contenuti', 'didattici'],
            answer: 'Progetto contenuti e-learning e materiali didattici digitali: SCORM, video, contenuti interattivi. Posso aiutarti a creare il tuo corso! 🧩'
        },
        'arvr': {
            keywords: ['ar', 'vr', 'realtà virtuale', 'realtà aumentata', 'immersivo', 'metaverso'],
            answer: 'Sviluppo progetti AR/VR e mondi virtuali, con focus su design e sviluppo di ambienti immersivi. Un progetto innovativo? Contattami! 🕶️'
        },
        'progetti': {
            keywords: ['progetti', 'progetto', 'real estate', 'crypto', 'criptovalute', 'rinnovabili', 'energia'],
            answer: 'Porto avanti progetti in real estate, energie rinnovabili e criptovalute, con focus su analisi di redditività e sostenibilità. Vuoi collaborare? 💡'
        },
        'youtube': {
            keywords: ['youtube', 'video', 'canale', 'contenuti'],
            answer: 'Trovi i miei contenuti su YouTube! Parlo di tecnologia, AI, automazione e innovazione. Iscriviti al canale! 🎥'
        }
    };
    
    // ===== FORM CONTATTI =====
    const contactFormSteps = [
        {
            question: 'Come ti chiami? 👤',
            field: 'nome',
            validation: (value) => value.length >= 2,
            errorMsg: '⚠️ Nome troppo corto. Inserisci il tuo nome completo.'
        },
        {
            question: 'Qual è la tua email? 📧',
            field: 'email',
            validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            errorMsg: '⚠️ Email non valida. Inserisci un indirizzo email corretto.'
        },
        {
            question: 'Numero di telefono? (opzionale, premi Invio per saltare) 📱',
            field: 'telefono',
            validation: () => true
        },
        {
            question: 'Come posso aiutarti? Descrivi la tua richiesta. 💬',
            field: 'messaggio',
            validation: (value) => value.length >= 10,
            errorMsg: '⚠️ Messaggio troppo breve. Descrivi meglio la tua richiesta (min 10 caratteri).'
        }
    ];
    
    // ===== INIZIALIZZAZIONE =====
    function init() {
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
        
        // ===== FUNZIONI MESSAGGI =====
        function addMessage(text, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.style.whiteSpace = 'pre-line';
            contentDiv.textContent = text;
            
            messageDiv.appendChild(contentDiv);
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
        
        // ===== FORM CONTATTI =====
        function startContactForm() {
            conversationState.mode = 'contact_form';
            conversationState.step = 0;
            conversationState.data = {};
            
            addMessage('Perfetto! Ti farò alcune domande per poterti contattare. 📝', false);
            setTimeout(() => {
                askNextQuestion();
            }, 500);
        }
        
        function askNextQuestion() {
            if (conversationState.step < contactFormSteps.length) {
                const currentStep = contactFormSteps[conversationState.step];
                addMessage(currentStep.question, false);
            } else {
                sendContactEmail();
            }
        }
        
        function processContactFormAnswer(answer) {
            const currentStep = contactFormSteps[conversationState.step];
            
            // Permetti di saltare campi opzionali
            if (currentStep.field === 'telefono' && answer.trim() === '') {
                conversationState.data[currentStep.field] = 'Non fornito';
                conversationState.step++;
                setTimeout(() => askNextQuestion(), 500);
                return;
            }
            
            // Valida risposta
            if (!currentStep.validation(answer)) {
                addMessage(currentStep.errorMsg, false);
                return;
            }
            
            // Salva risposta
            conversationState.data[currentStep.field] = answer;
            conversationState.step++;
            
            setTimeout(() => askNextQuestion(), 500);
        }
        
        async function sendContactEmail() {
            addMessage('⏳ Invio in corso...', false);
            
            try {
                const templateParams = {
                    from_name: conversationState.data.nome,
                    from_email: conversationState.data.email,
                    phone: conversationState.data.telefono || 'Non fornito',
                    message: conversationState.data.messaggio,
                    to_name: 'Gianluca Demontis',
                    reply_to: conversationState.data.email
                };
                
                const response = await emailjs.send(
                    CONFIG.emailjs.serviceId,
                    CONFIG.emailjs.templateId,
                    templateParams
                );
                
                if (response.status === 200) {
                    addMessage(`✅ Messaggio inviato con successo, ${conversationState.data.nome}! Ti contatterò presto all'indirizzo ${conversationState.data.email}. 📧`, false);
                    
                    // Reset stato
                    conversationState.mode = 'faq';
                    conversationState.step = 0;
                    conversationState.data = {};
                } else {
                    throw new Error('Errore invio');
                }
            } catch (error) {
                console.error('Errore EmailJS:', error);
                addMessage('❌ Si è verificato un errore. Riprova o scrivimi a info@gianlucademontis.xyz', false);
                conversationState.mode = 'faq';
            }
        }
        
        // ===== LOGICA FAQ =====
        function findAnswer(userMessage) {
            const message = userMessage.toLowerCase();
            
            // Check contatto
            if (message.includes('contatt') || message.includes('scriver') || 
                message.includes('email') || message.includes('messaggio') ||
                message.includes('info')) {
                return 'TRIGGER_CONTACT';
            }
            
            // Check FAQ con keywords
            for (const [key, data] of Object.entries(faqData)) {
                if (data.keywords) {
                    if (data.keywords.some(keyword => message.includes(keyword))) {
                        return data.answer;
                    }
                }
            }
            
            // Saluti
            if (message.match(/\b(ciao|salve|buongiorno|buonasera|hey|hello|hi)\b/)) {
                return 'Ciao! 👋 Come posso aiutarti? Posso rispondere a domande sui servizi o metterti in contatto con Gianluca!';
            }
            
            // Grazie
            if (message.match(/\b(grazie|thanks|thank you|merci)\b/)) {
                return 'Prego! Sono qui se hai altre domande. Scrivi "contatto" per inviarmi un messaggio diretto! 😊';
            }
            
            return 'Grazie per il tuo messaggio! Usa i pulsanti rapidi o scrivi "contatto" per inviarmi un messaggio. 💬';
        }
        
        // ===== QUICK REPLIES =====
        quickReplies.forEach(button => {
            button.addEventListener('click', () => {
                const questionKey = button.dataset.question;
                
                // Contatto
                if (questionKey === 'contatti' || questionKey === 'contatto') {
                    addMessage('Voglio contattarti', true);
                    setTimeout(() => startContactForm(), 500);
                    return;
                }
                
                // FAQ normale
                const faq = faqData[questionKey];
                if (faq) {
                    addMessage(faq.question, true);
                    setTimeout(() => {
                        addMessage(faq.answer, false);
                    }, 500);
                }
            });
        });
        
        // ===== INVIO MESSAGGIO =====
        function sendMessage() {
            const message = chatbotInput.value.trim();
            
            if (!message) return;
            
            addMessage(message, true);
            chatbotInput.value = '';
            
            setTimeout(() => {
                // Modalità form contatti
                if (conversationState.mode === 'contact_form') {
                    processContactFormAnswer(message);
                    return;
                }
                
                // Modalità FAQ
                const answer = findAnswer(message);
                
                if (answer === 'TRIGGER_CONTACT') {
                    startContactForm();
                } else {
                    addMessage(answer, false);
                }
            }, 500);
        }
        
        chatbotSend.addEventListener('click', sendMessage);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // ===== AVVIO =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
