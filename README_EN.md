# 🤖 Smart Account Manager

An intelligent Chrome extension that radically simplifies creating and managing online accounts through AI and contextual understanding.

## ✨ Features

### 🎯 **Core Functionality**
- **Intelligent form recognition**: AI recognizes form fields regardless of name or layout
- **Proactive detection**: Automatic notifications for new forms
- **Self-learning system**: Learns from user actions for better automation
- **Natural language interface**: Commands in plain language like "Fill my details"

### 🛡️ **Privacy & Security**
- **Zero-knowledge architecture**: All data stays local on your device
- **Encrypted storage**: Personal data is securely stored
- **No cloud connection**: No data sent to external servers
- **Transparent operation**: Open source and fully transparent

### 🚀 **Advanced Capabilities**
- **Multi-platform support**: Works on all websites
- **Graceful fallback**: Clear feedback when issues occur
- **Performance optimization**: Minimal impact on browser performance
- **Learning analytics**: Insights into usage and improvements

## 🌍 **Language Support**

The extension automatically detects your browser language and adapts:

### **English Support**
- **Natural Language Commands**:
  - *"Fill my details on this site"*
  - *"Create an account with my work email"*
  - *"Scan this page for forms"*
  - *"Fill the login form"*

- **Default Profile**: John Doe, john.doe@example.com, +1 555 123 4567
- **Interface**: Fully localized English interface
- **Form Recognition**: Supports English field names and labels

### **Dutch Support**
- **Natuurlijke Taal Commando's**:
  - *"Vul mijn gegevens in op deze site"*
  - *"Maak een account aan met mijn werk email"*
  - *"Scan deze pagina op formulieren"*
  - *"Vul het inlogformulier in"*

- **Standaard Profiel**: Jan Jansen, jan.jansen@example.com, +31 6 12345678
- **Interface**: Volledig gelokaliseerde Nederlandse interface
- **Formulierherkenning**: Ondersteunt Nederlandse veldnamen en labels

## 📦 Installation

### **Developer Mode (Recommended for testing)**

1. **Download the extension files**
   ```bash
   # Create a new folder for the extension
   mkdir smart-account-manager
   cd smart-account-manager
   ```

2. **Copy all files**
   - `manifest.json` - Chrome extension configuration
   - `popup.html` - Interface popup
   - `popup.js` - Popup logic
   - `content.js` - Main script for form detection
   - `background.js` - Background service
   - `icons/` folder - Icons (create this)

3. **Add icons**
   Place icons in the `icons/` folder:
   - `icon16.png` (16x16 pixels)
   - `icon32.png` (32x32 pixels)  
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

4. **Install in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `smart-account-manager` folder
   - The extension now appears in your toolbar! 🎉

### **Chrome Web Store (Future)**
After further development and testing, the extension will be available in the Chrome Web Store for easy installation.

## 🎮 Usage

### **Quick Start**
1. **Navigate to a website** with a login or registration form
2. **See automatic detection** - A notification appears in the top right
3. **Click the notification** or use the extension popup to fill forms

### **Natural Language Commands**
Open the extension popup and try these commands:

**English:**
- *"Fill my details on this site"*
- *"Create an account with my work email"*  
- *"Scan this page for forms"*
- *"Fill the login form"*

**Dutch:**
- *"Vul mijn gegevens in op deze site"*
- *"Maak een account aan met mijn werk email"*  
- *"Scan deze pagina op formulieren"*
- *"Vul het inlogformulier in"*

### **Interface Elements**

#### **📊 Status Dashboard**
- **Green dot**: Forms detected and ready
- **Yellow dot**: Scanning
- **Red dot**: No forms found

#### **⚙️ Settings**
- **Auto-detection**: Automatically scan for new forms
- **Proactive notifications**: Pop-up notifications when forms are detected  
- **Learn from actions**: System learns from your behavior

#### **🔧 Quick Actions**
- **📝 Fill Current Form**: Fills the best detected form
- **🔍 Scan Page**: Manual scan for new forms

## 🧠 How it works

### **Intelligent Recognition**
The AI analyzes form fields through:
- **Contextual analysis**: Understands field names in Dutch and English
- **Pattern recognition**: Recognizes email, name, phone, and address fields
- **Layout understanding**: Analyzes position and labels of fields
- **Type detection**: Distinguishes login vs registration vs general forms

### **Self-learning Mechanism**
- **Human-in-the-loop**: Asks for feedback on unknown forms
- **Success tracking**: Monitors which automations work
- **Pattern building**: Builds database of successful recognition methods
- **Continuous improvement**: Gets smarter the more you use it

### **Privacy-First Design**
- **Local processing**: All AI analysis happens in your browser
- **Encrypted storage**: Personal data is encrypted and stored locally
- **Anonymous learning**: Only anonymous patterns are tracked
- **No tracking**: No user behavior is shared externally

## 🛠️ Technical Details

### **Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   popup.html    │    │   content.js    │    │  background.js  │
│   (Interface)   │◄──►│ (AI & Detection)│◄──►│   (Storage)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **AI Components**
- **Computer Vision**: For visual form analysis
- **NLP Processing**: For natural language commands  
- **Pattern Matching**: For smart field recognition
- **Machine Learning**: For self-improvement

### **Multilingual Support**
- **Automatic Language Detection**: Based on browser language
- **Localized Interfaces**: Dutch and English UI
- **Cultural Defaults**: Appropriate default values per region
- **Pattern Recognition**: Supports field names in both languages

### **Performance**
- **Minimal resource impact**: < 5MB memory usage
- **Fast detection**: < 500ms for form analysis
- **Efficient storage**: Compact data storage
- **Non-blocking**: No delay to normal browsing

---

**Made with ❤️ for a better browsing experience**
