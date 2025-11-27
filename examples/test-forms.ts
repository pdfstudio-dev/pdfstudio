import { PDFDocument } from '../src'
import type { Color } from '../src/types'

console.log('📝 Testing PDF Forms (AcroForms)...\n')

// ======================
// Example 1: Simple Text Fields
// ======================

const doc1 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  form: {
    fields: [
      {
        type: 'text',
        name: 'firstName',
        page: 0,
        x: 150,
        y: 680,
        width: 200,
        height: 25,
        fontSize: 12,
        tooltip: 'Enter your first name'
      },
      {
        type: 'text',
        name: 'lastName',
        page: 0,
        x: 150,
        y: 640,
        width: 200,
        height: 25,
        fontSize: 12,
        tooltip: 'Enter your last name'
      },
      {
        type: 'text',
        name: 'email',
        page: 0,
        x: 150,
        y: 600,
        width: 300,
        height: 25,
        fontSize: 12,
        defaultValue: 'pdfstudio@ideas2code.dev',
        tooltip: 'Enter your email address'
      },
      {
        type: 'text',
        name: 'comments',
        page: 0,
        x: 150,
        y: 480,
        width: 400,
        height: 100,
        multiline: true,
        fontSize: 11,
        tooltip: 'Enter your comments'
      }
    ]
  }
})

doc1.text('PDF UI Studio - Contact Form', 50, 750, 24)
doc1.text('First Name:', 50, 690, 12)
doc1.text('Last Name:', 50, 650, 12)
doc1.text('Email:', 50, 610, 12)
doc1.text('Comments:', 50, 570, 12)

doc1.save('examples-output/test-forms-1-text.pdf')
console.log('✅ Example 1: Text fields created')

// ======================
// Example 2: Checkboxes
// ======================

const doc2 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  form: {
    fields: [
      {
        type: 'checkbox',
        name: 'newsletter',
        page: 0,
        x: 50,
        y: 680,
        width: 15,
        height: 15,
        defaultValue: false,
        tooltip: 'Subscribe to newsletter'
      },
      {
        type: 'checkbox',
        name: 'terms',
        page: 0,
        x: 50,
        y: 650,
        width: 15,
        height: 15,
        defaultValue: false,
        required: true,
        tooltip: 'You must accept the terms'
      },
      {
        type: 'checkbox',
        name: 'updates',
        page: 0,
        x: 50,
        y: 620,
        width: 15,
        height: 15,
        defaultValue: true,
        tooltip: 'Receive product updates'
      }
    ]
  }
})

doc2.text('Checkbox Form', 50, 750, 24)
doc2.text('Subscribe to newsletter', 75, 685, 12)
doc2.text('I accept the terms and conditions (Required)', 75, 655, 12)
doc2.text('Receive product updates', 75, 625, 12)

doc2.save('examples-output/test-forms-2-checkboxes.pdf')
console.log('✅ Example 2: Checkboxes created')

// ======================
// Example 3: Dropdown/Select Fields
// ======================

const doc3 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  form: {
    fields: [
      {
        type: 'dropdown',
        name: 'country',
        page: 0,
        x: 150,
        y: 680,
        width: 200,
        height: 25,
        options: ['USA', 'Canada', 'Mexico', 'UK', 'Germany', 'France', 'Spain'],
        defaultValue: 'USA',
        fontSize: 12,
        tooltip: 'Select your country'
      },
      {
        type: 'dropdown',
        name: 'state',
        page: 0,
        x: 150,
        y: 640,
        width: 200,
        height: 25,
        options: ['California', 'Texas', 'Florida', 'New York', 'Illinois'],
        fontSize: 12,
        tooltip: 'Select your state'
      },
      {
        type: 'dropdown',
        name: 'customCountry',
        page: 0,
        x: 150,
        y: 600,
        width: 200,
        height: 25,
        options: ['USA', 'Canada', 'Other'],
        editable: true,
        fontSize: 12,
        tooltip: 'Select or enter your country'
      }
    ]
  }
})

doc3.text('Dropdown Form', 50, 750, 24)
doc3.text('Country:', 50, 690, 12)
doc3.text('State:', 50, 650, 12)
doc3.text('Country (Editable):', 50, 610, 12)

doc3.save('examples-output/test-forms-3-dropdowns.pdf')
console.log('✅ Example 3: Dropdowns created')

// ======================
// Example 4: Styled Fields
// ======================

const doc4 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  form: {
    fields: [
      {
        type: 'text',
        name: 'username',
        page: 0,
        x: 150,
        y: 680,
        width: 250,
        height: 30,
        fontSize: 14,
        backgroundColor: [0.95, 0.95, 1] as Color,
        borderColor: [0, 0, 0.8] as Color,
        borderWidth: 2,
        fontColor: [0, 0, 0.5] as Color,
        tooltip: 'Enter username'
      },
      {
        type: 'text',
        name: 'password',
        page: 0,
        x: 150,
        y: 630,
        width: 250,
        height: 30,
        password: true,
        fontSize: 14,
        backgroundColor: [1, 0.95, 0.95] as Color,
        borderColor: [0.8, 0, 0] as Color,
        borderWidth: 2,
        tooltip: 'Enter password'
      },
      {
        type: 'text',
        name: 'code',
        page: 0,
        x: 150,
        y: 580,
        width: 100,
        height: 30,
        maxLength: 6,
        align: 'center',
        fontSize: 16,
        font: 'Courier-Bold',
        backgroundColor: [1, 1, 0.9] as Color,
        borderColor: [0.5, 0.5, 0] as Color,
        borderWidth: 1,
        tooltip: 'Enter 6-digit code'
      }
    ]
  }
})

doc4.text('Styled Form Fields', 50, 750, 24)
doc4.text('Username:', 50, 693, 12)
doc4.text('Password:', 50, 643, 12)
doc4.text('Code (6 digits):', 50, 593, 12)

doc4.save('examples-output/test-forms-4-styled.pdf')
console.log('✅ Example 4: Styled fields created')

// ======================
// Example 5: Button Fields
// ======================

const doc5 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  form: {
    submitUrl: 'https://pdfuistudio.io/api/submit',
    fields: [
      {
        type: 'text',
        name: 'name',
        page: 0,
        x: 150,
        y: 680,
        width: 250,
        height: 25,
        fontSize: 12
      },
      {
        type: 'text',
        name: 'email',
        page: 0,
        x: 150,
        y: 640,
        width: 250,
        height: 25,
        fontSize: 12
      },
      {
        type: 'button',
        name: 'submitBtn',
        label: 'Submit Form',
        page: 0,
        x: 150,
        y: 580,
        width: 120,
        height: 35,
        action: 'submit',
        submitUrl: 'https://pdfuistudio.io/api/submit',
        backgroundColor: [0.2, 0.6, 0.2] as Color,
        labelColor: [1, 1, 1] as Color,
        borderColor: [0, 0.4, 0] as Color,
        borderWidth: 2,
        fontSize: 14,
        font: 'Helvetica-Bold'
      },
      {
        type: 'button',
        name: 'resetBtn',
        label: 'Reset',
        page: 0,
        x: 280,
        y: 580,
        width: 100,
        height: 35,
        action: 'reset',
        backgroundColor: [0.8, 0.8, 0.8] as Color,
        labelColor: [0.2, 0.2, 0.2] as Color,
        borderColor: [0.5, 0.5, 0.5] as Color,
        borderWidth: 1,
        fontSize: 14
      }
    ]
  }
})

doc5.text('Form with Buttons', 50, 750, 24)
doc5.text('Name:', 50, 690, 12)
doc5.text('Email:', 50, 650, 12)

doc5.save('examples-output/test-forms-5-buttons.pdf')
console.log('✅ Example 5: Buttons created')

// ======================
// Example 6: Complete Registration Form
// ======================

const doc6 = new PDFDocument({
  size: 'Letter',
  margins: 50,
  form: {
    submitUrl: 'https://pdfuistudio.io/signup',
    fields: [
      // Personal Information
      {
        type: 'text',
        name: 'fullName',
        page: 0,
        x: 200,
        y: 680,
        width: 300,
        height: 25,
        fontSize: 12,
        required: true,
        tooltip: 'Full name (required)'
      },
      {
        type: 'text',
        name: 'email',
        page: 0,
        x: 200,
        y: 640,
        width: 300,
        height: 25,
        fontSize: 12,
        required: true,
        tooltip: 'Email address (required)'
      },
      {
        type: 'text',
        name: 'phone',
        page: 0,
        x: 200,
        y: 600,
        width: 200,
        height: 25,
        fontSize: 12,
        tooltip: 'Phone number (optional)'
      },

      // Address
      {
        type: 'text',
        name: 'address',
        page: 0,
        x: 200,
        y: 540,
        width: 350,
        height: 25,
        fontSize: 11
      },
      {
        type: 'text',
        name: 'city',
        page: 0,
        x: 200,
        y: 500,
        width: 150,
        height: 25,
        fontSize: 11
      },
      {
        type: 'dropdown',
        name: 'state',
        page: 0,
        x: 370,
        y: 500,
        width: 100,
        height: 25,
        options: ['CA', 'TX', 'FL', 'NY', 'IL', 'PA', 'OH'],
        fontSize: 11
      },
      {
        type: 'text',
        name: 'zip',
        page: 0,
        x: 490,
        y: 500,
        width: 80,
        height: 25,
        fontSize: 11,
        maxLength: 10
      },

      // Preferences
      {
        type: 'checkbox',
        name: 'newsletter',
        page: 0,
        x: 50,
        y: 430,
        width: 15,
        height: 15
      },
      {
        type: 'checkbox',
        name: 'sms',
        page: 0,
        x: 50,
        y: 405,
        width: 15,
        height: 15
      },

      // Comments
      {
        type: 'text',
        name: 'comments',
        page: 0,
        x: 50,
        y: 280,
        width: 500,
        height: 100,
        multiline: true,
        fontSize: 11,
        backgroundColor: [0.98, 0.98, 0.98] as Color
      },

      // Terms
      {
        type: 'checkbox',
        name: 'terms',
        page: 0,
        x: 50,
        y: 240,
        width: 15,
        height: 15,
        required: true
      },

      // Submit
      {
        type: 'button',
        name: 'submit',
        label: 'Register',
        page: 0,
        x: 200,
        y: 180,
        width: 150,
        height: 40,
        action: 'submit',
        submitUrl: 'https://pdfuistudio.io/signup',
        backgroundColor: [0.1, 0.4, 0.8] as Color,
        labelColor: [1, 1, 1] as Color,
        borderWidth: 0,
        fontSize: 16,
        font: 'Helvetica-Bold'
      }
    ]
  }
})

doc6.text('Registration Form', 50, 750, 24)

// Personal Information
doc6.text('Personal Information', 50, 720, 16)
doc6.text('Full Name *:', 50, 690, 12)
doc6.text('Email *:', 50, 650, 12)
doc6.text('Phone:', 50, 610, 12)

// Address
doc6.text('Address', 50, 570, 16)
doc6.text('Street Address:', 50, 550, 12)
doc6.text('City:', 50, 510, 12)
doc6.text('State:', 360, 510, 11)
doc6.text('ZIP:', 480, 510, 11)

// Preferences
doc6.text('Preferences', 50, 460, 16)
doc6.text('Email newsletter', 75, 435, 12)
doc6.text('SMS notifications', 75, 410, 12)

// Comments
doc6.text('Additional Comments', 50, 390, 16)

// Terms
doc6.text('I accept the terms and conditions *', 75, 245, 12)

doc6.text('* Required fields', 50, 140, 10)

doc6.save('examples-output/test-forms-6-registration.pdf')
console.log('✅ Example 6: Complete registration form created')

// ======================
// Example 7: Dynamic Form Addition
// ======================

const doc7 = new PDFDocument({
  size: 'Letter',
  margins: 50
})

doc7.text('Dynamically Added Form', 50, 750, 24)
doc7.text('This form was created by adding fields dynamically:', 50, 720, 12)

// Add content first
doc7.text('Username:', 50, 680, 12)
doc7.text('Password:', 50, 640, 12)
doc7.text('Remember me', 75, 605, 12)

// Now add form fields dynamically
doc7.addFormField({
  type: 'text',
  name: 'username',
  page: 0,
  x: 150,
  y: 670,
  width: 200,
  height: 25,
  fontSize: 12
})

doc7.addFormField({
  type: 'text',
  name: 'password',
  page: 0,
  x: 150,
  y: 630,
  width: 200,
  height: 25,
  password: true,
  fontSize: 12
})

doc7.addFormField({
  type: 'checkbox',
  name: 'remember',
  page: 0,
  x: 50,
  y: 600,
  width: 15,
  height: 15,
  defaultValue: false
})

doc7.addFormField({
  type: 'button',
  name: 'login',
  label: 'Login',
  page: 0,
  x: 150,
  y: 550,
  width: 100,
  height: 35,
  action: 'submit',
  submitUrl: 'https://example.com/login',
  backgroundColor: [0.2, 0.5, 0.8] as Color,
  labelColor: [1, 1, 1] as Color,
  fontSize: 14,
  font: 'Helvetica-Bold'
})

doc7.save('examples-output/test-forms-7-dynamic.pdf')
console.log('✅ Example 7: Dynamic form created')

console.log('\n📝 All form examples created successfully!')
console.log('   7 PDFs demonstrating:')
console.log('   1. Simple text fields')
console.log('   2. Checkboxes')
console.log('   3. Dropdown/select fields')
console.log('   4. Styled fields (colors, borders, fonts)')
console.log('   5. Button fields (submit, reset)')
console.log('   6. Complete registration form')
console.log('   7. Dynamically added fields\n')
