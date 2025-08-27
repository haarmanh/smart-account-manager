# 🤖 Smart Account Manager

Een intelligente Chrome-extensie die het aanmaken en beheren van online accounts radicaal vereenvoudigt door gebruik van AI en contextueel begrip.

## ✨ Features

### 🎯 **Kernfunctionaliteit**
- **Intelligente formulierherkenning**: AI herkent formuliervelden ongeacht naam of layout
- **Proactieve detectie**: Automatische meldingen bij nieuwe formulieren
- **Zelflerend systeem**: Leert van gebruikersacties voor betere automatisering
- **Natuurlijke taal interface**: Commando's in gewone taal zoals "Vul mijn gegevens in"

### 🛡️ **Privacy & Veiligheid**
- **Zero-knowledge architectuur**: Alle data blijft lokaal op je apparaat
- **Versleutelde opslag**: Persoonlijke gegevens worden veilig opgeslagen
- **Geen cloud-verbinding**: Geen data wordt naar externe servers verzonden
- **Transparante werking**: Open source en volledig inzichtelijk

### 🚀 **Geavanceerde Mogelijkheden**
- **Multi-platform ondersteuning**: Werkt op alle websites
- **Graceful fallback**: Duidelijke feedback bij problemen
- **Performance optimalisatie**: Minimale impact op browserprestaties
- **Learning analytics**: Inzicht in gebruik en verbeteringen

## 📦 Installatie

### **Ontwikkelaar Modus (Aanbevolen voor testing)**

1. **Download de extensie bestanden**
   ```bash
   # Maak een nieuwe map voor de extensie
   mkdir smart-account-manager
   cd smart-account-manager
   ```

2. **Kopieer alle bestanden**
   - `manifest.json` - Chrome extensie configuratie
   - `popup.html` - Interface popup
   - `popup.js` - Popup logica
   - `content.js` - Hoofdscript voor formulierdetectie
   - `background.js` - Achtergronddienst
   - `icons/` map - Pictogrammen (maak deze aan)

3. **Voeg pictogrammen toe**
   Plaats pictogrammen in de `icons/` map:
   - `icon16.png` (16x16 pixels)
   - `icon32.png` (32x32 pixels)  
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

4. **Installeer in Chrome**
   - Open Chrome en ga naar `chrome://extensions/`
   - Schakel "Ontwikkelaarsmodus" in (rechtsboven)
   - Klik "Uitgepakte extensie laden"
   - Selecteer de `smart-account-manager` map
   - De extensie verschijnt nu in je toolbar! 🎉

### **Chrome Web Store (Toekomstig)**
Na verdere ontwikkeling en testing wordt de extensie beschikbaar in de Chrome Web Store voor eenvoudige installatie.

## 🎮 Gebruik

### **Quick Start**
1. **Navigeer naar een website** met een inlog- of registratieformulier
2. **Zie de automatische detectie** - Een melding verschijnt rechtsbovenin
3. **Klik op de melding** of gebruik de extensie popup om formulieren in te vullen

### **Natuurlijke Taal Commando's**
Open de extensie popup en probeer deze commando's:
- *"Vul mijn gegevens in op deze site"*
- *"Maak een account aan met mijn werk email"*  
- *"Scan deze pagina op formulieren"*
- *"Vul het inlogformulier in"*

### **Interface Elementen**

#### **📊 Status Dashboard**
- **Groene stip**: Formulieren gedetecteerd en klaar
- **Gele stip**: Aan het scannen
- **Rode stip**: Geen formulieren gevonden

#### **⚙️ Instellingen**
- **Auto-detectie**: Automatisch scannen op nieuwe formulieren
- **Proactieve meldingen**: Pop-up meldingen bij formulierdetectie  
- **Leer van acties**: Systeem leert van je gedrag

#### **🔧 Quick Actions**
- **📝 Vul Huidig Formulier**: Vult het beste gedetecteerde formulier
- **🔍 Scan Pagina**: Handmatige scan naar nieuwe formulieren

## 🧠 Hoe het werkt

### **Intelligente Herkenning**
De AI analyseert formuliervelden door:
- **Contextuele analyse**: Begrijpt veldnamen in Nederlands en Engels
- **Patroonherkenning**: Herkent email-, naam-, telefoon- en adresvelden
- **Layout understanding**: Analyseert positie en labels van velden
- **Type detectie**: Onderscheidt login vs registratie vs algemene formulieren

### **Zelflerend Mechanisme**
- **Human-in-the-loop**: Vraagt feedback bij onbekende formulieren
- **Succes tracking**: Monitort welke automatiseringen werken
- **Pattern building**: Bouwt database van succesvolle herkenningsmethoden
- **Continuous improvement**: Wordt slimmer naarmate je het meer gebruikt

### **Privacy-First Design**
- **Lokale verwerking**: Alle AI-analyse gebeurt in je browser
- **Versleutelde opslag**: Persoonlijke data is versleuteld opgeslagen
- **Anonieme learning**: Alleen anonieme patronen worden bijgehouden
- **Geen tracking**: Geen gebruikersgedrag wordt extern gedeeld

## 🛠️ Technische Details

### **Architectuur**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   popup.html    │    │   content.js    │    │  background.js  │
│   (Interface)   │◄──►│ (AI & Detection)│◄──►│   (Storage)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **AI-Componenten**
- **Computer Vision**: Voor visuele formulieranalyse
- **NLP Processing**: Voor natuurlijke taalcommando's  
- **Pattern Matching**: Voor slimme veldherkenning
- **Machine Learning**: Voor zelfverbetering

### **Performance**
- **Minimale resource impact**: < 5MB geheugengebruik
- **Snelle detectie**: < 500ms voor formulieranalyse
- **Efficient storage**: Compacte data opslag
- **Non-blocking**: Geen vertraging van normale browsing

## 🔧 Ontwikkeling

### **Development Setup**
```bash
# Clone repository
git clone [repository-url]
cd smart-account-manager

# Install development dependencies (indien aanwezig)
npm install

# Start development mode
npm run dev
```

### **Testing**
Test de extensie op verschillende websites:
- **E-commerce**: Amazon, Bol.com, Coolblue
- **Social Media**: Facebook, LinkedIn, Twitter
- **Zakelijk**: Gmail, Office 365, Slack
- **Banking**: ING, Rabobank (let op: gebruik test-accounts!)

### **Debugging**
- Open Chrome DevTools op pagina's waar de extensie actief is
- Check Console voor `🤖 Smart Account Manager` logs
- Gebruik `chrome://extensions/` voor extensie-specifieke debugging
- Background script logs: `chrome://extensions/ → Details → Inspect views: service worker`

## 🚀 Roadmap

### **v1.1 - Verbeterde AI**
- [ ] Geavanceerdere natuurlijke taalverwerking
- [ ] Betere contextherkenning voor complexe formulieren
- [ ] Support voor multi-step formulieren

### **v1.2 - Workflow Automatisering**
- [ ] "Onthoud deze actie" functionaliteit
- [ ] Automatische navigatie na inloggen
- [ ] Custom workflow creation

### **v1.3 - Enterprise Features**
- [ ] Team-based profile sharing
- [ ] Company-wide deployment tools
- [ ] Advanced analytics dashboard

### **v2.0 - Cross-Browser**
- [ ] Firefox ondersteuning
- [ ] Safari extensie
- [ ] Edge compatibility

## 🤝 Bijdragen

Bijdragen zijn welkom! Zie [CONTRIBUTING.md] voor details over:
- Code style guidelines
- Pull request proces
- Issue reporting
- Development workflow

## 📄 Licentie

Dit project is gelicenseerd onder de MIT License - zie [LICENSE.md] voor details.

## 🆘 Support

- **Bug reports**: [GitHub Issues]
- **Feature requests**: [GitHub Discussions]
- **Documentation**: [Wiki]
- **Email**: support@smartaccountmanager.com

---

**Gemaakt met ❤️ voor een betere browser-ervaring**
