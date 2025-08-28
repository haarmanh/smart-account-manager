// Smart Account Manager - Popup Script
class PopupManager {
    constructor() {
        this.language = this.detectLanguage();
        this.messages = this.loadMessages();
        this.init();
    }

    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        return browserLang.toLowerCase().startsWith('nl') ? 'nl' : 'en';
    }

    loadMessages() {
        const messages = {
            en: {
                noFormsDetected: 'No forms detected',
                formsDetected: '{count} form(s) detected',
                commandExecuted: 'Command executed',
                commandFailed: 'Command failed',
                enterCommand: 'Enter a command',
                autoDetection: 'Auto-detection',
                notifications: 'Notifications',
                learning: 'Learning',
                enabled: 'enabled',
                disabled: 'disabled',
                settingChangeFailed: 'Setting change failed'
            },
            nl: {
                noFormsDetected: 'Geen formulieren gedetecteerd',
                formsDetected: '{count} formulier(en) gedetecteerd',
                commandExecuted: 'Commando uitgevoerd',
                commandFailed: 'Commando mislukt',
                enterCommand: 'Voer een commando in',
                autoDetection: 'Auto-detectie',
                notifications: 'Meldingen',
                learning: 'Leren',
                enabled: 'aan',
                disabled: 'uit',
                settingChangeFailed: 'Instelling wijzigen mislukt'
            }
        };

        return messages[this.language];
    }

    async init() {
        this.updateUILanguage();
        this.bindEventListeners();
        await this.loadStatus();
        await this.loadSettings();
    }

    updateUILanguage() {
        if (this.language === 'en') {
            // Update header
            const headerTitle = document.getElementById('headerTitle');
            const headerSubtitle = document.getElementById('headerSubtitle');
            if (headerTitle) headerTitle.textContent = '🤖 Smart Account Manager';
            if (headerSubtitle) headerSubtitle.textContent = 'Intelligent form assistant';

            // Update static text elements to English
            const updates = {
                'statusText': 'Waiting for forms...',
                'executeCommand': 'Execute Command',
                'fillCurrentForm': '📝 Fill Current Form',
                'scanPage': '🔍 Scan Page'
            };

            Object.entries(updates).forEach(([id, text]) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = text;
                }
            });

            // Update placeholder
            const commandInput = document.getElementById('commandInput');
            if (commandInput) {
                commandInput.placeholder = 'E.g: "Fill my details on this site" or "Create an account with my work email"';
            }

            // Update natural language section title
            const nlTitle = document.querySelector('h3');
            if (nlTitle && nlTitle.textContent.includes('Natuurlijke Taal')) {
                nlTitle.textContent = '🗣️ Natural Language';
            }

            // Update settings labels
            const settingsLabels = document.querySelectorAll('.settings-item span');
            const englishLabels = ['Auto-detection', 'Proactive notifications', 'Learn from actions'];
            settingsLabels.forEach((label, index) => {
                if (englishLabels[index]) {
                    label.textContent = englishLabels[index];
                }
            });
        }
    }

    bindEventListeners() {
        // Command execution
        document.getElementById('executeCommand').addEventListener('click', () => {
            this.executeCommand();
        });

        document.getElementById('commandInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                this.executeCommand();
            }
        });

        // Quick actions
        document.getElementById('fillCurrentForm').addEventListener('click', () => {
            this.sendMessageToContent('FILL_CURRENT_FORM');
        });

        document.getElementById('scanPage').addEventListener('click', async () => {
            try {
                const scanBtn = document.getElementById('scanPage');
                const originalText = scanBtn.textContent;
                const scanningText = this.language === 'nl' ? '🔍 Scannen...' : '🔍 Scanning...';

                scanBtn.textContent = scanningText;
                scanBtn.disabled = true;

                const response = await this.sendMessageToContent('SCAN_PAGE');

                if (response && response.success) {
                    const message = this.language === 'nl'
                        ? `Scan voltooid: ${response.formsFound || 0} formulieren gevonden`
                        : `Scan complete: ${response.formsFound || 0} forms found`;
                    this.showToast(message, 'success');

                    // Refresh status after scan
                    setTimeout(() => this.loadStatus(), 500);
                } else {
                    const errorMsg = this.language === 'nl' ? 'Scan mislukt' : 'Scan failed';
                    this.showToast(errorMsg, 'error');
                }

                scanBtn.textContent = originalText;
                scanBtn.disabled = false;
            } catch (error) {
                console.error('Scan page error:', error);
                const errorMsg = this.language === 'nl' ? 'Scan mislukt' : 'Scan failed';
                this.showToast(errorMsg, 'error');

                const scanBtn = document.getElementById('scanPage');
                const defaultText = this.language === 'nl' ? '🔍 Scan Pagina' : '🔍 Scan Page';
                scanBtn.textContent = defaultText;
                scanBtn.disabled = false;
            }
        });

        // Settings toggles
        document.getElementById('autoDetectToggle').addEventListener('click', (e) => {
            this.toggleSetting('autoDetect', e.target);
        });

        document.getElementById('notificationsToggle').addEventListener('click', (e) => {
            this.toggleSetting('notifications', e.target);
        });

        document.getElementById('learningToggle').addEventListener('click', (e) => {
            this.toggleSetting('learning', e.target);
        });
    }

    async loadStatus() {
        try {
            const response = await this.sendMessageToContent('GET_STATUS');
            if (response && response.forms) {
                this.updateStatus(response.forms);
            }
        } catch (error) {
            console.log('Status laden mislukt:', error);
            this.updateStatus([]);
        }
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.local.get('settings');
            const settings = result.settings || {
                autoDetect: true,
                notifications: true,
                learning: true
            };

            this.updateSettingsUI(settings);
        } catch (error) {
            console.log('Instellingen laden mislukt:', error);
        }
    }

    updateStatus(forms) {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        const detectedForms = document.getElementById('detectedForms');

        if (forms.length === 0) {
            statusDot.className = 'status-dot status-standby';
            statusText.textContent = this.messages.noFormsDetected;
            detectedForms.style.display = 'none';
        } else {
            statusDot.className = 'status-dot status-active';
            statusText.textContent = this.messages.formsDetected.replace('{count}', forms.length);
            detectedForms.style.display = 'block';

            // Toon gedetecteerde formulieren
            detectedForms.innerHTML = forms.map(form => {
                const typeIcons = {
                    'login': '🔐',
                    'registration': '📝',
                    'form': '📋'
                };

                const typeNames = this.language === 'nl' ? {
                    'login': 'Inloggen',
                    'registration': 'Registratie',
                    'form': 'Formulier'
                } : {
                    'login': 'Login',
                    'registration': 'Registration',
                    'form': 'Form'
                };

                const fieldsText = this.language === 'nl' ? 'velden' : 'fields';
                const certaintyText = this.language === 'nl' ? 'zeker' : 'certain';

                return `
                    <div class="form-item">
                        ${typeIcons[form.type] || '📋'} ${typeNames[form.type] || typeNames.form}
                        (${form.fields} ${fieldsText}, ${Math.round(form.confidence * 100)}% ${certaintyText})
                    </div>
                `;
            }).join('');
        }
    }

    updateSettingsUI(settings) {
        const toggles = {
            'autoDetectToggle': settings.autoDetect,
            'notificationsToggle': settings.notifications,
            'learningToggle': settings.learning
        };

        Object.entries(toggles).forEach(([id, active]) => {
            const toggle = document.getElementById(id);
            if (toggle) {
                toggle.classList.toggle('active', active);
            }
        });
    }

    async executeCommand() {
        const commandInput = document.getElementById('commandInput');
        const command = commandInput.value.trim();

        if (!command) {
            this.showToast(this.messages.enterCommand, 'warning');
            return;
        }

        try {
            // Voeg loading state toe
            const executeBtn = document.getElementById('executeCommand');
            const originalText = executeBtn.textContent;
            const executingText = this.language === 'nl' ? 'Uitvoeren...' : 'Executing...';
            executeBtn.textContent = executingText;
            executeBtn.disabled = true;

            await this.sendMessageToContent('EXECUTE_COMMAND', { command });

            commandInput.value = '';
            this.showToast(this.messages.commandExecuted, 'success');

            // Refresh status na commando
            setTimeout(() => this.loadStatus(), 500);

        } catch (error) {
            this.showToast(this.messages.commandFailed, 'error');
            console.error('Command execution failed:', error);
        } finally {
            const executeBtn = document.getElementById('executeCommand');
            const defaultText = this.language === 'nl' ? 'Voer Commando Uit' : 'Execute Command';
            executeBtn.textContent = defaultText;
            executeBtn.disabled = false;
        }
    }

    async toggleSetting(settingName, toggleElement) {
        const isActive = toggleElement.classList.contains('active');
        toggleElement.classList.toggle('active');

        const newSettings = {};
        newSettings[settingName] = !isActive;

        try {
            // Update lokale opslag
            const currentSettings = await chrome.storage.local.get('settings');
            const updatedSettings = { ...currentSettings.settings, ...newSettings };
            await chrome.storage.local.set({ settings: updatedSettings });

            // Probeer update naar content script te sturen (optioneel)
            try {
                await this.sendMessageToContent('UPDATE_SETTINGS', { settings: newSettings });
            } catch (contentError) {
                // Content script niet beschikbaar, maar lokale opslag is wel bijgewerkt
                console.log('Content script not available for settings update:', contentError.message);
            }

            const settingNames = this.language === 'nl' ? {
                'autoDetect': 'Auto-detectie',
                'notifications': 'Meldingen',
                'learning': 'Leren'
            } : {
                'autoDetect': 'Auto-detection',
                'notifications': 'Notifications',
                'learning': 'Learning'
            };

            const statusText = !isActive ? this.messages.enabled : this.messages.disabled;
            this.showToast(`${settingNames[settingName]} ${statusText}`, 'success');

        } catch (error) {
            // Revert toggle op fout
            toggleElement.classList.toggle('active');
            this.showToast(this.messages.settingChangeFailed, 'error');
            console.error('Setting toggle failed:', error.message || error);
        }
    }

    async sendMessageToContent(type, data = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                if (!tabs[0]) {
                    reject(new Error('Geen actieve tab gevonden'));
                    return;
                }

                const tab = tabs[0];

                // Inject content script if not already present
                try {
                    await chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    });
                    // Small delay to ensure content script is ready
                    await new Promise(r => setTimeout(r, 100));
                } catch (injectionError) {
                    // Content script might already be injected, continue
                    console.log('Content script injection note:', injectionError.message);
                }

                chrome.tabs.sendMessage(tab.id, { type, ...data }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve(response);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    showToast(message, type = 'info') {
        // Creëer toast notification binnen popup
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: ${this.getToastColor(type)};
            color: white;
            padding: 12px;
            border-radius: 8px;
            font-size: 12px;
            text-align: center;
            transform: translateY(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
        `;

        toast.textContent = message;
        document.body.appendChild(toast);

        // Animatie
        setTimeout(() => toast.style.transform = 'translateY(0)', 10);
        setTimeout(() => {
            toast.style.transform = 'translateY(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    getToastColor(type) {
        const colors = {
            'success': 'rgba(76, 175, 80, 0.9)',
            'error': 'rgba(244, 67, 54, 0.9)',
            'warning': 'rgba(255, 193, 7, 0.9)',
            'info': 'rgba(33, 150, 243, 0.9)'
        };
        return colors[type] || colors.info;
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
});
