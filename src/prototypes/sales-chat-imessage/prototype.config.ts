import type { ComponentType } from 'react'
import type { PrototypeConfig } from '../_registry'
import { SalesChatScreen } from './SalesChatScreen'
import { CONVERSATIONS } from './chatSamples'

// Every conversation route resolves to the same screen — the screen reads the
// id from the hash and looks up the matching record.
const routes: Record<string, ComponentType> = {
  '#/web/sales-chat-imessage': SalesChatScreen,
}
for (const c of CONVERSATIONS) {
  routes[`#/web/sales-chat-imessage/${c.id}`] = SalesChatScreen
}

export const config: PrototypeConfig = {
  slug: 'sales-chat-imessage',
  frame: 'web',
  tags: ['messaging', 'imessage', 'sms', 'sendblue', 'inbox'],
  entries: [
    {
      name: 'Sales Chat — iMessage',
      description:
        "iMessage-first sales chat modelled on Sendblue's API. Blue iMessage bubbles, green-bubble SMS fallback for Android contacts, Apple tapback reactions, voice memos, link previews, contact-card sharing, typing indicators, read receipts, per-conversation AI agent toggle, and a quick-replies snippet library.",
      path: '#/web/sales-chat-imessage',
      screens: 1,
    },
  ],
  routes,
}
