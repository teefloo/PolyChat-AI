# 🎨 PolyChat AI

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)

The ultimate AI chat interface. A modern web application powered by React 19 and Vite, using OpenRouter to access the world's best LLMs with a beautiful, customizable UI.

## 🚀 Features
- 🌐 **Multi-Model Access**: Connect to 100+ models via OpenRouter (GPT-4o, Claude 3.5, Gemini 1.5, etc.).
- 🖼️ **AI Image Generation**: Built-in support for image generation with multimodal models and style presets.
- 🧠 **Local RAG**: Intelligent context enhancement using local embeddings via Xenova Transformers.
- 🎨 **Polychrome Themes**: Multiple visual styles (Dark, Light, Pixel Art, Hacker) and 8+ accent colors.
- ⚡ **Real-time Streaming**: Fluid AI responses with live character streaming and loading animations.
- 📱 **Fully Responsive**: Optimized experience for desktop, tablet, and mobile devices.
- 🛠️ **Quick Actions**: Instant tools for code optimization, debugging, and text improvement.

## 🛠 Tech Stack
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4, Framer Motion
- **State Management**: Zustand
- **AI Integration**: OpenRouter API
- **NLP**: @xenova/transformers (Local RAG)

## 📦 Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Teeflo/PolyChat-AI.git
   cd PolyChat-AI
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start the development server**
   ```bash
   npm run dev
   ```

## 📖 Usage
1. **API Key Setup**: On first launch, enter your [OpenRouter API Key](https://openrouter.ai/) in the settings.
2. **Start Chatting**: Click "New Conversation", select a model, and start your discussion.
3. **Shortcuts**:
   - `Ctrl + K`: Open settings panel
   - `Ctrl + U`: View usage dashboard
   - `Ctrl + N`: Create new conversation

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
