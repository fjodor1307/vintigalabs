import type { ComponentType } from 'react'
import type { PrototypeConfig } from '../_registry'
import { SalesChatScreen } from './SalesChatScreen'
import { CONVERSATIONS } from './chatSamples'

// Every conversation route resolves to the same screen — the screen reads the
// id from the hash and looks up the matching record.
const routes: Record<string, ComponentType> = {
  '#/web/sales-chat': SalesChatScreen,
}
for (const c of CONVERSATIONS) {
  routes[`#/web/sales-chat-imessage/${c.id}`] = SalesChatScreen
}

export const config: PrototypeConfig = {
  slug: 'sales-chat-imessage',
  frame: 'web',
  tags: ['messaging', 'whatsapp', 'inbox'],
  entries: [
    {
      name: 'Sales Chat',
      description:
        'WhatsApp Business–style agent inbox. Three-pane layout (conversation list, message thread, customer context) with composer behavior gated by the 24-hour customer service window — free-form inside, template-only after expiry.',
      path: '#/web/sales-chat',
      screens: 1,
    },
  ],
  routes,
}
