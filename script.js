let apiKey = "";

// Language flag mappings
const languageFlags = {
  english: "🇺🇸",
  spanish: "🇪🇸",
  french: "🇫🇷",
  german: "🇩🇪",
  italian: "🇮🇹",
  portuguese: "🇵🇹",
  russian: "🇷🇺",
  chinese: "🇹🇼",
  "traditional chinese": "🇹🇼",
  "simplified chinese": "🇨🇳",
  mandarin: "🇹🇼",
  japanese: "🇯🇵",
  korean: "🇰🇷",
  arabic: "🇸🇦",
  hindi: "🇮🇳",
  dutch: "🇳🇱",
  swedish: "🇸🇪",
  norwegian: "🇳🇴",
  danish: "🇩🇰",
  polish: "🇵🇱",
  turkish: "🇹🇷",
  greek: "🇬🇷",
  hebrew: "🇮🇱",
  thai: "🇹🇭",
  vietnamese: "🇻🇳",
  indonesian: "🇮🇩",
  malay: "🇲🇾",
  filipino: "🇵🇭",
  czech: "🇨🇿",
  hungarian: "🇭🇺",
  romanian: "🇷🇴",
  bulgarian: "🇧🇬",
  croatian: "🇭🇷",
  serbian: "🇷🇸",
  ukrainian: "🇺🇦",
  finnish: "🇫🇮",
  estonian: "🇪🇪",
  latvian: "🇱🇻",
  lithuanian: "🇱🇹",
};

// Sample texts for testing
const sampleTexts = {
  english: "Hello, how are you today? I hope you're having a wonderful day!",
  spanish: "Hola, ¿cómo estás hoy? ¡Espero que tengas un día maravilloso!",
  french:
    "Bonjour, comment allez-vous aujourd'hui? J'espère que vous passez une merveilleuse journée!",
  chinese: "你好，你今天怎麼樣？我希望你今天過得很愉快！",
  japanese:
    "こんにちは、今日はいかがですか？素晴らしい一日をお過ごしください！",
  mixed:
    "Hello! Bonjour! 你好! こんにちは! This text contains multiple languages mixed together.",
};

// Detection prompts for different modes
const detectionPrompts = {
  simple: `Detect the primary language of the following text and provide a JSON response with:
            - language: language name (e.g., "English", "Spanish", "Traditional Chinese", "Simplified Chinese")
            - code: ISO 639-1 code (e.g., "en", "es", "zh-TW", "zh-CN")
            - confidence: percentage (0-100)
            - reasoning: brief explanation
            Note: Distinguish between Traditional Chinese (Taiwan) and Simplified Chinese (Mainland China).
            
            Text to analyze:`,

  detailed: `Analyze the languages in the following text and provide a JSON response with:
            - primary_language: main language name (distinguish Traditional/Simplified Chinese)
            - primary_code: ISO code for primary language (zh-TW for Traditional, zh-CN for Simplified)
            - confidence: percentage for primary language
            - all_languages: array of objects with {language, code, confidence}
            - reasoning: explanation of detection
            Note: Properly identify Traditional Chinese vs Simplified Chinese.
            
            Text to analyze:`,

  comprehensive: `Perform comprehensive language detection and analysis of the following text. Provide a JSON response with:
            - primary_language: main language name (Traditional Chinese vs Simplified Chinese)
            - primary_code: ISO code (zh-TW for Traditional, zh-CN for Simplified)
            - confidence: percentage for primary language
            - all_languages: detailed array of {language, code, confidence, sample_words}
            - text_characteristics: string describing linguistic features (not an object)
            - mixed_language: boolean indicating if multiple languages detected
            - reasoning: detailed explanation
            Note: Carefully distinguish between Traditional Chinese (Taiwan) and Simplified Chinese (Mainland China) based on character forms. Make text_characteristics a descriptive string, not an object.
            
            Text to analyze:`,
};

// Set sample text
function setSampleText(type) {
  document.getElementById("inputText").value = sampleTexts[type];
}

// Main detection function
async function detectLanguage() {
  apiKey = document.getElementById("apiKey").value.trim();
  const inputText = document.getElementById("inputText").value.trim();
  const detectionMode = document.getElementById("detectionMode").value;

  // Validate inputs
  if (!apiKey) {
    showError("Please enter your OpenAI API Key");
    return;
  }

  if (!inputText) {
    showError("Please enter text to detect language");
    return;
  }

  if (inputText.length < 5) {
    showError("Text too short. Please enter at least 5 characters");
    return;
  }

  // Show loading
  showLoading(true);
  hideError();
  hideResults();

  try {
    // Call OpenAI API
    const detection = await callOpenAI(inputText, detectionMode);

    // Display results
    displayResults(detection, inputText);
  } catch (error) {
    console.error("Error:", error);
    showError("Language detection failed: " + error.message);
  } finally {
    showLoading(false);
  }
}

// Call OpenAI API
async function callOpenAI(text, mode) {
  const prompt = detectionPrompts[mode];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert linguist and language detection specialist. Always respond with valid JSON only, no additional text.",
        },
        {
          role: "user",
          content: `${prompt}\n\n"${text}"`,
        },
      ],
      max_tokens: 800,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "API request failed");
  }

  const data = await response.json();
  const responseText = data.choices[0].message.content.trim();

  try {
    return JSON.parse(responseText);
  } catch (e) {
    throw new Error("Invalid response format from AI");
  }
}

// Display detection results
function displayResults(detection, originalText) {
  const primaryLang =
    detection.primary_language || detection.language || "Unknown";
  const primaryCode = detection.primary_code || detection.code || "--";
  const confidence = detection.confidence || 0;

  // Update primary result
  document.getElementById("languageFlag").textContent =
    languageFlags[primaryLang.toLowerCase()] || "🌍";
  document.getElementById("languageName").textContent = primaryLang;
  document.getElementById("languageCode").textContent =
    primaryCode.toUpperCase();
  document.getElementById("confidenceScore").textContent =
    `Confidence: ${confidence}%`;

  // Update confidence bar
  document.getElementById("confidenceFill").style.width = `${confidence}%`;

  // Display language rankings
  displayLanguageList(
    detection.all_languages || [
      {
        language: primaryLang,
        code: primaryCode,
        confidence: confidence,
      },
    ],
  );

  // Display text analysis
  displayTextAnalysis(detection, originalText);

  // Show results
  document.getElementById("resultsContainer").classList.add("show");
}

// Display language list
function displayLanguageList(languages) {
  const container = document.getElementById("languageList");
  container.innerHTML = "";

  languages.forEach((lang, index) => {
    const langDiv = document.createElement("div");
    langDiv.className = "language-item";
    langDiv.innerHTML = `
                    <div class="language-info">
                        <span class="lang-flag">${languageFlags[lang.language.toLowerCase()] || "🌍"}</span>
                        <span class="lang-name">${lang.language}</span>
                    </div>
                    <span class="lang-score">${lang.confidence}%</span>
                `;
    container.appendChild(langDiv);
  });
}

// Display text analysis
function displayTextAnalysis(detection, text) {
  const wordCount = text.trim().split(/\s+/).length;
  const charCount = text.length;
  const langCount = detection.all_languages
    ? detection.all_languages.length
    : 1;

  document.getElementById("wordCount").textContent = wordCount;
  document.getElementById("charCount").textContent = charCount;
  document.getElementById("langCount").textContent = langCount;

  const analysisDiv = document.getElementById("textAnalysis");
  let analysisText =
    detection.reasoning || "Language detected based on linguistic patterns.";

  // Handle text_characteristics properly
  if (detection.text_characteristics) {
    if (typeof detection.text_characteristics === "string") {
      analysisText += `\n\nCharacteristics: ${detection.text_characteristics}`;
    } else if (typeof detection.text_characteristics === "object") {
      analysisText += "\n\nCharacteristics:";
      Object.entries(detection.text_characteristics).forEach(([key, value]) => {
        analysisText += `\n• ${key}: ${value}`;
      });
    }
  }

  if (detection.mixed_language) {
    analysisText += "\n\n🌐 Mixed language content detected.";
  }

  analysisDiv.textContent = analysisText;
}

// Show/hide loading
function showLoading(show) {
  document.getElementById("loadingDiv").style.display = show ? "block" : "none";
  document.querySelector(".detect-btn").disabled = show;
}

// Show error
function showError(message) {
  document.getElementById("errorDiv").textContent = message;
  document.getElementById("errorDiv").style.display = "block";
}

// Hide error
function hideError() {
  document.getElementById("errorDiv").style.display = "none";
}

// Hide results
function hideResults() {
  document.getElementById("resultsContainer").classList.remove("show");
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  // Optional: Set a sample text
  // setSampleText('mixed');
});
