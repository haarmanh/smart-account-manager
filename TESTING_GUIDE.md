# 🧪 Testing Guide - Smart Account Manager

## 🚀 **Quick Installation for Testing**

### **Step 1: Load Extension**
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select your `Smart Account Manager` folder
5. Extension should appear in toolbar with placeholder icon

### **Step 2: Verify Installation**
- Extension icon appears in Chrome toolbar
- Click icon to open popup interface
- Should see "Smart Account Manager" with status indicator

## 🎯 **Core Functionality Tests**

### **Test 1: Basic Form Detection**
**Websites to test:**
- Gmail signup: https://accounts.google.com/signup
- Facebook signup: https://www.facebook.com/reg/
- LinkedIn signup: https://www.linkedin.com/signup
- GitHub signup: https://github.com/signup

**Expected behavior:**
1. Navigate to signup page
2. Extension should show notification in top-right
3. Popup should show "X form(s) detected"
4. Status dot should be green

### **Test 2: Natural Language Commands**
**Open extension popup and try:**

**English commands:**
- "Fill my details on this site"
- "Create an account"
- "Fill the form"
- "Scan this page"

**Dutch commands:**
- "Vul mijn gegevens in"
- "Maak een account aan"
- "Vul het formulier in"
- "Scan deze pagina"

**Expected behavior:**
- Commands should execute without errors
- Success toast should appear
- Forms should be filled with default data

### **Test 3: Auto-Fill Functionality**
**Test on these form types:**

**Login Forms:**
- Gmail: https://accounts.google.com/signin
- Facebook: https://www.facebook.com/login
- LinkedIn: https://www.linkedin.com/login

**Registration Forms:**
- Any website signup form
- Contact forms
- Newsletter signups

**Expected behavior:**
- Email fields filled with appropriate default
- Name fields filled correctly (first/last name detection)
- Phone fields filled with regional format
- No password auto-filling (security feature)

### **Test 4: Settings & Preferences**
**In extension popup:**
1. Toggle "Auto-detection" off/on
2. Toggle "Notifications" off/on
3. Toggle "Learning" off/on

**Expected behavior:**
- Settings should persist after browser restart
- Notifications should respect settings
- Toast confirmations for setting changes

## 🌍 **Language Detection Tests**

### **Test Browser Language**
1. Change Chrome language to Dutch: `chrome://settings/languages`
2. Restart Chrome
3. Test extension interface (should be in Dutch)
4. Change back to English
5. Test again (should be in English)

### **Test Default Profiles**
**Dutch browser:**
- Default name: Jan Jansen
- Default email: jan.jansen@example.com
- Default phone: +31 6 12345678

**English browser:**
- Default name: John Doe
- Default email: john.doe@example.com
- Default phone: +1 555 123 4567

## 🔍 **Advanced Testing**

### **Test 5: Dynamic Form Detection**
**Websites with dynamic forms:**
- Single Page Applications (SPAs)
- Forms loaded via JavaScript
- Modal dialogs with forms

**Test procedure:**
1. Load page initially
2. Trigger dynamic form loading
3. Check if extension detects new forms
4. Verify notification appears

### **Test 6: Complex Form Types**
**Multi-step forms:**
- Checkout processes
- Registration wizards
- Survey forms

**Unusual form layouts:**
- Custom styled forms
- Forms without labels
- Forms with placeholder-only text

### **Test 7: Performance Testing**
**Monitor in Chrome DevTools:**
1. Open DevTools → Performance tab
2. Record while using extension
3. Check memory usage
4. Verify no memory leaks
5. Ensure minimal CPU impact

## 🐛 **Error Testing**

### **Test 8: Error Handling**
**Intentional error scenarios:**
1. Disable internet connection
2. Navigate away during form filling
3. Remove form elements dynamically
4. Test with corrupted storage data

**Expected behavior:**
- Graceful error handling
- No JavaScript console errors
- User-friendly error messages
- Extension continues working

### **Test 9: Edge Cases**
**Unusual scenarios:**
- Very long form pages
- Forms with hundreds of fields
- Nested iframes with forms
- Password-protected pages

## 📊 **Console Monitoring**

### **Check for Clean Logs**
Open Chrome DevTools Console and verify:
- ✅ No red error messages
- ✅ Only informational logs from extension
- ✅ Proper "Smart Account Manager" prefixes
- ✅ No warnings about deprecated APIs

### **Expected Console Messages**
```
🤖 Smart Account Manager activated
📝 New login form detected: [object]
🗣️ Natural language command: fill my details
✅ 3 fields filled
```

## 🎯 **Success Criteria**

### **Must Pass:**
- [ ] Extension loads without errors
- [ ] Form detection works on major sites
- [ ] Natural language commands execute
- [ ] Auto-fill works correctly
- [ ] Settings persist properly
- [ ] No console errors
- [ ] Language detection works
- [ ] Privacy: no external network requests

### **Should Pass:**
- [ ] Works on 90%+ of tested websites
- [ ] Fast form detection (< 1 second)
- [ ] Intuitive user interface
- [ ] Helpful error messages
- [ ] Smooth animations and transitions

## 🚨 **Common Issues & Solutions**

### **Extension Not Loading**
- Check manifest.json syntax
- Verify all files are present
- Check Chrome version compatibility

### **Forms Not Detected**
- Check if forms are dynamically loaded
- Verify content script injection
- Test on simpler forms first

### **Commands Not Working**
- Check popup.js console for errors
- Verify message passing between scripts
- Test with simpler commands

### **Auto-Fill Not Working**
- Check if fields are properly detected
- Verify field type recognition
- Test manual form filling first

## 📝 **Testing Checklist**

**Before Each Test Session:**
- [ ] Clear extension data: `chrome://extensions/` → Details → "Clear all data"
- [ ] Restart Chrome
- [ ] Check console is clear
- [ ] Verify extension is enabled

**After Each Test Session:**
- [ ] Document any issues found
- [ ] Note performance observations
- [ ] Save console logs if errors occur
- [ ] Test on different websites

---

**Happy Testing! 🎉**

Report any issues or unexpected behavior for immediate fixes.
