# AI Language Detector

A lightweight web application that automatically detects languages in text using AI technology. Built with vanilla HTML, CSS, and JavaScript.

## Features

- **Three Detection Modes**:
  - Simple: Primary language detection
  - Detailed: Multiple language analysis
  - Comprehensive: Full linguistic analysis

- **Visual Results**:
  - Country flags for 40+ languages
  - Confidence percentage with progress bar
  - Language rankings and statistics

- **Built-in Samples**: Quick test with English, Spanish, French, Chinese, Japanese, and mixed language texts

## Quick Start

1. **Open** `index.html` in your browser
2. **Enter** your OpenAI API Key
3. **Select** detection mode
4. **Paste** text or click sample buttons
5. **Click** "Detect Language"

## Requirements

- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))
- Modern web browser

## Language Support

Supports 40+ languages including:
- **Asian**: Traditional Chinese 🇹🇼, Simplified Chinese 🇨🇳, Japanese 🇯🇵, Korean 🇰🇷
- **European**: English 🇺🇸, Spanish 🇪🇸, French 🇫🇷, German 🇩🇪, Italian 🇮🇹
- **Others**: Arabic 🇸🇦, Hindi 🇮🇳, Russian 🇷🇺, Portuguese 🇵🇹

## Test Examples

**English:**
```
Hello, how are you today? I hope you're having a wonderful day!
```

**Traditional Chinese:**
```
你好，你今天怎麼樣？我希望你今天過得很愉快！
```

**Mixed Languages:**
```
Hello! Bonjour! 你好! こんにちは! Multiple languages in one text.
```

## Project Structure

```
├── index.html          # Main application
└── README.md           # This file
```

## Technology

- Pure HTML/CSS/JavaScript
- OpenAI GPT-3.5-turbo API
- No build process required

## License

MIT License