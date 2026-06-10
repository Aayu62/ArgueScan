# Product Requirement Document (PRD) — ArgueScan

## 1. Executive Summary

### 1.1 Purpose

ArgueScan is an open-source, lightweight browser extension designed to analyze textual arguments on the web in real time. Moving beyond traditional "positive vs. negative" sentiment analysis, ArgueScan evaluates the **structural integrity of rhetoric** by mapping text against mathematical "vector zones" representing well-known logical fallacies and cognitive biases.

### 1.2 Vision

To empower readers with a real-time, objective "rhetorical firewall" that surfaces manipulative language, personal attacks, and emotional manipulation across news platforms, social media, and debate forums.

### 1.3 Scope (MVP)

* A browser extension (Chrome-compliant Manifest V3) that parses user-selected web text.
* A free, self-hosted Python microservice backend handling semantic similarity.
* In-page text decoration (underlines/highlights) identifying flawed arguments without disrupting reading flow.
* A zero-cost, privacy-first technical architecture.

---

## 2. User Personas

### 2.1 The Critical Consumer

* **Profile:** A tech-savvy student or researcher who consumes long-form news, essays, and public debates online.
* **Pain Point:** Frustrated by hyper-partisan reporting and emotional baiting; manually identifying flaws slows down reading momentum.
* **Goal:** Wants an ambient, unobtrusive assistant that flags bad-faith arguments instantly as they read.

### 2.2 The Online Debate Participant

* **Profile:** Active on social forums, tech communities, or academic platforms where fast-paced discussions happen.
* **Pain Point:** Falls into rhetorical traps or wastes time answering poorly constructed arguments (e.g., *Ad Hominem* attacks).
* **Goal:** Highlights an opponent's comment to quickly reveal its structural logical fallacy to frame counter-arguments cleanly.

---

## 3. Core Functional Requirements (FR)

### 3.1 Text Extraction & Segmentation (Frontend Extension)

* **FR-1.1:** The extension must extract textual selections highlighted by the user via a right-click context menu.
* **FR-1.2:** The extension must clean the extracted text string to remove messy whitespace, trailing breaks, or hidden DOM artifacts before processing.
* **FR-1.3:** Text must be split into cleanly delimited sentences before dispatching to the analytical backend service.

### 3.2 Semantic Fallacy Mapping (Backend API)

* **FR-2.1:** The backend must evaluate incoming sentences against a pre-compiled, high-quality "Anchor Dataset" of logical fallacies.
* **FR-2.2:** Fallacy detection must rely on **Cosine Similarity Math** over high-dimensional dense vector spaces, not simple static keyword or regex matching.
* **FR-2.3:** The backend must return a clean JSON response containing matched sentence indexes, specific fallacy classifications, and mathematical confidence metrics ($0.00$ to $1.00$).

### 3.3 Minimalist Interactive Overlay (Frontend UI)

* **FR-3.1:** Flagged text must be styled with subtle, low-saturation background washes or underlines matching the selected mode (Light/Dark).
* **FR-3.2:** Hovering over an active highlight must fade in a native, lightweight tooltip box detailing the fallacy name and confidence score.
* **FR-3.3:** The user must be able to toggle the extension runtime active state via a global binary switch inside the toolbar popup menu.
* **FR-3.4:** The user must be able to control the semantic matching tolerance via a "Sensitivity Slider" ranging from $35\%$ to $85\%$ similarity thresholds.

---

## 4. Non-Functional Requirements (NFR)

### 4.1 Cost Constraints ($0 Budget)

* **NFR-1.1:** The project must bypass paid text-generation or embedding APIs entirely.
* **NFR-1.2:** The vector embedding models used must be fully open-source and capable of executing smoothly on basic, free cloud CPU tiers (e.g., Render, Hugging Face Spaces free layer).

### 4.2 Performance & Latency

* **NFR-2.1:** Text selections under 5 sentences must return analysis overlays within $< 400\text{ms}$.
* **NFR-2.2:** Full scans should complete asynchronously without locking, lag, or freezing the browser user-interface thread.

### 4.3 UI/UX Design System Constraints

* **NFR-3.1:** **Absolute ban on the color Blue** across all design motifs, highlights, states, text links, and assets.
* **NFR-3.2:** Design language must remain strictly minimalist, flat, and editorial, resembling high-end typography sheets rather than typical tech dashboards.
* **NFR-3.3:** Native, comprehensive support for both **Light Mode** (warm eggshell backgrounds) and **Dark Mode** (deep charcoal/slate backgrounds).

### 4.4 Privacy & Data Integrity

* **NFR-4.1:** The system must not store or persist user article texts, logs, browsing habits, or personal identifiers. Text vectors are processed entirely in ephemeral memory volatile buffers and discarded immediately post-response.

---

## 5. Fallacy Taxonomy & Scope

The Initial Minimum Viable Product (MVP) will launch tracking exactly four high-impact structural deviations:

| Fallacy Group | Target Characteristics | Visual Identity Accent |
| --- | --- | --- |
| **Ad Hominem** | Insults, character degradation, poisoning the well, dismissing claims based on identity or history. | Soft Coral / Muted Crimson |
| **Fear-Mongering** | Appeals to absolute catastrophe, apocalyptic warnings, worst-case scenarios unsupported by data. | Warm Amber / Soft Ochre |
| **False Dilemma** | Arbitrary binary categorization, eliminating compromise channels ("Us vs. Them"). | Dusty Terracotta |
| **Strawman** | Oversimplification of complex policies, attacking caricatures instead of core data arguments. | Low-Saturation Sage Green |

---

## 6. Success Metrics & Criteria

* **Accuracy:** Over $80\%$ true-positive alignment on standard text-bias testing datasets (e.g., public political debate corpora).
* **Adoption Mechanics:** Clean local installation setup via standard developer mode documented on GitHub to ensure smooth onboarding for engineering portfolio reviews.
* **Stability:** Zero DOM breakdown errors across top news and platform sites (BBC, Wikipedia, Medium, Reddit, X).