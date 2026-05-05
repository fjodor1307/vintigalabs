import { Modal, ModalHeader, ModalBody, ModalFooter } from '@ds/shared/Modal'
import { SelectionCard } from '@ds/shared/SelectionCard'
import { Button } from '@ds/shared/Button'
import { GemIcon, CreditCardIcon, IdCardIcon } from '@ds/icons/Icons'
import { clubActions, type ClubKind } from './clubStore'

// ─── AddClubModal ─────────────────────────────────────────────────────────────
// Modal launched from the Clubs page "+ Add Club" button. Lets the operator
// pick which kind of club to create — drives the (not-yet-built) club editor.
// Built from Figma 5078:8564.

const CLUB_TYPES: {
  kind: ClubKind
  title: string
  description: string
  icon: React.ReactNode
}[] = [
  {
    kind: 'curated',
    title: 'Curated Club',
    description: 'Club Admin orders for members, charging their cards on a set day. Orders are picked up or shipped.',
    icon: <GemIcon />,
  },
  {
    kind: 'account-credit',
    title: 'Tasting Credit',
    description: 'Members pick a monthly amount to add to their account, which they can spend on any purchase.',
    icon: <CreditCardIcon />,
  },
  {
    kind: 'membership',
    title: 'Membership Club',
    description: 'Members pay a set amount, and receive discounts for future purchases for a defined time period.',
    icon: <IdCardIcon />,
  },
]

export function AddClubModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader title="Add New Club" onClose={onClose} />
      <ModalBody>
        {CLUB_TYPES.map((t) => (
          <SelectionCard
            key={t.kind}
            icon={t.icon}
            title={t.title}
            description={t.description}
            tone="indigo"
            onClick={() => {
              clubActions.startNew(t.kind)
              onClose()
              // Land on Overview with the type captured in the URL — survives
              // reload and works as a deep link for sharing.
              window.location.hash = `#/web/clubs/new/overview?type=${t.kind}`
            }}
          />
        ))}
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}
