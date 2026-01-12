// Field mapping with common variations
const FIELD_MAPPINGS = {
  name: ['name', 'fullname', 'full_name', 'full-name', 'customer_name', 'contact_name'],
  firstname: ['firstname', 'first_name', 'first-name', 'fname', 'givenname', 'given_name'],
  lastname: ['lastname', 'last_name', 'last-name', 'lname', 'surname', 'familyname'],
  address: ['address', 'street', 'street_address', 'street-address', 'streetaddress', 'addr', 'address1', 'address_1'],
  city: ['city', 'town', 'locality'],
  state: ['state', 'province', 'region', 'state_province', 'state-province'],
  zip: ['zip', 'zipcode', 'zip_code', 'zip-code', 'postal', 'postal_code', 'postal-code', 'postcode'],
  phone: ['phone', 'phone_number', 'phone-number', 'phonenumber', 'telephone', 'tel', 'mobile', 'cell', 'cellphone', 'cell_phone']
};

// Value mappings
const VALUE_MAPPINGS = {
  name: 'adam robin',
  firstname: 'adam',
  lastname: 'robin',
  address: '3050 W yorkshire dr',
  city: 'Phoenix',
  state: 'AZ',
  zip: '85085',
  phone: '6258529632'
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    fillFormFields().then(result => {
      sendResponse(result);
    });
    return true;
  }
  
  if (request.action === 'setAutoFill') {
    if (request.autoFill) {
      fillFormFields().then(result => {
        console.log('Auto-filled form:', result);
      });
    }
  }
  
  return true;
});

// Check if auto-fill is enabled and fill on page load
chrome.storage.sync.get(['autoFill'], (result) => {
  if (result.autoFill) {
    // Wait a bit for dynamic forms to load
    setTimeout(() => {
      fillFormFields();
    }, 1000);
    
    // Also listen for dynamically added forms
    const observer = new MutationObserver(() => {
      if (result.autoFill) {
        fillFormFields();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
});

async function fillFormFields() {
  return new Promise((resolve) => {
    let filledCount = 0;
    
    // Get all input, textarea, and select elements
    const allFields = document.querySelectorAll('input, textarea, select');
    
    allFields.forEach(field => {
      if (field.type === 'hidden' || field.type === 'submit' || field.type === 'button') {
        return;
      }
      
      const fieldId = (field.id || '').toLowerCase();
      const fieldName = (field.name || '').toLowerCase();
      const fieldPlaceholder = (field.placeholder || '').toLowerCase();
      const fieldType = (field.type || '').toLowerCase();
      
      // Get label text if available
      let labelText = '';
      if (field.labels && field.labels.length > 0) {
        labelText = field.labels[0].textContent.toLowerCase();
      } else {
        // Try to find label by 'for' attribute
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label) {
          labelText = label.textContent.toLowerCase();
        }
      }
      
      // Try to match field with our mappings
      for (const [key, variations] of Object.entries(FIELD_MAPPINGS)) {
        for (const variation of variations) {
          const lowerVariation = variation.toLowerCase();
          
          if (fieldId.includes(lowerVariation) || 
              fieldName.includes(lowerVariation) ||
              fieldPlaceholder.includes(lowerVariation) ||
              labelText.includes(lowerVariation)) {
            
            const value = VALUE_MAPPINGS[key];
            if (value) {
              // Handle different field types
              if (field.tagName === 'SELECT') {
                // Try to find matching option
                const options = Array.from(field.options);
                const matchingOption = options.find(opt => 
                  opt.value.toLowerCase().includes(value.toLowerCase()) ||
                  opt.text.toLowerCase().includes(value.toLowerCase())
                );
                if (matchingOption) {
                  field.value = matchingOption.value;
                } else {
                  field.value = value;
                }
              } else {
                field.value = value;
              }
              
              // Trigger events
              field.dispatchEvent(new Event('input', { bubbles: true }));
              field.dispatchEvent(new Event('change', { bubbles: true }));
              field.dispatchEvent(new Event('blur', { bubbles: true }));
              
              // For React and other frameworks
              const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype,
                'value'
              )?.set;
              
              if (nativeInputValueSetter && field.tagName === 'INPUT') {
                nativeInputValueSetter.call(field, value);
                field.dispatchEvent(new Event('input', { bubbles: true }));
              }
              
              filledCount++;
              break; // Found a match, move to next field
            }
          }
        }
      }
    });
    
    resolve({ success: true, filledCount });
  });
}

