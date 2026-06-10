# Functional Requirements Document (FRD) — ArgueScan

## 1. System Input/Output Boundary Specification

### 1.1 Input Formats and Restrictions

* **User Selection Input:** Text strings highlighted via the mouse cursor on any active HTML webpage.
* *Minimum Requirement:* **15 characters** (to filter out accidental single-word selections).
* *Maximum Ceiling:* **15,000 characters per single request batch** (enforced to shield the free-tier backend from memory exhaustion).


* **Configuration Controls (Via Extension Popup Panel):**
* **System Status:** Binary toggle switch (`ON` | `OFF`).
* **Sensitivity Coefficient:** Variable slider scaling linearly from `0.35` to `0.85`.
* **Interface Theme:** Binary toggle selection (`LIGHT` | `DARK`).



### 1.2 System Output Elements

* **Visual In-Line Overlay:** Custom styled inline elements injected into the host webpage's DOM without shifting surrounding layouts.
* **Hover Tooltip Modal:** Contextual container that renders directly adjacent to the user's cursor position.
* **Popup Metrics View:** Percentage breakdown bar graphs indicating the overall composition of scanned text blocks.

---

## 2. Core User Interaction & System Flows

### 2.1 Context Menu Highlight Scanning (Primary Loop)

1. **Selection:** The user highlights an argumentative text block inside a webpage tab.
2. **Execution:** The user right-clicks, pulling up the browser context menu, and triggers `"Scan Selection with ArgueScan"`.
3. **Loading State:** The frontend script intercepts the text payload, assigns a unique transaction ID, and initiates an asynchronous HTTP `POST` network call to the Python API while rendering a subtle, desaturated loading wheel near the cursor.
4. **Rendering:** Upon receiving a successful `HTTP 200 OK` JSON array, the extension maps the returned indexes, identifies the fallacy locations, and paints the targeted sentences with transparent background highlights.

### 2.2 Dynamic Sensitivity Adjustment Loop

1. The user opens the extension panel from the browser toolbar.
2. The user modifies the sensitivity slider from `55%` (default) to `75%` (stricter checking).
3. `popup.js` updates the tracking index inside `chrome.storage.local`.
4. `content.js` listens for this runtime storage mutation event and instantly re-evaluates the active highlighted sentences on the webpage.
5. Any sentence with a historical confidence score below `0.75` immediately drops its background accent color without forcing a full page reload.

---

## 3. Interface Component Requirements

### 3.1 Browser Context Menu Integration

* **FRD-3.1.1:** The background script (`background.js`) must register the extension context item into the browser engine during the application bootstrap sequence.
* **FRD-3.1.2:** The context menu action item must only trigger visibility states when the active DOM window focus highlights a non-empty, string-based text asset selection.

### 3.2 Network Error Handling & Graceful Fallbacks

* **FRD-3.2.1:** If an HTTP network connection failure occurs (such as a server timeout exceeding `8000ms`, or `HTTP 503 Server Unavailable` from a free-tier cold boot), the extension must handle the exception cleanly.
* **FRD-3.2.2:** The UI cursor loading indicator must instantly clear, and a flat, minimalist toast banner reading *"Server warming up or offline — Try again in a few seconds"* must fade in at the bottom right corner of the active viewport for exactly `3500ms`.
* **FRD-3.2.3:** Under no scenario shall an API failure or unhandled exception corrupt, lock up, or break the host website’s native document layout trees or event loops.