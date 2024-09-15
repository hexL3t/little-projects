document.addEventListener('DOMContentLoaded', function() {
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpMessage = document.getElementById('rsvp-message');
    const dietaryYes = document.getElementById('dietary_yes');
    const dietaryNo = document.getElementById('dietary_no');
    const dietaryDetails = document.getElementById('user_dietary_details');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const contactError = document.getElementById('contact-error');
    const attendanceInputs = document.querySelectorAll('input[name="user_attendance"]');
    const optionalFields = document.getElementById('optional-fields');
    const plusOneInputs = document.querySelectorAll('input[name="user_plusone"]');
    const plusOneNames = document.getElementById('user_plusone_names');

    function toggleDietaryDetails() {
        dietaryDetails.classList.toggle('hidden', !dietaryYes.checked);
    }

    function toggleFormVisibility() {
        const attendance = this.value;
        optionalFields.style.display = (attendance === 'no') ? 'none' : 'block';
    }

    function togglePlusOneNames() {
        const plusOneValue = document.querySelector('input[name="user_plusone"]:checked').value;
        plusOneNames.classList.toggle('hidden', plusOneValue === '0');
        plusOneNames.disabled = plusOneValue === '0';
        if (plusOneValue !== '0') {
            plusOneNames.placeholder = `Enter name${plusOneValue === '2' ? 's' : ''} of your guest${plusOneValue === '2' ? 's' : ''}`;
        }
    }

    dietaryYes.addEventListener('change', toggleDietaryDetails);
    dietaryNo.addEventListener('change', toggleDietaryDetails);
    attendanceInputs.forEach(input => input.addEventListener('change', toggleFormVisibility));
    plusOneInputs.forEach(input => input.addEventListener('change', togglePlusOneNames));

    rsvpForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const attendance = document.querySelector('input[name="user_attendance"]:checked').value;

        if (attendance !== 'no' && !emailInput.value && !phoneInput.value) {
            contactError.classList.remove('hidden');
            return;
        } else {
            contactError.classList.add('hidden');
        }

        const formData = new FormData(rsvpForm);
        const action = event.target.action;

        fetch(action, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        })
        .then(response => {
            if (response.type === 'opaque') {
                // Google Forms returns an opaque response, so we assume it's successful
                rsvpMessage.textContent = 'RSVP sent successfully ✅';
                rsvpForm.reset();
                toggleFormVisibility.call(document.querySelector('input[name="user_attendance"]:checked'));
                togglePlusOneNames();
                toggleDietaryDetails();

                setTimeout(() => {
                    rsvpMessage.textContent = '';
                }, 5000);
            } else {
                throw new Error('Unexpected response type');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            rsvpMessage.textContent = 'RSVP not sent (service error) ❌';
        });

        // Improved data handling for Google Apps Script
        const scriptProp = PropertiesService.getScriptProperties();
        const sheetName = 'import-data'; // Replace with your actual sheet name

        const formValues = {};
        for (const pair of formData.entries()) {
            formValues[pair[0]] = pair[1];
        }

        const nextRow = SpreadsheetApp.openById(scriptProp.getProperty('key'))
            .getSheetByName(sheetName)
            .getLastRow() + 1;

        const newRow = [];
        for (const header of scriptProp.getProperty('headers').split(',')) { // Assuming headers are stored as a comma-separated string
            newRow.push(formValues[header] || '');
        }

        SpreadsheetApp.openById(scriptProp.getProperty('key'))
            .getSheetByName(sheetName)
            .appendRow(newRow);
    });

    // Initial setup
    toggleDietaryDetails();
    toggleFormVisibility.call(document.querySelector('input[name="user_attendance"]:checked'));
    togglePlusOneNames();
});