import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { Field } from '@ds/shared/Field'
import { TextField } from '@ds/shared/TextField'
import { Button } from '@ds/shared/Button'
import { customerActions, type CardBrand } from './customerStore'

// ─── AddCardModal ─────────────────────────────────────────────────────────────
// Add a payment method from the Billing tab. The card number is validated
// client-side (Luhn + length) before we let the form submit — a bad number is
// caught here with a clear, actionable message instead of the opaque
// "Payment Method ID is required" the processor returns downstream.
//
// Ticket: when the number can't be validated, tell the user plainly and point
// them at the fix — "Credit card number can't be validated. Check the number
// and re-enter."

const CARD_ERROR = 'Credit card number can’t be validated. Check the number and re-enter.'

function detectBrand(digits: string): CardBrand {
  if (/^4/.test(digits))               return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard'
  if (/^3[47]/.test(digits))           return 'amex'
  if (/^6/.test(digits))               return 'discover'
  return 'visa'
}

// Luhn checksum — the standard mod-10 check every issuer's numbers satisfy.
function passesLuhn(digits: string): boolean {
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

function isValidCardNumber(digits: string): boolean {
  return digits.length >= 13 && digits.length <= 19 && passesLuhn(digits)
}

// Group into 4s for readability while typing (amex 4-6-5 is close enough here).
function formatCardNumber(raw: string): string {
  return raw
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

export function AddCardModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      {open && <AddCardForm onClose={onClose} />}
    </Modal>
  )
}

function AddCardForm({ onClose }: { onClose: () => void }) {
  const [cardNumber, setCardNumber] = useState('')
  const [expires, setExpires]       = useState('')
  const [cvc, setCvc]               = useState('')
  const [name, setName]             = useState('')
  // Only surface the card-number error once the user has left the field or
  // tried to submit — no red text while they're still typing the first digits.
  const [showCardError, setShowCardError] = useState(false)

  const digits = cardNumber.replace(/\D/g, '')
  const cardNumberValid = isValidCardNumber(digits)
  const cardErrorVisible = showCardError && !cardNumberValid

  const otherFieldsValid =
    /^\d{2}\/\d{2}$/.test(expires.trim()) &&
    cvc.trim().length >= 3 &&
    name.trim().length > 0

  function handleSubmit() {
    if (!cardNumberValid) {
      setShowCardError(true)
      return
    }
    if (!otherFieldsValid) return

    const [mm, yy] = expires.trim().split('/')
    customerActions.addPaymentMethod({
      brand: detectBrand(digits),
      last4: digits.slice(-4),
      expiresMonth: mm,
      expiresYear: `20${yy}`,
      isDefault: false,
      source: 'vintiga',
    })
    onClose()
  }

  return (
    <>
      <ModalHeader
        title="Add card"
        description="Card details are tokenised by the payment processor on save — Vintiga never stores the full number."
        onClose={onClose}
      />
      <ModalBody>
        <div className="flex flex-col gap-vintiga-md">
          <Field label="Card number" required>
            <TextField
              value={cardNumber}
              onChange={(e) => {
                setCardNumber(formatCardNumber(e.target.value))
                if (showCardError) setShowCardError(false)
              }}
              placeholder="1234 5678 9012 3456"
              state={cardErrorVisible ? 'destructive' : undefined}
              helperText={cardErrorVisible ? CARD_ERROR : undefined}
            />
          </Field>

          <div className="grid grid-cols-2 gap-vintiga-md">
            <Field label="Expires" required>
              <TextField
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                placeholder="MM/YY"
              />
            </Field>
            <Field label="CVC" required>
              <TextField
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="•••"
              />
            </Field>
          </div>

          <Field label="Cardholder name" required>
            <TextField
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name on card"
            />
          </Field>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add card</Button>
      </ModalFooter>
    </>
  )
}
