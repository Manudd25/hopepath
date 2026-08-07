import { useState } from 'react'

const FORM_NAME = 'hopepath-contact'

const emptyFields = { name: '', email: '', subject: '', message: '' }

function isLocalEnvironment() {
  const { hostname } = window.location
  return (
    import.meta.env.DEV ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.endsWith('.local')
  )
}

function validateFields(fields) {
  const errors = {}
  const name = fields.name.trim()
  const email = fields.email.trim()
  const subject = fields.subject.trim()
  const message = fields.message.trim()

  if (!name) {
    errors.name = 'Please enter your name.'
  }

  if (!email) {
    errors.email = 'Please enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!message) {
    errors.message = 'Please write your message.'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    trimmed: { name, email, subject, message },
  }
}

export default function ContactForm() {
  const [fields, setFields] = useState(emptyFields)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('default')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFields((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (status === 'error') {
      setStatus('default')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const { valid, errors: validationErrors, trimmed } = validateFields(fields)
    if (!valid) {
      setErrors(validationErrors)
      setStatus('default')
      return
    }

    if (isLocalEnvironment()) {
      setErrors({
        form:
          'The contact form only works on the deployed Netlify site. Use `npm run dev:netlify` or test at hopepath.net after deploying.',
      })
      setStatus('error')
      return
    }

    setStatus('submitting')
    setErrors({})

    const form = event.currentTarget
    const formData = new FormData(form)
    formData.set('form-name', FORM_NAME)
    formData.set('name', trimmed.name)
    formData.set('email', trimmed.email)
    formData.set('subject', trimmed.subject)
    formData.set('message', trimmed.message)
    formData.set('bot-field', formData.get('bot-field')?.toString() || '')

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      })

      if (!response.ok) {
        throw new Error(`Submission failed (${response.status})`)
      }

      setFields(emptyFields)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const fieldClass = (field) =>
    `contact-input${errors[field] ? ' contact-input--error' : ''}`

  const isSubmitting = status === 'submitting'

  return (
    <form
      name={FORM_NAME}
      method="POST"
      action="/"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      noValidate
      className="contact-form"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />

      <p className="contact-honeypot">
        <label>
          Do not fill this out:
          <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      {status === 'success' && (
        <p className="contact-status contact-status--success" aria-live="polite">
          Thank you for reaching out. Your message has been safely sent. 🌿
        </p>
      )}

      {status === 'error' && (
        <p className="contact-status contact-status--error" aria-live="polite">
          {errors.form ||
            'Something went wrong while sending your message. Please try again.'}
        </p>
      )}

      <div className="contact-field">
        <label htmlFor="contact-name" className="contact-label">
          Name <span className="contact-required">(required)</span>
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          value={fields.name}
          onChange={handleChange}
          required
          autoComplete="name"
          className={fieldClass('name')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
        />
        {errors.name && (
          <p id="contact-name-error" className="contact-error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="contact-field">
        <label htmlFor="contact-email" className="contact-label">
          Email <span className="contact-required">(required)</span>
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          value={fields.email}
          onChange={handleChange}
          required
          autoComplete="email"
          className={fieldClass('email')}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'contact-email-error' : undefined}
        />
        {errors.email && (
          <p id="contact-email-error" className="contact-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="contact-field">
        <label htmlFor="contact-subject" className="contact-label">
          Subject <span className="contact-optional">(optional)</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          name="subject"
          value={fields.subject}
          onChange={handleChange}
          autoComplete="off"
          className={fieldClass('subject')}
        />
      </div>

      <div className="contact-field">
        <label htmlFor="contact-message" className="contact-label">
          Message <span className="contact-required">(required)</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={fields.message}
          onChange={handleChange}
          required
          rows={5}
          className={`${fieldClass('message')} contact-textarea`}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="contact-error">
            {errors.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting} className="contact-submit">
        {isSubmitting ? 'Sending...' : 'Send message'}
      </button>

      <p className="contact-privacy">
        Your email address will only be used to reply to your message.
      </p>
    </form>
  )
}
