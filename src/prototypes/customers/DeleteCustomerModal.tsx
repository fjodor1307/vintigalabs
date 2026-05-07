import { Modal, ModalAlertHeader, ModalFooter } from '@ds/shared/Modal'
import { Button } from '@ds/shared/Button'
import { AlertTriangleIcon } from '@ds/icons/Icons'

// ─── DeleteCustomerModal ──────────────────────────────────────────────────────
// Confirmation dialog mirrors Figma `2052:44975`. Triggered by the "Delete"
// item in the header card's kebab menu. Prototype-only — clicking Proceed
// fires the supplied handler (currently a no-op) and closes the modal; no
// destructive action is wired against the in-memory customer.

export function DeleteCustomerModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm?: () => void
}) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalAlertHeader
        icon={<AlertTriangleIcon />}
        iconColor="orange"
        title="Delete"
        description="Are you sure you want to delete this customer? This action cannot be undone."
      />
      <ModalFooter shaded>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onConfirm?.()
            onClose()
          }}
        >
          Proceed
        </Button>
      </ModalFooter>
    </Modal>
  )
}
