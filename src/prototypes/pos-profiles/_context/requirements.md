# Raw ticket — Manage POS Profiles in Stand-Alone Store

> Pasted verbatim from the Vintiga ticket on 2026-07-02. Source of truth for CONTEXT.md.

Each Stand-alone store is instantiated with 1 POS profile that has no collections. This ticket is to allow for the adding and editing of POS profiles in a stand-alone store.

## List POS Profiles
- Display list of all POS profiles configured in the store.
- "Get Profiles" button is only displayed for C7-connected stores.
- "Add Profile" button is displayed on Stand-alone stores.

## Synchronization with Connected vs Stand Alone stores
- If a Commerce7 Connected store is disconnected from Commerce7, the POS profiles that were ingested from Commerce7 remain configured in the store.
- If Commerce7 is connected to a Vintiga store that already has POS profiles:
  - If POS profiles have the same reference ID, overwrite the value in Vintiga with the value in Commerce7.
  - If POS profile in Vintiga does not have a referenceID in Commerce7, create the Vintiga POS Profile in Commerce7, and reference the Commerce7 Profile ID.

## Adding POS Profiles
- Only Vintiga Stand-Alone stores can have new POS profiles added.

## Editing POS Profiles
- In C7-connected stores, the user can still edit the images on/off and collection colors, but all other values are read-only.
- In Vintiga Stand-Alone store, all fields in the POS Profile can be edited.

## POS Profile Configuration fields that can be edited

### General
- Profile Name/Title
- Profile Color: hex value
- Is Default Profile: (yes | no)
- Default Sales Attribute Value: default value is "POS"

### Tips
- Tips: (on | off)
- Tip Type: (percentage | amounts)
- List of Tip Options: Option1, Option 2, Option 3, Option 4
- Display on EMV: (yes | no)

### Finalizing Orders and Employee PINS
- Employee Pin: (on | off)
- Require PIN before payment: (on | off)
- Require PIN after order: (on | off)
- Prompt "Additional Order Info" window before payment: (on | off)
- Kitchen Tickets: (on | off)
- Prompt of "Send Items to Kitchen" before payment: (on | off)
- List of Printers. For each printer: Printer Title, Printer ID, Printer Type, Allow Deletion of Printer

### Chip & PINS Devices
- List of Devices. For each Device: title, terminal ID, Type (list of supported types), Allow Deletion of Device

### Collections
- List of Collections. For each Collection: Collection Color (hex), Show Images (on/off), Sort Order, Allow Deletion of Collection

### Inventory
> We do not yet have inventory designed; this is the structure used in Commerce7. Vintiga should use physical location, mapped to Inventory locations.
- Carry Out Inventory Location
- Shipping Inventory Location
- Pickup Inventory Location

## Figma
- List: node 1626-5128
- Detail: node 1637-7618
- Details modal: 5438-27366 / 1690-15866
- Collections modal: 5438-27260 / 1697-17594
- File: 3DnxyYDZqDGQqvknlD4aTu ("05. Dashboard")
