// Smart Account Manager - Background Script
class BackgroundManager {
    constructor() {
        this.formsData = new Map();
        this.userProfile = {};
        this.init();
    }

    init() {
        console.log('🚀 Smart Account Manager Background Service gestart');
        
        // Listen voor messages van content scripts
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Async response
        });

        // Listen voor tab updates
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.onTabComplete(tabId, tab);
            }
        });

        // Initialize storage
        this.initializeStorage();
    }

    async initializeStorage() {
        try {
            const result = await chrome.storage.local.get(['userProfile', 'settings']);

            // Detect language for default profile
            const browserLang = navigator.language || navigator.userLanguage;
            const isNL = browserLang.toLowerCase().startsWith('nl');

            // Set default user profile als leeg
            if (!result.userProfile) {
                const defaultProfile = isNL ? {
                    firstName: 'Jan',
                    lastName: 'Jansen',
                    fullName: 'Jan Jansen',
                    email: 'jan.jansen@example.com',
                    phone: '+31 6 12345678',
                    address: 'Voorbeeldstraat 123',
                    city: 'Amsterdam',
                    zipCode: '1000 AB',
                    country: 'Nederland'
                } : {
                    firstName: 'John',
                    lastName: 'Doe',
                    fullName: 'John Doe',
                    email: 'john.doe@example.com',
                    phone: '+1 555 123 4567',
                    address: '123 Main Street',
                    city: 'New York',
                    zipCode: '10001',
                    country: 'United States'
                };

                await chrome.storage.local.set({ userProfile: defaultProfile });
                this.userProfile = defaultProfile;
            } else {
                this.userProfile = result.userProfile;
            }

            // Set default settings als leeg
            if (!result.settings) {
                const defaultSettings = {
                    autoDetect: true,
                    notifications: true,
                    learning: true
                };
                
                await chrome.storage.local.set({ settings: defaultSettings });
            }

        } catch (error) {
            console.error('Storage initialisatie mislukt:', error);
        }
    }

    async handleMessage(message, sender, sendResponse) {
        try {
            switch (message.type) {
                case 'FORMS_UPDATED':
                    if (sender.tab && sender.tab.id) {
                        this.updateFormsData(sender.tab.id, message);
                        await this.updateBadge(sender.tab.id, message.count);
                    }
                    sendResponse({ success: true });
                    break;

                case 'GET_USER_PROFILE':
                    sendResponse({ profile: this.userProfile });
                    break;

                case 'UPDATE_USER_PROFILE':
                    await this.updateUserProfile(message.profile);
                    sendResponse({ success: true });
                    break;

                case 'LOG_ACTIVITY':
                    if (sender.tab) {
                        await this.logActivity(sender.tab, message.activity);
                    }
                    sendResponse({ success: true });
                    break;

                case 'GET_LEARNING_DATA':
                    await this.getLearningData(sendResponse);
                    break;

                default:
                    sendResponse({ error: 'Onbekend message type' });
            }
        } catch (error) {
            console.error('Smart Account Manager: Message handling error:', error);
            sendResponse({ error: error.message, success: false });
        }
    }

    updateFormsData(tabId, data) {
        this.formsData.set(tabId, {
            count: data.count,
            newForms: data.newForms,
            timestamp: Date.now(),
            url: ''
        });

        // Log voor debugging
        console.log(`📊 Tab ${tabId}: ${data.count} formulieren (${data.newForms} nieuw)`);
    }

    async updateBadge(tabId, count) {
        try {
            // Check if tab still exists
            const tab = await chrome.tabs.get(tabId).catch(() => null);
            if (!tab) {
                console.warn(`Smart Account Manager: Tab ${tabId} no longer exists, skipping badge update`);
                return;
            }

            if (count > 0) {
                await chrome.action.setBadgeText({
                    text: count.toString(),
                    tabId: tabId
                });
                await chrome.action.setBadgeBackgroundColor({
                    color: '#4CAF50',
                    tabId: tabId
                });
            } else {
                await chrome.action.setBadgeText({
                    text: '',
                    tabId: tabId
                });
            }
        } catch (error) {
            console.warn(`Smart Account Manager: Badge update failed for tab ${tabId}:`, error.message);
        }
    }

    async onTabComplete(tabId, tab) {
        try {
            // Update forms data met URL
            if (this.formsData.has(tabId)) {
                const data = this.formsData.get(tabId);
                data.url = tab.url;
                this.formsData.set(tabId, data);
            }

            // Reset badge voor nieuwe pagina
            await this.updateBadge(tabId, 0);
        } catch (error) {
            console.warn('Smart Account Manager: Tab complete handling error:', error.message);
        }
    }

    async updateUserProfile(profile) {
        try {
            this.userProfile = { ...this.userProfile, ...profile };
            await chrome.storage.local.set({ userProfile: this.userProfile });
            console.log('👤 Gebruikersprofiel bijgewerkt:', this.userProfile);
        } catch (error) {
            console.error('Profiel update mislukt:', error);
        }
    }

    async logActivity(tab, activity) {
        try {
            const logEntry = {
                url: tab.url,
                title: tab.title,
                activity: activity,
                timestamp: Date.now()
            };

            // Haal bestaande logs op
            const result = await chrome.storage.local.get('activityLog');
            const logs = result.activityLog || [];
            
            // Voeg nieuwe log toe
            logs.push(logEntry);
            
            // Beperk tot laatste 500 entries
            if (logs.length > 500) {
                logs.splice(0, logs.length - 500);
            }
            
            await chrome.storage.local.set({ activityLog: logs });
            
        } catch (error) {
            console.error('Activity logging mislukt:', error);
        }
    }

    async getLearningData(sendResponse) {
        try {
            const result = await chrome.storage.local.get('learningData');
            const learningData = result.learningData || [];

            // Analyseer patterns in de data
            const analysis = this.analyzeLearningData(learningData);

            sendResponse({
                data: learningData,
                analysis: analysis,
                success: true
            });

        } catch (error) {
            console.error('Learning data ophalen mislukt:', error);
            sendResponse({
                error: 'Data ophalen mislukt',
                success: false
            });
        }
    }

    analyzeLearningData(data) {
        if (data.length === 0) {
            return { summary: 'Nog geen leerdata beschikbaar' };
        }

        // Analyseer success rates per site
        const siteStats = {};
        const fieldTypeStats = {};

        data.forEach(entry => {
            // Site statistieken
            if (!siteStats[entry.url]) {
                siteStats[entry.url] = { total: 0, successful: 0 };
            }
            siteStats[entry.url].total++;

            const successful = entry.fields.some(f => f.success);
            if (successful) {
                siteStats[entry.url].successful++;
            }

            // Field type statistieken
            entry.fields.forEach(field => {
                if (!fieldTypeStats[field.type]) {
                    fieldTypeStats[field.type] = { total: 0, successful: 0 };
                }
                fieldTypeStats[field.type].total++;
                if (field.success) {
                    fieldTypeStats[field.type].successful++;
                }
            });
        });

        // Bereken success rates
        const topSites = Object.entries(siteStats)
            .map(([url, stats]) => ({
                url,
                successRate: (stats.successful / stats.total * 100).toFixed(1),
                total: stats.total
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);

        const fieldPerformance = Object.entries(fieldTypeStats)
            .map(([type, stats]) => ({
                type,
                successRate: (stats.successful / stats.total * 100).toFixed(1),
                total: stats.total
            }))
            .sort((a, b) => b.total - a.total);

        return {
            summary: `${data.length} formulieren geanalyseerd`,
            topSites,
            fieldPerformance,
            totalEntries: data.length
        };
    }
}

// Initialize background manager
new BackgroundManager();
