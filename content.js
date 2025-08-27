// Smart Account Manager - Content Script
class SmartAccountManager {
    constructor() {
        this.forms = new Set();
        this.userProfile = {};
        this.settings = {
            autoDetect: true,
            notifications: true,
            learning: true
        };
        this.language = this.detectLanguage();
        this.patterns = this.loadPatterns();
        this.messages = this.loadMessages();

        this.init();
    }

    detectLanguage() {
        // Detect browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const lang = browserLang.toLowerCase();

        // Support Dutch and English, default to English
        if (lang.startsWith('nl')) {
            return 'nl';
        }
        return 'en';
    }

    loadMessages() {
        const messages = {
            en: {
                activated: '🤖 Smart Account Manager activated',
                newFormDetected: 'New {type} form detected',
                formTypes: {
                    login: 'Login form',
                    registration: 'Registration form',
                    form: 'Form'
                },
                clickToFill: 'Click to auto-fill',
                fieldsFilledSuccess: '{count} fields filled',
                noFormsFound: 'No forms found on this page',
                pageScanned: 'Page scanned for new forms',
                noRegistrationForm: 'No registration form found',
                commandNotUnderstood: 'Command not understood. Try: "Fill my details"',
                waitingForForms: 'Waiting for forms...',
                formsDetected: '{count} form(s) detected'
            },
            nl: {
                activated: '🤖 Smart Account Manager geactiveerd',
                newFormDetected: 'Nieuw {type} formulier gedetecteerd',
                formTypes: {
                    login: 'Inlogformulier',
                    registration: 'Registratieformulier',
                    form: 'Formulier'
                },
                clickToFill: 'Klik om automatisch in te vullen',
                fieldsFilledSuccess: '{count} velden ingevuld',
                noFormsFound: 'Geen formulieren gevonden op deze pagina',
                pageScanned: 'Pagina gescand op nieuwe formulieren',
                noRegistrationForm: 'Geen registratieformulier gevonden',
                commandNotUnderstood: 'Commando niet begrepen. Probeer: "Vul mijn gegevens in"',
                waitingForForms: 'Wacht op formulieren...',
                formsDetected: '{count} formulier(en) gedetecteerd'
            }
        };

        return messages[this.language];
    }

    async init() {
        console.log(`%c${this.messages.activated}`, 'color: #667eea; font-weight: bold;');
        
        // Laad gebruikersinstellingen
        await this.loadSettings();
        
        // Start formulier monitoring
        this.startFormMonitoring();
        
        // Listen voor messages van popup
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sendResponse);
        });

        // Initiële scan van de pagina
        this.scanForForms();
    }

    loadPatterns() {
        return {
            // Intelligente formulierherkenning patronen
            email: [
                /email/i, /e-mail/i, /mail/i, /@/,
                /gebruikersnaam/i, /username/i, /account/i
            ],
            password: [
                /password/i, /wachtwoord/i, /pass/i, /pwd/i,
                /geheim/i, /secret/i
            ],
            name: [
                /name/i, /naam/i, /voornaam/i, /firstname/i,
                /achternaam/i, /lastname/i, /surname/i
            ],
            phone: [
                /phone/i, /telefoon/i, /mobiel/i, /mobile/i,
                /nummer/i, /number/i
            ],
            address: [
                /address/i, /adres/i, /straat/i, /street/i,
                /postcode/i, /zip/i, /city/i, /stad/i
            ],
            birth: [
                /birth/i, /geboren/i, /birthday/i, /geboortedatum/i,
                /age/i, /leeftijd/i
            ]
        };
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['userProfile', 'settings']);
            this.userProfile = result.userProfile || {};
            this.settings = { ...this.settings, ...result.settings };
        } catch (error) {
            console.warn('Smart Account Manager: Settings loading failed:', error.message);
            // Use default settings on error
            this.settings = {
                autoDetect: true,
                notifications: true,
                learning: true
            };
        }
    }

    startFormMonitoring() {
        // Observer voor dynamische content changes
        const observer = new MutationObserver((mutations) => {
            let shouldScan = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'FORM' || node.querySelector('form')) {
                                shouldScan = true;
                            }
                        }
                    });
                }
            });

            if (shouldScan && this.settings.autoDetect) {
                setTimeout(() => this.scanForForms(), 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    scanForForms() {
        console.log(`%c🔍 Scanning page for forms...`, 'color: #667eea; font-weight: bold;');

        const forms = document.querySelectorAll('form');
        let newFormsFound = 0;
        let totalSignificantForms = 0;

        console.log(`Found ${forms.length} form elements on page`);

        forms.forEach((form, index) => {
            const isNewForm = !this.forms.has(form);

            if (isNewForm) {
                this.forms.add(form);
            }

            const analysis = this.analyzeForm(form);

            if (analysis.isSignificant) {
                totalSignificantForms++;

                if (isNewForm) {
                    newFormsFound++;
                    console.log(`📝 New significant form detected:`, {
                        type: analysis.type,
                        fields: analysis.fields.length,
                        confidence: analysis.confidence
                    });
                    this.handleNewForm(form, analysis);
                } else {
                    console.log(`📋 Existing form confirmed:`, {
                        type: analysis.type,
                        fields: analysis.fields.length
                    });
                }
            } else {
                console.log(`⚪ Form ${index + 1} not significant (${analysis.fields.length} fields)`);
            }
        });

        console.log(`%c📊 Scan complete: ${totalSignificantForms} significant forms (${newFormsFound} new)`, 'color: #4ade80; font-weight: bold;');

        // Update status naar background script
        try {
            chrome.runtime.sendMessage({
                type: 'FORMS_UPDATED',
                count: totalSignificantForms,
                newForms: newFormsFound
            });
        } catch (error) {
            console.warn('Smart Account Manager: Failed to send forms update:', error.message);
        }

        return {
            total: totalSignificantForms,
            newForms: newFormsFound,
            allForms: forms.length
        };
    }

    analyzeForm(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        const analysis = {
            form,
            fields: [],
            type: 'unknown',
            confidence: 0,
            isSignificant: false
        };

        let emailFound = false;
        let passwordFound = false;

        inputs.forEach(input => {
            const field = this.analyzeField(input);
            if (field.type !== 'unknown') {
                analysis.fields.push(field);
                
                if (field.type === 'email') emailFound = true;
                if (field.type === 'password') passwordFound = true;
            }
        });

        // Bepaal formuliertype
        if (emailFound && passwordFound) {
            analysis.type = inputs.length > 4 ? 'registration' : 'login';
            analysis.confidence = 0.9;
            analysis.isSignificant = true;
        } else if (analysis.fields.length >= 2) {
            analysis.type = 'form';
            analysis.confidence = 0.6;
            analysis.isSignificant = true;
        }

        return analysis;
    }

    analyzeField(input) {
        const field = {
            element: input,
            type: 'unknown',
            confidence: 0,
            label: this.getFieldLabel(input)
        };

        const testString = (
            input.name + ' ' + 
            input.id + ' ' + 
            input.placeholder + ' ' + 
            input.className + ' ' + 
            field.label
        ).toLowerCase();

        // Test tegen patronen
        for (const [type, patterns] of Object.entries(this.patterns)) {
            for (const pattern of patterns) {
                if (pattern.test(testString)) {
                    field.type = type;
                    field.confidence = Math.max(field.confidence, 0.7);
                    break;
                }
            }
            if (field.type !== 'unknown') break;
        }

        // Extra intelligentie: context-based herkenning
        if (field.type === 'unknown') {
            field.type = this.contextualAnalysis(input, testString);
        }

        return field;
    }

    contextualAnalysis(input, testString) {
        // Type-based herkenning
        if (input.type === 'email') return 'email';
        if (input.type === 'password') return 'password';
        if (input.type === 'tel') return 'phone';
        if (input.type === 'date') return 'birth';

        // Length-based hints
        if (input.maxLength) {
            if (input.maxLength <= 50 && testString.includes('code')) return 'verification';
            if (input.maxLength <= 20 && /\d/.test(testString)) return 'phone';
        }

        return 'unknown';
    }

    getFieldLabel(input) {
        // Zoek naar label
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) return label.textContent.trim();

        // Zoek naar tekst in parent elements
        let parent = input.parentElement;
        for (let i = 0; i < 3 && parent; i++) {
            const text = parent.textContent?.replace(input.value || '', '').trim();
            if (text && text.length < 100) return text;
            parent = parent.parentElement;
        }

        return input.placeholder || input.name || input.id || '';
    }

    handleNewForm(form, analysis) {
        const formTypeName = this.messages.formTypes[analysis.type] || this.messages.formTypes.form;
        console.log(`📝 ${this.messages.newFormDetected.replace('{type}', formTypeName)}:`, analysis);

        if (this.settings.notifications) {
            this.showFormNotification(analysis);
        }

        // Voeg event listeners toe voor learning
        if (this.settings.learning) {
            this.attachLearningListeners(form, analysis);
        }
    }

    showFormNotification(analysis) {
        // Check if notifications are allowed and not intrusive
        if (!this.settings.notifications) return;

        // Prevent notification spam
        if (this.lastNotificationTime && Date.now() - this.lastNotificationTime < 5000) {
            return;
        }
        this.lastNotificationTime = Date.now();

        // Creëer elegante notification
        const notification = document.createElement('div');
        notification.className = 'smart-account-manager-notification';

        // Use safer styling approach
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            zIndex: '10000',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontSize: '14px',
            cursor: 'pointer',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px'
        });

        const formTypeName = this.messages.formTypes[analysis.type] || this.messages.formTypes.form;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <span style="margin-right: 8px;">🤖</span>
                <strong>${this.messages.newFormDetected.replace('{type}', formTypeName)}</strong>
            </div>
            <div style="font-size: 12px; opacity: 0.9;">
                ${this.messages.clickToFill}
            </div>
        `;

        document.body.appendChild(notification);

        // Animatie
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto-hide na 5 seconden
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);

        // Click handler
        notification.addEventListener('click', () => {
            this.fillForm(analysis);
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
    }

    attachLearningListeners(form, analysis) {
        // Leer van gebruikersacties
        form.addEventListener('submit', () => {
            this.learnFromSubmission(analysis);
        });
    }

    async fillForm(analysis) {
        console.log('🖊️ Vullen formulier in:', analysis);

        for (const field of analysis.fields) {
            const value = await this.getValueForField(field);
            if (value) {
                this.fillField(field.element, value);
            }
        }

        // Toon success feedback
        this.showSuccessMessage(this.messages.fieldsFilledSuccess.replace('{count}', analysis.fields.length));
    }

    async getValueForField(field) {
        // Haal waarde op basis van veldtype
        const profile = this.userProfile;

        // Default values based on language
        const defaults = this.language === 'nl' ? {
            email: 'gebruiker@example.com',
            firstName: 'Jan',
            lastName: 'Jansen',
            fullName: 'Jan Jansen',
            phone: '+31 6 12345678',
            address: 'Voorbeeldstraat 123'
        } : {
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            fullName: 'John Doe',
            phone: '+1 555 123 4567',
            address: '123 Main Street'
        };

        switch (field.type) {
            case 'email':
                return profile.email || defaults.email;
            case 'name':
                if (field.label.toLowerCase().includes('voor') ||
                    field.label.toLowerCase().includes('first') ||
                    field.element.name.toLowerCase().includes('first')) {
                    return profile.firstName || defaults.firstName;
                } else if (field.label.toLowerCase().includes('achter') ||
                          field.label.toLowerCase().includes('last') ||
                          field.element.name.toLowerCase().includes('last')) {
                    return profile.lastName || defaults.lastName;
                }
                return profile.fullName || defaults.fullName;
            case 'phone':
                return profile.phone || defaults.phone;
            case 'address':
                return profile.address || defaults.address;
            case 'password':
                // No automatic password filling for security reasons
                return '';
            default:
                return '';
        }
    }

    fillField(element, value) {
        try {
            // Validate element and value
            if (!element || !element.tagName || typeof value !== 'string') {
                console.warn('Smart Account Manager: Invalid field or value for filling');
                return;
            }

            // Check if element is still in DOM and editable
            if (!document.contains(element) || element.disabled || element.readOnly) {
                return;
            }

            // Simuleer natuurlijke input
            element.focus();
            element.value = value;

            // Trigger events voor frameworks
            ['input', 'change', 'blur'].forEach(eventType => {
                try {
                    element.dispatchEvent(new Event(eventType, { bubbles: true }));
                } catch (e) {
                    console.warn('Smart Account Manager: Event dispatch failed:', e.message);
                }
            });
        } catch (error) {
            console.warn('Smart Account Manager: Field filling failed:', error.message);
        }
    }

    showSuccessMessage(message) {
        const success = document.createElement('div');
        success.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4ade80, #22c55e);
            color: white;
            padding: 12px 18px;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            z-index: 10000;
            transform: translateY(100%);
            transition: transform 0.3s ease;
        `;

        success.innerHTML = `✅ ${message}`;
        document.body.appendChild(success);

        setTimeout(() => success.style.transform = 'translateY(0)', 100);
        setTimeout(() => {
            success.style.transform = 'translateY(100%)';
            setTimeout(() => success.remove(), 300);
        }, 3000);
    }

    async learnFromSubmission(analysis) {
        if (!this.settings.learning) return;

        // Verzamel anonieme data voor verbetering
        const learningData = {
            url: window.location.hostname,
            formType: analysis.type,
            fields: analysis.fields.map(f => ({
                type: f.type,
                confidence: f.confidence,
                success: f.element.value.length > 0
            })),
            timestamp: Date.now()
        };

        // Sla learning data op (lokaal)
        try {
            const existing = await chrome.storage.local.get('learningData');
            const data = existing.learningData || [];
            data.push(learningData);

            // Beperk tot laatste 1000 entries
            if (data.length > 1000) {
                data.splice(0, data.length - 1000);
            }

            await chrome.storage.local.set({ learningData: data });
        } catch (error) {
            console.log('Learning data opslaan mislukt:', error);
        }
    }

    handleMessage(message, sendResponse) {
        switch (message.type) {
            case 'GET_STATUS':
                sendResponse({
                    forms: Array.from(this.forms).map(form => {
                        const analysis = this.analyzeForm(form);
                        return {
                            type: analysis.type,
                            fields: analysis.fields.length,
                            confidence: analysis.confidence
                        };
                    }),
                    settings: this.settings
                });
                break;

            case 'FILL_CURRENT_FORM':
                this.fillCurrentForm();
                sendResponse({ success: true });
                break;

            case 'SCAN_PAGE':
                const scanResult = this.scanForForms();

                let message;
                if (this.language === 'nl') {
                    if (scanResult.newForms > 0) {
                        message = `${scanResult.newForms} nieuwe formulieren gevonden`;
                    } else if (scanResult.total > 0) {
                        message = `${scanResult.total} formulieren bevestigd`;
                    } else {
                        message = 'Geen formulieren gevonden';
                    }
                } else {
                    if (scanResult.newForms > 0) {
                        message = `${scanResult.newForms} new forms found`;
                    } else if (scanResult.total > 0) {
                        message = `${scanResult.total} forms confirmed`;
                    } else {
                        message = 'No forms found';
                    }
                }

                this.showSuccessMessage(message);

                sendResponse({
                    success: true,
                    formsFound: scanResult.total,
                    newForms: scanResult.newForms,
                    allForms: scanResult.allForms
                });
                break;

            case 'EXECUTE_COMMAND':
                this.executeNaturalLanguageCommand(message.command);
                sendResponse({ success: true });
                break;

            case 'UPDATE_SETTINGS':
                this.settings = { ...this.settings, ...message.settings };
                chrome.storage.local.set({ settings: this.settings });
                sendResponse({ success: true });
                break;
        }
    }

    fillCurrentForm() {
        const forms = Array.from(this.forms);
        if (forms.length === 0) {
            this.showSuccessMessage(this.messages.noFormsFound);
            return;
        }

        // Vul het meest relevante formulier
        const bestForm = forms
            .map(form => this.analyzeForm(form))
            .sort((a, b) => b.confidence - a.confidence)[0];

        if (bestForm) {
            this.fillForm(bestForm);
        }
    }

    executeNaturalLanguageCommand(command) {
        console.log('🗣️ Natural language command:', command);

        const lowerCommand = command.toLowerCase();

        // Multi-language natural language parsing
        const fillCommands = this.language === 'nl'
            ? ['vul', 'formulier', 'gegevens']
            : ['fill', 'form', 'details', 'data'];

        const scanCommands = this.language === 'nl'
            ? ['scan', 'zoek']
            : ['scan', 'search', 'find'];

        const accountCommands = this.language === 'nl'
            ? ['account', 'aanmak']
            : ['account', 'create', 'register', 'signup'];

        // Check for fill commands
        if (fillCommands.some(cmd => lowerCommand.includes(cmd))) {
            this.fillCurrentForm();
        } else if (scanCommands.some(cmd => lowerCommand.includes(cmd))) {
            this.scanForForms();
            this.showSuccessMessage(this.messages.pageScanned);
        } else if (accountCommands.some(cmd => lowerCommand.includes(cmd))) {
            // Zoek naar registratieformulieren
            const regForms = Array.from(this.forms)
                .map(form => this.analyzeForm(form))
                .filter(analysis => analysis.type === 'registration');

            if (regForms.length > 0) {
                this.fillForm(regForms[0]);
            } else {
                this.showSuccessMessage(this.messages.noRegistrationForm);
            }
        } else {
            this.showSuccessMessage(this.messages.commandNotUnderstood);
        }
    }
}

// Initialize Smart Account Manager
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SmartAccountManager();
    });
} else {
    new SmartAccountManager();
}
