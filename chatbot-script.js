// Chatbot Semplificato - Solo FAQ e Contatti (IT/EN/ES)
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

    // ===== TESTI PER LINGUA =====
    const I18N = {
        it: {
            faq: {
                'chi-sei': {
                    question: 'Chi è Gianluca?',
                    keywords: ['chi sei', 'chi è gianluca', 'chi e gianluca', 'presentati', 'chi sei tu'],
                    answer: 'Gianluca Demontis è un Tech Coach, formatore ed innovatore. Mette insieme didattica, automazione e creatività per costruire percorsi formativi e progetti tecnologici con impatto concreto. 🚀'
                },
                'servizi': {
                    question: 'Quali servizi offri?',
                    keywords: ['servizi', 'servizio', 'cosa offri', 'cosa fai', 'consulenza'],
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
            },
            contactKeywords: ['contatt', 'scriver', 'email', 'messaggio', 'info'],
            greetingRegex: /\b(ciao|salve|buongiorno|buonasera|hey|hello|hi)\b/,
            greetingReply: 'Ciao! 👋 Come posso aiutarti? Posso rispondere a domande sui servizi o metterti in contatto con Gianluca!',
            thanksRegex: /\b(grazie|thanks|thank you|merci)\b/,
            thanksReply: 'Prego! Sono qui se hai altre domande. Scrivi "contatto" per inviarmi un messaggio diretto! 😊',
            fallbackReply: 'Grazie per il tuo messaggio! Usa i pulsanti rapidi o scrivi "contatto" per inviarmi un messaggio. 💬',
            contactStart: 'Perfetto! Ti farò alcune domande per poterti contattare. 📝',
            formSteps: [
                { field: 'nome', question: 'Come ti chiami? 👤', validation: (v) => v.length >= 2, errorMsg: '⚠️ Nome troppo corto. Inserisci il tuo nome completo.' },
                { field: 'email', question: 'Qual è la tua email? 📧', validation: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), errorMsg: '⚠️ Email non valida. Inserisci un indirizzo email corretto.' },
                { field: 'telefono', question: 'Numero di telefono? (opzionale, premi Invio per saltare) 📱', validation: () => true },
                { field: 'messaggio', question: 'Come posso aiutarti? Descrivi la tua richiesta. 💬', validation: (v) => v.length >= 10, errorMsg: '⚠️ Messaggio troppo breve. Descrivi meglio la tua richiesta (min 10 caratteri).' }
            ],
            sending: '⏳ Invio in corso...',
            successTemplate: (nome, email) => `✅ Messaggio inviato con successo, ${nome}! Ti contatterò presto all'indirizzo ${email}. 📧`,
            errorSend: '❌ Si è verificato un errore. Riprova o scrivimi a info@gianlucademontis.xyz',
            contactUserEcho: 'Voglio contattarti'
        },
        en: {
            faq: {
                'chi-sei': {
                    question: 'Who is Gianluca?',
                    keywords: ['who are you', 'who is gianluca', 'introduce yourself', 'about gianluca'],
                    answer: "Gianluca Demontis is a Tech Coach, trainer and innovator. He combines teaching, automation and creativity to build training paths and tech projects with real impact. 🚀"
                },
                'servizi': {
                    question: 'What services do you offer?',
                    keywords: ['services', 'what do you offer', 'what do you do', 'consulting'],
                    answer: '📚 Training (automation, 3D printing, STEM)\n🧠 Digital transition in schools (Google Workspace, innovative methods)\n🧩 E-learning content (SCORM, video, interactive)\n🕶️ AR/VR projects and virtual worlds\n🏫 School innovation support\n💡 Consulting (real estate, renewables, crypto)'
                },
                'formazione': {
                    keywords: ['training', 'course', 'learn', 'teach', 'stem', '3d printing'],
                    answer: 'I offer training on automation, 3D printing and modeling, STEM and workshops. I also work on digital transition in schools. Want more info? Get in touch! 📚'
                },
                'scuola': {
                    keywords: ['school', 'education', 'teaching', 'google workspace', 'digital', 'innovation'],
                    answer: "I support digital transition in schools with Google Workspace, innovative learning environments and modern teaching methods. Let's talk! 🏫"
                },
                'elearning': {
                    keywords: ['e-learning', 'elearning', 'scorm', 'video', 'content', 'didactic'],
                    answer: 'I design e-learning content and digital teaching materials: SCORM, video, interactive content. I can help you build your course! 🧩'
                },
                'arvr': {
                    keywords: ['ar', 'vr', 'virtual reality', 'augmented reality', 'immersive', 'metaverse'],
                    answer: 'I develop AR/VR projects and virtual worlds, focused on designing and building immersive environments. Got an innovative project? Contact me! 🕶️'
                },
                'progetti': {
                    keywords: ['projects', 'project', 'real estate', 'crypto', 'cryptocurrency', 'renewables', 'energy'],
                    answer: 'I run projects in real estate, renewable energy and cryptocurrencies, focused on profitability and sustainability analysis. Want to collaborate? 💡'
                },
                'youtube': {
                    keywords: ['youtube', 'video', 'channel', 'content'],
                    answer: "You'll find my content on YouTube! I talk about technology, AI, automation and innovation. Subscribe to the channel! 🎥"
                }
            },
            contactKeywords: ['contact', 'write', 'email', 'message', 'info'],
            greetingRegex: /\b(hi|hello|hey|good morning|good evening)\b/,
            greetingReply: "Hi! 👋 How can I help you? I can answer questions about the services or put you in touch with Gianluca!",
            thanksRegex: /\b(thanks|thank you)\b/,
            thanksReply: 'You\'re welcome! I\'m here if you have more questions. Type "contact" to send me a direct message! 😊',
            fallbackReply: 'Thanks for your message! Use the quick buttons or type "contact" to send me a message. 💬',
            contactStart: "Great! I'll ask you a few questions so I can get in touch. 📝",
            formSteps: [
                { field: 'nome', question: "What's your name? 👤", validation: (v) => v.length >= 2, errorMsg: '⚠️ Name too short. Please enter your full name.' },
                { field: 'email', question: "What's your email address? 📧", validation: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), errorMsg: '⚠️ Invalid email. Please enter a valid email address.' },
                { field: 'telefono', question: 'Phone number? (optional, press Enter to skip) 📱', validation: () => true },
                { field: 'messaggio', question: 'How can I help you? Describe your request. 💬', validation: (v) => v.length >= 10, errorMsg: '⚠️ Message too short. Please describe your request in more detail (min 10 characters).' }
            ],
            sending: '⏳ Sending...',
            successTemplate: (nome, email) => `✅ Message sent successfully, ${nome}! I'll get back to you soon at ${email}. 📧`,
            errorSend: '❌ An error occurred. Please try again or email me at info@gianlucademontis.xyz',
            contactUserEcho: 'I want to get in touch'
        },
        es: {
            faq: {
                'chi-sei': {
                    question: '¿Quién es Gianluca?',
                    keywords: ['quien eres', 'quién eres', 'quien es gianluca', 'quién es gianluca', 'preséntate', 'presentate'],
                    answer: 'Gianluca Demontis es Tech Coach, formador e innovador. Combina didáctica, automatización y creatividad para construir itinerarios formativos y proyectos tecnológicos con impacto real. 🚀'
                },
                'servizi': {
                    question: '¿Qué servicios ofreces?',
                    keywords: ['servicios', 'servicio', 'que ofreces', 'qué ofreces', 'que haces', 'qué haces', 'consultoría', 'consultoria'],
                    answer: '📚 Formación (automatización, impresión 3D, STEM)\n🧠 Transición digital en la escuela (Google Workspace, metodologías innovadoras)\n🧩 Contenidos e-learning (SCORM, vídeo, interactivos)\n🕶️ Proyectos AR/VR y mundos virtuales\n🏫 Apoyo a la innovación escolar\n💡 Consultoría (real estate, renovables, cripto)'
                },
                'formazione': {
                    keywords: ['formación', 'formacion', 'curso', 'aprender', 'enseñar', 'ensenar', 'stem', 'impresión 3d', 'impresion 3d'],
                    answer: 'Ofrezco formación en automatización, impresión y modelado 3D, STEM y talleres. También me ocupo de la transición digital en la escuela. ¿Quieres más información? ¡Escríbeme! 📚'
                },
                'scuola': {
                    keywords: ['escuela', 'educación', 'educacion', 'didáctica', 'didactica', 'google workspace', 'digital', 'innovación', 'innovacion'],
                    answer: '¡Apoyo la transición digital en las escuelas con Google Workspace, entornos de aprendizaje innovadores y metodologías didácticas modernas. Hablemos! 🏫'
                },
                'elearning': {
                    keywords: ['e-learning', 'elearning', 'scorm', 'vídeo', 'video', 'contenidos', 'didácticos', 'didacticos'],
                    answer: '¡Diseño contenidos e-learning y materiales didácticos digitales: SCORM, vídeo, contenidos interactivos. Puedo ayudarte a crear tu curso! 🧩'
                },
                'arvr': {
                    keywords: ['ar', 'vr', 'realidad virtual', 'realidad aumentada', 'inmersivo', 'metaverso'],
                    answer: '¡Desarrollo proyectos AR/VR y mundos virtuales, con foco en el diseño y desarrollo de entornos inmersivos. ¿Un proyecto innovador? Contáctame! 🕶️'
                },
                'progetti': {
                    keywords: ['proyectos', 'proyecto', 'real estate', 'cripto', 'criptomonedas', 'renovables', 'energía', 'energia'],
                    answer: '¡Llevo adelante proyectos en real estate, energías renovables y criptomonedas, con foco en el análisis de rentabilidad y sostenibilidad. ¿Quieres colaborar? 💡'
                },
                'youtube': {
                    keywords: ['youtube', 'vídeo', 'video', 'canal', 'contenidos'],
                    answer: '¡Encuentras mis contenidos en YouTube! Hablo de tecnología, IA, automatización e innovación. Suscríbete al canal! 🎥'
                }
            },
            contactKeywords: ['contact', 'contacto', 'escrib', 'email', 'mensaje', 'info'],
            greetingRegex: /\b(hola|buenos dias|buenos días|buenas tardes|buenas noches|hey|hello|hi)\b/,
            greetingReply: '¡Hola! 👋 ¿Cómo puedo ayudarte? Puedo responder preguntas sobre los servicios o ponerte en contacto con Gianluca.',
            thanksRegex: /\b(gracias|thanks)\b/,
            thanksReply: '¡De nada! Estoy aquí si tienes más preguntas. Escribe "contacto" para enviarme un mensaje directo. 😊',
            fallbackReply: '¡Gracias por tu mensaje! Usa los botones rápidos o escribe "contacto" para enviarme un mensaje. 💬',
            contactStart: '¡Perfecto! Te haré algunas preguntas para poder contactarte. 📝',
            formSteps: [
                { field: 'nome', question: '¿Cómo te llamas? 👤', validation: (v) => v.length >= 2, errorMsg: '⚠️ Nombre demasiado corto. Introduce tu nombre completo.' },
                { field: 'email', question: '¿Cuál es tu email? 📧', validation: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), errorMsg: '⚠️ Email no válido. Introduce una dirección de correo correcta.' },
                { field: 'telefono', question: '¿Número de teléfono? (opcional, pulsa Intro para saltar) 📱', validation: () => true },
                { field: 'messaggio', question: '¿Cómo puedo ayudarte? Describe tu solicitud. 💬', validation: (v) => v.length >= 10, errorMsg: '⚠️ Mensaje demasiado corto. Describe mejor tu solicitud (mín. 10 caracteres).' }
            ],
            sending: '⏳ Enviando...',
            successTemplate: (nome, email) => `✅ ¡Mensaje enviado con éxito, ${nome}! Te contactaré pronto en ${email}. 📧`,
            errorSend: '❌ Se ha producido un error. Inténtalo de nuevo o escríbeme a info@gianlucademontis.xyz',
            contactUserEcho: 'Quiero contactarte'
        }
    };

    function detectLang() {
        const htmlLang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
        return I18N[htmlLang] ? htmlLang : 'it';
    }

    const LANG = detectLang();
    const T = I18N[LANG];
    const faqData = T.faq;
    const contactFormSteps = T.formSteps;

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

            addMessage(T.contactStart, false);
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
            addMessage(T.sending, false);

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
                    addMessage(T.successTemplate(conversationState.data.nome, conversationState.data.email), false);

                    // Reset stato
                    conversationState.mode = 'faq';
                    conversationState.step = 0;
                    conversationState.data = {};
                } else {
                    throw new Error('Errore invio');
                }
            } catch (error) {
                console.error('Errore EmailJS:', error);
                addMessage(T.errorSend, false);
                conversationState.mode = 'faq';
            }
        }

        // ===== LOGICA FAQ =====
        function findAnswer(userMessage) {
            const message = userMessage.toLowerCase();

            // Check contatto
            if (T.contactKeywords.some(keyword => message.includes(keyword))) {
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
            if (T.greetingRegex.test(message)) {
                return T.greetingReply;
            }

            // Grazie
            if (T.thanksRegex.test(message)) {
                return T.thanksReply;
            }

            return T.fallbackReply;
        }

        // ===== QUICK REPLIES =====
        quickReplies.forEach(button => {
            button.addEventListener('click', () => {
                const questionKey = button.dataset.question;

                // Contatto
                if (questionKey === 'contatti' || questionKey === 'contatto') {
                    addMessage(T.contactUserEcho, true);
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
