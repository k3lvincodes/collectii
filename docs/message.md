# Messages Page Documentation

## Overview
The Messages page (`src/app/(app)/messages/page.tsx`) provides a full-featured chat interface designed to facilitate communication between users and teams. It is built as a responsive, three-pane layout consisting of a contact list, a main chat area, and an information sidebar.

## Layout Structure
The page uses a flexbox layout that dynamically sizes itself to fit the viewport height minus the navigation bar (`calc(100vh - headerHeight)`).

### 1. Left Sidebar: Contacts & Threads
*   **Width**: Fixed `w-80`.
*   **Content**:
    *   **Header**: Title and "New Message" button.
    *   **Search**: Input field to filter conversations.
    *   **Filters**: "All", "Groups", "Private" tabs.
    *   **Thread List**: Scrollable list of active conversations (`MOCK_THREADS`).
        *   Displays participant avatar, status indicator, name, last message preview, timestamp, and unread counts.
        *   Supports "Typing..." indicators.

### 2. Middle Pane: Chat Area
*   **Width**: Flexible (`flex-1`).
*   **Content**:
    *   **Header**: Active participant details (Avatar, Name, Status) and action buttons (Phone, Video, More).
    *   **Message List**: Scrollable area displaying the conversation history.
        *   **Message Bubbles**: Distinguished styling for sent vs. received messages.
        *   **Attachments**: Special handling for image and file attachments to fit content with minimal padding (`w-fit`, `p-1`).
        *   **Timestamps** & **Read Receipts**.
    *   **Input Area**: Floating input bar with options for:
        *   Voice/Mic input.
        *   Text input.
        *   Image, Emoji, and File attachments.
        *   Send button.

### 3. Right Sidebar: Information
*   **Width**: Fixed `w-72`.
*   **Visibility**: Hidden on smaller screens (`hidden xl:flex`).
*   **Content**:
    *   **Profile**: Large avatar, name, handle, and role of the active chat participant.
    *   **Shared Media**: List of shared files and photos with download/preview options.
    *   **Members**: List of participants in group chats (if applicable).

## Key Components

### `AttachmentItem`
A reusable component for rendering file attachments in the info sidebar.
*   **Props**: `icon`, `name`, `size`, `color`.
*   **Styling**: Flex row with icon container, truncated filename, and file size.

### `Message Bubble`
*   **Text Messages**: Standard padding (`p-3`).
*   **File/Image Messages**: Tight padding (`p-1`) and width fitted to content (`w-fit`) to maximize visual efficiency.

## Data Model
*   **User**: `id`, `name`, `avatar`, `status`, `role`, `handle`.
*   **Message**: `id`, `senderId`, `content`, `timestamp`, `type` ('text', 'image', 'file'), `attachments`.
*   **Thread**: `id`, `participants`, `messages`, `unreadCount`, `typing`.

## Responsive Design
*   **Container Height**: adjusts based on screen size (`lg` breakpoint) to account for different navbar heights.
*   **Sidebars**: The right sidebar is hidden on screens smaller than `xl` to preserve chat space.
