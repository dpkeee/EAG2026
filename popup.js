// Initialize default form data on first install
const DEFAULT_FORM_DATA = {
  name: "adam robin",
  fullname: "adam robin",
  full_name: "adam robin",
  firstname: "adam",
  first_name: "adam",
  lastname: "robin",
  last_name: "robin",
  address: "3050 W yorkshire dr",
  street: "3050 W yorkshire dr",
  street_address: "3050 W yorkshire dr",
  city: "Phoenix",
  state: "AZ",
  zip: "85085",
  zipcode: "85085",
  zip_code: "85085",
  postal: "85085",
  postal_code: "85085",
  phone: "6258529632",
  phone_number: "6258529632",
  phoneNumber: "6258529632",
  telephone: "6258529632",
  mobile: "6258529632",
  cell: "6258529632"
};

// Load saved form data or initialize with defaults
document.addEventListener('DOMContentLoaded', () => {
  initializeData();
  loadFormData();
  loadAutoFillSetting();
  
  document.getElementById('fillForm').addEventListener('click', fillForm);
  document.getElementById('autoFillToggle').addEventListener('click', toggleAutoFill);
});

function initializeData() {
  chrome.storage.sync.get(['formData', 'initialized'], (result) => {
    if (!result.initialized) {
      chrome.storage.sync.set({ 
        formData: DEFAULT_FORM_DATA,
        initialized: true 
      });
    }
  });
}

function loadFormData() {
  chrome.storage.sync.get(['formData'], (result) => {
    const formData = result.formData || DEFAULT_FORM_DATA;
    const display = document.getElementById('formDataDisplay');
    
    display.innerHTML = `
      <div class="data-item"><strong>Name:</strong> ${formData.name || 'adam robin'}</div>
      <div class="data-item"><strong>Address:</strong> ${formData.address || '3050 W yorkshire dr'}</div>
      <div class="data-item"><strong>City:</strong> ${formData.city || 'Phoenix'}</div>
      <div class="data-item"><strong>State:</strong> ${formData.state || 'AZ'}</div>
      <div class="data-item"><strong>ZIP:</strong> ${formData.zip || '85085'}</div>
      <div class="data-item"><strong>Phone:</strong> ${formData.phone || '6258529632'}</div>
    `;
  });
}

function loadAutoFillSetting() {
  chrome.storage.sync.get(['autoFill'], (result) => {
    const autoFill = result.autoFill || false;
    const btn = document.getElementById('autoFillToggle');
    btn.textContent = `Auto-fill: ${autoFill ? 'ON' : 'OFF'}`;
    btn.className = autoFill ? 'toggle-btn active' : 'toggle-btn';
  });
}

function toggleAutoFill() {
  chrome.storage.sync.get(['autoFill'], (result) => {
    const newValue = !result.autoFill;
    chrome.storage.sync.set({ autoFill: newValue }, () => {
      loadAutoFillSetting();
      
      // Send message to current tab to toggle auto-fill
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'setAutoFill', 
          autoFill: newValue 
        });
      });
    });
  });
}

function fillForm() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'fillForm' }, (response) => {
      if (chrome.runtime.lastError) {
        alert('Error: ' + chrome.runtime.lastError.message);
        return;
      }
      
      if (response && response.success) {
        alert(`Form filled! Found and filled ${response.filledCount} field(s).`);
      } else {
        alert('No matching form fields found on this page.');
      }
    });
  });
}

