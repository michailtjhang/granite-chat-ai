<p align="center">
  <img src="app/favicon.ico" alt="Logo" width="200" />
</p>

# IBM Granite Chat AI

Aplikasi chat AI modern yang menggunakan model IBM Granite 3.3-8b-instruct melalui Replicate API, dibangun dengan Next.js 15 dan tampilan mirip Chat Ai pada umumnya.

## Teknologi

- **Next.js 15** - React framework dengan App Router
- **TypeScript** - Menjamin type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Replicate API** - Model hosting untuk IBM Granite
- **Lucide React** - Ikon modern dan ringan

## Fitur

- 🎨 UI modern mirip Chat Ai pada umumnya dengan dark theme
- 💬 Multiple chat conversations dengan sidebar
- 🤖 Integrasi dengan IBM Granite AI model via Replicate
- ⚡ Real-time typing indicators
- 📱 Responsive design untuk mobile dan desktop
- ✨ Smooth animations dan transitions
- 🔄 Auto-scroll ke pesan terbaru
- ⌨️ Keyboard shortcuts (Enter to send, Shift+Enter for new line)

## Setup Project

### 1. Clone/Download Files

```bash
git clone https://github.com/username/granite-chat-ai.git
cd granite-chat-ai
```

### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

### 3. Environment Variables

Buat file `.env.local` di root project:

```bash
REPLICATE_API_TOKEN=Token API REPLICATE
```

**⚠️ Penting:** Pastikan mengganti dengan token Replicate yang valid.

### 4. Run Development Server

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🧠 AI Support Explanation

Aplikasi ini menggunakan **IBM Granite 3.3-8b-instruct** melalui **Replicate API** sebagai otak percakapan, untuk menjawab pertanyaan dan merespons input pengguna secara interaktif.

* Model Granite dipanggil dari endpoint `app/api/chat/route.ts`.
* Parameter default yang digunakan:

  * `max_tokens`: 512
  * `temperature`: 0.6
  * `top_p`: 0.9
  * `top_k`: 50
* Pengguna dapat menyesuaikan parameter ini sesuai kebutuhan untuk mengatur gaya respons AI.

## 📜 License

MIT License – bebas digunakan untuk proyek personal maupun komersial.