import { ClubsLayout } from './ClubsLayout'
import { EmptyState } from '@ds/shared/EmptyState'
import { MailIcon } from '@ds/icons/Icons'

export function ClubEmailsScreen() {
  return (
    <ClubsLayout activeTab="emails">
      <EmptyState
        bordered={false}
        icon={<MailIcon />}
        title="Club Emails"
        description="Schedule and review the transactional emails sent to club members — welcome sequences, allocation notices, payment failures. Coming soon."
      />
    </ClubsLayout>
  )
}
