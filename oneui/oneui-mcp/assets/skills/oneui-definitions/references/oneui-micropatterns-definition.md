---
name: oneui-micropatterns-definition
description: >-
  Definitions of every OneUI Micropattern — the higher-order layout and interaction patterns that
  compose OneUI Components into screen-level structures (navigation, selection, chat, content,
  spatial layout). Use whenever choosing, placing, swapping or reviewing a OneUI Micropattern in
  Figma, or when unsure which of two similar patterns (HeaderNative vs HeaderWeb, BottomNav vs
  TabGroup, Select vs ContextMenu, which ChatInput variant, Carousel vs aspect ratio presets, Slot vs
  Spacer) is correct.
---

# OneUI Micropatterns — definitions

Use this skill to answer **"which micropattern is this, and is it the right one?"**

Micropatterns are **higher-order layout and interaction patterns** that compose OneUI Components
into common UI structures. They operate at the *screen* level — a Header is not a Button, it is the
arrangement that holds buttons, logos and tabs. This file covers what each micropattern *means*,
the intent it serves, the props that change that intent, and the siblings that are easy to confuse
with it.

For the individual components a micropattern is built from (Button, Icon, Divider, ListItem
content, Image, BottomSheet…), load the **OneUI Components** skill. For variable modes or token
binding, load the OneUI foundations skills.

## How to use this skill

1. **Start from screen structure, not from appearance.** "The user needs to move between top-level
  destinations" → navigation family. "The user needs to pick from a dropdown" → Select. Jump via
   [Intent → micropattern](#intent--micropattern).
2. **Check the disambiguation rules** before placing anything from a confusable family
  (navigation, menus, chat inputs, media containers). Those rules override a micropattern's own
   description.
3. **Read the micropattern entry** for its variants, toggles, internal structure and *Related*
  block. Siblings exist because they encode a different context — native vs web, top-level vs
   in-page — and picking the wrong one renders fine and is still wrong.
4. **Respect the internal structure.** Many micropatterns expose a **Slot** that you fill with your
  own children (TabGroup takes TabItems, ContextMenu takes ListItems). Do not hand-arrange
   children beside the pattern — put them in the slot.
5. **Never invent variants or toggles.** If a behaviour is not listed here, it does not exist on
  that micropattern — say so rather than substituting something similar.

---

## Shared behaviour

### Slots

Several micropatterns are **slot-based**: the pattern supplies the layout, spacing and chrome, and
you supply the content. Where an entry says *Internal: Slot*, add the named child components into
that slot rather than placing them next to the instance.


| Micropattern                  | What goes in the slot        |
| ----------------------------- | ---------------------------- |
| [TabGroup](#5-tabgroup)       | Your own tab items           |
| [ContextMenu](#7-contextmenu) | [ListItem](#8-listitem) rows |


### Dividers

Navigation micropatterns expose dividers as **toggles**, not as separate Divider components. Turn
the pattern's own toggle on — do not place a Divider under a Header.


| Micropattern                    | Divider toggles                            |
| ------------------------------- | ------------------------------------------ |
| [HeaderNative](#1-headernative) | `divider`                                  |
| [HeaderWeb](#2-headerweb)       | `dividerPrimaryNav`, `dividerSecondaryNav` |
| [BottomNav](#4-bottomnav)       | Divider included internally                |


---

## Intent → micropattern


| The user needs to…                                          | Micropattern                                                 |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| See a standard app header on a **native/mobile** screen     | [HeaderNative](#1-headernative)                              |
| See a standard site header on a **web/desktop** layout      | [HeaderWeb](#2-headerweb)                                    |
| Tap a single nav link or tab inside a header                | [Header.Item](#3-headeritem)                                 |
| Switch between 2–5 top-level app destinations, persistently | [BottomNav](#4-bottomnav)                                    |
| Switch between content sections **within** a view           | [TabGroup](#5-tabgroup)                                      |
| Pick one value from a dropdown in a form                    | [Select](#6-select)                                          |
| See a floating menu of actions or options                   | [ContextMenu](#7-contextmenu)                                |
| Read one row inside a menu or list                          | [ListItem](#8-listitem)                                      |
| Group related rows inside a menu                            | [ListItem](#8-listitem) — `sectionDivider`                   |
| Type a chat message                                         | [ChatInput](#9-chatinput-family) family                      |
| Read a sent or received chat message                        | [UserChatBubble](#10-userchatbubble)                         |
| Swipe horizontally through cards or media                   | [Carousel](#11-carousel)                                     |
| See media in a consistently proportioned frame              | An [aspect ratio preset](#11-carousel) / Image `aspectRatio` |
| Add a controlled gap between elements                       | [Spacer](#12-spacer)                                         |


---

## Disambiguation rules

These override the individual micropattern descriptions. Check the relevant one **before** placing.

### Navigation — which level of the hierarchy?


| Situation                                                                          | Micropattern     | Where it renders |
| ---------------------------------------------------------------------------------- | ---------------- | ---------------- |
| Top of a **native/mobile** screen — logo, action icons, optional tabs              | **HeaderNative** | Top edge         |
| Top of a **web/desktop** layout — wider viewport, both nav rows visible by default | **HeaderWeb**    | Top edge         |
| Persistent access to 2–5 **top-level** destinations on mobile                      | **BottomNav**    | Bottom edge      |
| Switching **content sections inside** the current view                             | **TabGroup**     | In-page          |
| A single item **inside** a header's nav row                                        | **Header.Item**  | Nested only      |


**TabGroup is not top-level navigation.** If the tabs move the user between the app's main
sections, that is BottomNav (mobile) or a Header's nav row — not TabGroup. TabGroup switches
content *within* a screen.

**Header.Item is never placed directly on the canvas.** It is a child of HeaderNative or HeaderWeb.

### Menus — trigger vs surface


| Situation                                                                   | Micropattern    |
| --------------------------------------------------------------------------- | --------------- |
| A form control the user picks a value from — trigger **plus** attached menu | **Select**      |
| The floating menu surface itself, opened by any interaction                 | **ContextMenu** |
| A single row **inside** either of those                                     | **ListItem**    |


Select *contains* a ContextMenu. Place Select when you need the whole form control; place
ContextMenu on its own when the menu is triggered by something that is not a Select.

**When the menu should be a sheet instead:** switch Select's `contextMenu` toggle **off** and
trigger a BottomSheet. That is the supported way to swap the dropdown for a sheet on mobile.

### Select triggers — how much room do you have?


| Trigger                | Use for                                            |
| ---------------------- | -------------------------------------------------- |
| `selectableInput`      | Full-width field style — the default for forms     |
| `selectableButton`     | Compact button style — toolbars and inline actions |
| `selectableIconButton` | Icon only — space-constrained areas                |


### ChatInput — match the variant to the input context

All ChatInput variants share the same `.ChatInput` internal structure. Pick by what is currently
happening in the conversation, not by appearance.


| What is happening                                    | Variant                     |
| ---------------------------------------------------- | --------------------------- |
| Nothing special — resting state                      | **ChatInput_Default**       |
| The user tapped "Reply" on a message                 | **ChatInput_Reply**         |
| An AI/LLM supplied context the user is responding to | **ChatInput_Context**       |
| The user attached files or images                    | **ChatInput_Attachment**    |
| The user pasted a URL and a preview generated        | **ChatInput_LinkPreview**   |
| The user is recording or playing back voice          | **ChatInput_Recording**     |
| Voice is being transcribed to text                   | **ChatInput_Transcription** |
| None of the above fit                                | **ChatInput_Custom**        |


Do not build a context banner by stacking elements above ChatInput_Default — the banner variants
(Reply, Context, Attachment, LinkPreview) already contain it.

### Media containers — ratio, scroll, or content


| Situation                                              | Micropattern                                            |
| ------------------------------------------------------ | ------------------------------------------------------- |
| A horizontally swipeable row of cards or media         | **Carousel**                                            |
| A single media frame that must hold a fixed proportion | An **aspect ratio preset**, or Image with `aspectRatio` |
| A carousel whose items all share one proportion        | **Carousel** with `followsAspectRatio` = `true`         |


Aspect ratio presets each wrap an Image instance — reach for the ratio you need rather than
resizing a generic container by hand. See [Carousel](#11-carousel) for the full ratio table.

### Structural helpers — Slot vs Spacer


| Situation                                                                     | Micropattern |
| ----------------------------------------------------------------------------- | ------------ |
| Marking **where child content goes** inside another micropattern              | **Slot**     |
| Adding a **gap** between elements when auto-layout gap alone isn't sufficient | **Spacer**   |


Slot is never placed directly — it is a building block of composable patterns. Spacer is placed,
but only where auto-layout cannot express the gap.

---

# Micropattern definitions

## Navigation

### 1. HeaderNative

The primary top-of-screen navigation bar for **native (mobile)** app contexts. Contains a primary
nav row with optional secondary nav tabs below. Use when building native mobile screens that need a
standard app header with brand logo, action icons and optional tabbed sub-navigation.


| Prop           | Values          | Meaning                              |
| -------------- | --------------- | ------------------------------------ |
| `secondaryNav` | `true`, `false` | Toggles the secondary navigation row |
| `divider`      | boolean         | Show/hide the bottom divider line    |


**Internal:** PrimaryNav instance + optional SecondaryNav + Divider.

**Related:**

- **HeaderWeb** — the desktop counterpart. Use it for wider viewports.
- **Header.Item** — the individual nav items that go inside the nav rows.
- **BottomNav** — bottom navigation, for top-level destinations.

---

### 2. HeaderWeb

The primary top-of-screen navigation bar for **web/desktop** contexts. Similar to HeaderNative but
designed for wider viewports, with both primary and secondary navigation rows visible by default.
Use for desktop web layouts that need a standard site header with logo, nav items and secondary
tabs.

Single component — **no variants**.


| Prop                  | Meaning                             |
| --------------------- | ----------------------------------- |
| `secondaryNav`        | Show/hide the secondary nav row     |
| `dividerPrimaryNav`   | Divider under the primary nav row   |
| `dividerSecondaryNav` | Divider under the secondary nav row |


**Internal:** PrimaryNav + SecondaryNav instances with independent dividers.

**Related:**

- **HeaderNative** — the mobile counterpart.
- **Header.Item** — the individual nav items.

---

### 3. Header.Item

An individual navigation item used **inside** HeaderNative or HeaderWeb. Represents a single tab or
nav link.

Single component — **no variants**.

**Not typically placed directly on the canvas** — nest it within a Header component's nav row.

**Related:** HeaderNative, HeaderWeb.

---

### 4. BottomNav

A bottom navigation bar for mobile apps, providing persistent access to top-level destinations. Use
when the app has **2–5 primary sections** and the user needs constant access to switch between
them.


| Prop    | Values                   | Meaning                    |
| ------- | ------------------------ | -------------------------- |
| `items` | `2`, `3`, `4`, `5`       | Number of navigation items |
| `label` | `1Line`, `2Line`, `none` | Text label display mode    |


**Internal:** BottomNav.Item instances + Divider.

**Related:**

- **HeaderNative** — top-of-screen navigation for the same mobile context.
- **TabGroup** — use instead when switching content *within* a view rather than between top-level
destinations.

---

### 5. TabGroup

A horizontal or vertical set of tab items for switching between content sections **within a view**.
Use for in-page content switching.


| Prop          | Values                   | Meaning          |
| ------------- | ------------------------ | ---------------- |
| `orientation` | `horizontal`, `vertical` | Layout direction |
| `size`        | `S`, `M`, `L`            | Tab sizing       |


**Internal:** Slot for TabItems — add your own tab items into the slot.

**Not for top-level app navigation** — use [BottomNav](#4-bottomnav) or a Header for that.

**Related:** BottomNav, HeaderNative, HeaderWeb.

---

## Selection & Menus

### 6. Select

A form control that lets users pick a value from a dropdown menu. Combines a trigger element with
an attached [ContextMenu](#7-contextmenu). Use in forms or settings where the user must choose one
option from a predefined list.


| Prop            | Values                                    | Meaning                                                    |
| --------------- | ----------------------------------------- | ---------------------------------------------------------- |
| `trigger`       | `selectableInput`                         | Full-width input field style — best for forms              |
|                 | `selectableButton`                        | Compact button style — best for toolbars or inline actions |
|                 | `selectableIconButton`                    | Icon-only trigger — best for space-constrained areas       |
| `state`         | `idle`, `active`, `feedback`              | Interaction / validation state                             |
| `menuDirection` | `below`, `above`, `alignWithTrigger`, `-` | Where the menu opens relative to the trigger               |
| `size`          | `S`, `M`, `L`                             | Control sizing                                             |


**Toggles:** `label`, `feedback`, `helperText`, `contextMenu`, `required`, `description`,
`infoIcon`.

**Text:** `labelText`.

**Notes:** switch `contextMenu` **off** when you prefer the Select to trigger a **BottomSheet**
instead of the attached dropdown.

**Related:**

- **ContextMenu** — the dropdown portion of Select; place it standalone when the trigger is not a
Select.
- **ListItem** — the rows that populate the menu.

---

### 7. ContextMenu

A floating menu that appears on interaction (tap, click, or as part of a Select). Contains a
searchable list of ListItem rows. Use for dropdown menus, action menus and selection panels.


| Prop         | Values              | Meaning                               |
| ------------ | ------------------- | ------------------------------------- |
| `size`       | `XS`, `S`, `M`, `L` | Menu sizing                           |
| `showSearch` | boolean             | Show/hide the search field at the top |


**Internal:** Search frame + Slot (accepts ListItem children). Add ListItem components into the slot
to populate the menu.

**Related:**

- **Select** — often uses ContextMenu as its dropdown.
- **ListItem** — the menu content.

---

### 8. ListItem

A single row item used inside ContextMenu, Select dropdowns, or standalone lists. Can represent a
selectable option or a section label that groups related items.


| Prop       | Values           | Meaning                                                     |
| ---------- | ---------------- | ----------------------------------------------------------- |
| `listSlot` | `listItem`       | A standard row with icon, title, secondary text and chevron |
|            | `sectionDivider` | A lightweight section label to group list items             |


**Related:** ContextMenu, Select.

---

## Chat

### 9. ChatInput (family)

A family of chat input components representing different input states and content contexts in a
messaging interface. All variants share a common `.ChatInput` internal structure. **Use the specific
variant that matches the current input context** — see
[ChatInput disambiguation](#chatinput--match-the-variant-to-the-input-context).

#### ChatInput_Default

The standard resting state of the chat input. Shows a text field with attachment (**+**) button,
microphone and send action. Use as the base chat input when no special context is active.

#### ChatInput_Reply

Chat input with a reply context banner showing the original message being replied to, with a
dismiss (**×**) button. Use when the user taps "Reply" on a message.

#### ChatInput_Context

Chat input with an AI/LLM context banner showing system-provided text the user will respond to. Use
in AI-assisted conversations where the input needs to show contextual guidance.

#### ChatInput_Attachment

Chat input with attached files or images displayed above the text field. Use when the user has
attached content before sending.


| Prop          | Values                   |
| ------------- | ------------------------ |
| `contentType` | `files`, `images`, `mix` |


#### ChatInput_LinkPreview

Chat input with a link preview card shown above the text field. Use when the user pastes a URL and
the system generates a preview.


| Prop    | Values               |
| ------- | -------------------- |
| `state` | `default`, `loading` |


#### ChatInput_Recording

Chat input in voice recording mode, replacing the text field with audio recording controls.


| Prop    | Values                                                       |
| ------- | ------------------------------------------------------------ |
| `state` | `recordingInProgress`, `playbackInProgress`, `playbackReady` |


#### ChatInput_Transcription

Chat input showing a voice-to-text transcription waveform with accept/dismiss actions.


| Prop    | Values                  |
| ------- | ----------------------- |
| `state` | `inProgress`, `loading` |


#### ChatInput_Custom

A bare chat input shell with minimal UI — just the text field and a send-like action. Use when you
need a custom chat input context that doesn't fit the predefined variants.

**Related:** UserChatBubble.

---

### 10. UserChatBubble

A chat message bubble for user-sent messages. Displays message text with a timestamp.


| Prop   | Values     | Meaning                                                 |
| ------ | ---------- | ------------------------------------------------------- |
| `type` | `inbound`  | Received message — left-aligned, neutral background     |
|        | `outbound` | Sent message — right-aligned, brand-coloured background |


**Related:** ChatInput.

---

## Content & Layout

### 11. Carousel

A horizontally scrollable content carousel for cards or media. Use when displaying a swipeable row
of content items like product cards, stories or promotions.


| Prop                 | Values          | Meaning                                       |
| -------------------- | --------------- | --------------------------------------------- |
| `followsAspectRatio` | `true`, `false` | Whether items conform to a fixed aspect ratio |


**Aspect ratio presets.** The Micropatterns library also ships pre-configured image frames that
enforce a fixed ratio — each one simply wraps an **Image** instance. They are presets, not
micropatterns: in code the same thing is the Image component's own `aspectRatio` prop (combined
with `orientation`, so `16:9` + `orientation: portrait` renders 9:16). Use a preset frame when you
want consistently sized media without setting props by hand.


| Preset | Ratio | Typical use                                      |
| ------ | ----- | ------------------------------------------------ |
| `16:9` | 16:9  | Video thumbnails, hero banners, widescreen media |
| `21:9` | 21:9  | Ultra-wide cinematic banners                     |
| `5:3`  | 5:3   | Landscape photos, content cards                  |
| `4:3`  | 4:3   | Classic photo format, document previews          |
| `3:4`  | 3:4   | Portrait cards, book covers                      |
| `2:1`  | 2:1   | Wide banners, header images                      |
| `1:1`  | 1:1   | Square thumbnails, avatars, profile images       |
| `1:2`  | 1:2   | Tall portrait cards, story format                |
| `9:16` | 9:16  | Vertical video, mobile story format              |
| `auto` | Free  | Adapts to content — no fixed ratio enforced      |


**Related:** Image *(component)*.