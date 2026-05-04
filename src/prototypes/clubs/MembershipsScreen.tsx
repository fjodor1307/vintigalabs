import { ClubsLayout } from './ClubsLayout'
import { EmptyState } from '@ds/shared/EmptyState'
import { UsersIcon } from '@ds/icons/Icons'

export function MembershipsScreen() {
  return (
    <ClubsLayout activeTab="memberships">
      <EmptyState
        bordered={false}
        icon={<UsersIcon />}
        title="Memberships"
        description="The full membership table lives here — search, filter and bulk-manage members across every club. Coming soon."
      />
    </ClubsLayout>
  )
}
