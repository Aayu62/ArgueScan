# Technical Design Document (TDD) — ArgueScan

## 1. Architectural Overview

ArgueScan utilizes a decoupled client-server architecture designed to execute heavy natural language processing pipelines entirely within $0 cloud resource ceilings.

```
┌────────────────────────────────────────────────────────┐
│               Front-End (Browser Extension)            │
│  ┌────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │ content.js │ ──>│ popup.html  │ ──>│  popup.js   │  │
│  └─────┬──────┘    └─────────────┘    └──────┬──────┘  │
└────────┼─────────────────────────────────────┼─────────┘
         │ (HTTP POST Request JSON)             │ (Reads/Writes)
         ▼                                      ▼
┌─────────────────────────────────┐    ┌─────────────────┐
│     Back-End (Python REST API)  │    │ Browser Storage │
│  ┌───────────────────────────┐  │    │ ┌─────────────┐ │
│  │ FastAPI Pipeline          │  │    │ │ Sensitivity │ │
│  │ ┌──────────────────────┐  │  │    │ │ Context Mode│ │
│  │ │ SentenceTransformer  │  │  │    │ └─────────────┘ │
│  │ └──────────────────────┘  │  │    └─────────────────┘
│  │ ┌──────────────────────┐  │  │
│  │ │ Cosine Math Engine   │  │  │
│  │ └──────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘

```

* **Client Layer (Frontend):** A Manifest V3 JavaScript engine running in the user's browser. It manages DOM text extraction, asynchronous API dispatch, dynamic UI rendering (mode-swapping), and inline element injection.
* **Server Layer (Backend):** A Python microservice hosting an open-source deep learning framework optimized for headless CPU architectures.

---

## 2. Mathematical Vector Pipeline

To accurately classify structural rhetoric without the latency or costs of traditional LLM prompt engineering, ArgueScan utilizes zero-shot semantic mapping via dense embedding vectors.

### 2.1 The Mathematical Model

We implement the `all-MiniLM-L6-v2` SentenceTransformer model. This architecture maps variable-length sentences into a high-dimensional, dense vector space consisting of exactly $384$ values:

$$\vec{v} = \text{Model}(T) \in \mathbb{R}^{384}$$

### 2.2 Similarity Calculations

Let $\vec{u}$ represent the embedding vector of an input sentence parsed from an active webpage, and let $\vec{w}_i$ represent the vector of a pre-compiled anchor sentence within our fallacy dataset.

The proximity between these vectors is calculated using the **Cosine Similarity Metric**, which measures the cosine of the angle between them regardless of magnitude:

$$\text{Similarity}(\vec{u}, \vec{w}_i) = \frac{\vec{u} \cdot \vec{w}_i}{\|\vec{u}\| \|\vec{w}_i\|} = \frac{\sum_{j=1}^{384} u_j w_{ij}}{\sqrt{\sum_{j=1}^{384} u_j^2} \sqrt{\sum_{j=1}^{384} w_{ij}^2}}$$

If the resulting scalar similarity exceeds the user's operational sensitivity threshold ($T_s$), the sentence is successfully flagged:

$$\text{Match} = \begin{cases} \text{True}, & \text{if } \max(\text{Similarity}(\vec{u}, \vec{w}_i)) \ge T_s \\ \text{False}, & \text{otherwise} \end{cases}$$

---

## 3. System Interfaces & API Specifications

### 3.1 Text Processing Endpoint

* **Path:** `/api/v1/scan`
* **Method:** `POST`
* **Content-Type:** `application/json`

#### Request Payload Structure

```json
{
  "text_payload": "Don't listen to the governor's economic policy. He is an uneducated liar who can't be trusted. If we implement his laws, our cities will instantly fall into total ruin.",
  "sensitivity_threshold": 0.55
}

```

#### Response Payload Structure

```json
{
  "status": "success",
  "metrics": {
    "total_sentences_evaluated": 3,
    "fallacies_detected_count": 2
  },
  "analysis_results": [
    {
      "sentence_index": 0,
      "raw_text": "Don't listen to the governor's economic policy.",
      "is_flagged": false,
      "fallacy_type": null,
      "confidence_score": 0.00
    },
    {
      "sentence_index": 1,
      "raw_text": "He is an uneducated liar who can't be trusted.",
      "is_flagged": true,
      "fallacy_type": "ad_hominem",
      "confidence_score": 0.7421
    },
    {
      "sentence_index": 2,
      "raw_text": "If we implement his laws, our cities will instantly fall into total ruin.",
      "is_flagged": true,
      "fallacy_type": "fear_mongering",
      "confidence_score": 0.6894
    }
  ]
}

```

---

## 4. Front-End Storage & Injection Mechanics

### 4.1 Local Browser Storage Design

The extension persists preferences locally inside the browser environment utilizing `chrome.storage.local`. This minimizes unnecessary configuration handshakes:

* `arguescan_active_state`: Boolean (`true` | `false`)
* `arguescan_sensitivity`: Float ($0.35$ to $0.85$, defaulting to $0.55$)
* `arguescan_theme_preference`: String (`"light"` | `"dark"`)

### 4.2 DOM Wrapper Mechanics (`content.js`)

To safely apply styles to targeted phrases without altering the host website's layout cascades or breaking native click hooks, the extension reconstructs matching lines inside custom, inline micro-containers:

```html
<span class="as-flagged-text as-type-ad-hominem" data-bias-type="Ad Hominem" data-confidence="74%">
  He is an uneducated liar who can't be trusted.
</span>

```

---

## 5. Deployment Framework ($0 Ceiling)

* **API Hosting Environment:** Deployed as an optimized Docker multi-stage container build targeting the **Render Free Web Service Tier** or **Hugging Face Spaces (Docker SDK)**.
* **Resource Throttling:** Gunicorn works with a single worker thread and an explicit timeout threshold ($30\text{s}$) to gracefully process requests within a $512\text{MB}$ RAM server constraint.
* **Model Caching:** The application downloads and initializes the `SentenceTransformer` parameters during the initial container image building phase (`Dockerfile`), compiling them into local workspace storage. This eliminates runtime download overhead on cold boots.