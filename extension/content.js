// content.js - Interacts with the webpage DOM and dispatches requests to FastAPI

console.log("👁️ ArgueScan Content Script successfully injected into this tab.");

// Listen for the background service worker right-click command trigger
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "EXECUTE_SCAN") {
    console.log("🚀 Initializing Scan Pipeline for selection...");
    
    // Trigger our main processing sequence asynchronously
    processRhetoricScan(request.payload_text);
  }
});

/**
 * Dispatches a payload block down to our local FastAPI microservice engine,
 * evaluates structural fallacy outputs, and throws alerts on flagged sentences.
 */
async function processRhetoricScan(selectedText) {
  const API_ENDPOINT = "http://127.0.0.1:8000/api/v1/scan";
  
  // Set up our strictly structured payload body matching our Pydantic schema rules
  const requestBody = {
    text_payload: selectedText,
    sensitivity_threshold: 0.50 // Standard matched tolerance baseline
  };

  try {
    // Dispatch asynchronous HTTP POST Request
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP network error state detected: ${response.status}`);
    }

    const data = await response.json();
    console.log("📊 Vector engine response parsed successfully:", data);
    
    // Process the analysis results array
    handleAnalysisResponse(data.analysis_results);

  } catch (error) {
    console.error("❌ ArgueScan Network Exception:", error);
    alert(`ArgueScan Connection Error:\n\nCould not reach the AI backend service. Make sure your Uvicorn server is running locally on port 8000.`);
  }
}

/**
 * Iterates over the analyzed sentences and flags items with alerts
 */
// content.js - Updated with DOM Inline Highlights and Banned-Blue Palettes

/**
 * Iterates over the analyzed sentences from FastAPI and injects targeted inline
 * wrapper styling nodes directly onto the live webpage DOM structure.
 */
function handleAnalysisResponse(analysisResults) {
  // Grab the user's active cursor selection text model object from the window context
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  // Isolate the precise coordinates of the highlighted page nodes
  const originalRange = selection.getRangeAt(0);
  
  // Create a temporary layout fragmentation node so we don't cause chaotic layout reflow shifts
  const fragment = document.createDocumentFragment();

  analysisResults.forEach(item => {
    // Create a text container representation piece
    const textNode = document.createTextNode(item.raw_text + ". ");

    if (item.is_flagged) {
      // Build our custom minimalist structural highlight tag wrapper element
      const highlightSpan = document.createElement("span");
      highlightSpan.appendChild(textNode);
      
      // Apply our absolute premium styling sheets (strictly zero blue allowed)
      highlightSpan.style.borderRadius = "3px";
      highlightSpan.style.padding = "2px 4px";
      highlightSpan.style.margin = "0 2px";
      highlightSpan.style.transition = "background-color 0.3s ease";
      
      // Dynamically assign target fallacy color tints based on the Design System specs
      if (item.fallacy_type === "ad_hominem") {
        highlightSpan.style.backgroundColor = "rgba(235, 94, 85, 0.15)"; // Soft Coral Red
        highlightSpan.style.borderLeft = "3px solid #EB5E55";
        highlightSpan.title = `ArgueScan Alert: Ad Hominem Attack Detected (${(item.confidence_score * 100).toFixed(0)}% match)`;
      } else if (item.fallacy_type === "fear_mongering") {
        highlightSpan.style.backgroundColor = "rgba(244, 162, 97, 0.15)"; // Muted Warm Amber
        highlightSpan.style.borderLeft = "3px solid #F4A261";
        highlightSpan.title = `ArgueScan Alert: Fear-Mongering Detected (${(item.confidence_score * 100).toFixed(0)}% match)`;
      } else if (item.fallacy_type === "false_dilemma") {
        highlightSpan.style.backgroundColor = "rgba(214, 122, 111, 0.15)"; // Dusty Terracotta
        highlightSpan.style.borderLeft = "3px solid #D67A6F";
        highlightSpan.title = `ArgueScan Alert: False Dilemma Detected (${(item.confidence_score * 100).toFixed(0)}% match)`;
      } else if (item.fallacy_type === "strawman") {
        highlightSpan.style.backgroundColor = "rgba(138, 166, 131, 0.15)"; // Desaturated Sage Green
        highlightSpan.style.borderLeft = "3px solid #8AA683";
        highlightSpan.title = `ArgueScan Alert: Strawman Argument (${(item.confidence_score * 100).toFixed(0)}% match)`;
      }

      fragment.appendChild(highlightSpan);
    } else {
      // If the sentence is clean and logical, insert it normally without any background fills
      fragment.appendChild(textNode);
    }
  });

  // Structural Injection Swap: Clear the original raw text selection node area
  originalRange.deleteContents();
  // Drop our beautifully styled, analyzed fragments right into its place
  originalRange.insertNode(fragment);
  
  // Clear cursor highlighting highlights so the new colors shine cleanly
  selection.removeAllRanges();
}