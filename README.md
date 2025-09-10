# IBM Granite Chat AI

Aplikasi chat AI modern yang menggunakan model IBM Granite 3.3-8b-instruct melalui Replicate API, dibangun dengan Next.js 15 dan tampilan mirip Chat Ai pada umumnya.

## Fitur

- 🎨 UI modern mirip Chat Ai pada umumnya dengan dark theme
- 💬 Multiple chat conversations dengan sidebar
- 🤖 Integrasi dengan IBM Granite AI model via Replicate
- ⚡ Real-time typing indicators
- 📱 Responsive design untuk mobile dan desktop
- ✨ Smooth animations dan transitions
- 🔄 Auto-scroll ke pesan terbaru
- ⌨️ Keyboard shortcuts (Enter to send, Shift+Enter for new line)

## Teknologi

- **Next.js 15** - React framework dengan App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Replicate API** - IBM Granite model hosting
- **Lucide React** - Beautiful icons

## Setup Project

### 1. Clone/Download Files

Buat folder project baru dan copy semua file yang sudah dibuat.

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

**⚠️ Penting:** Ganti token di atas dengan token Replicate yang valid. Token yang diberikan mungkin sudah expired.

### 4. Run Development Server

```bash
npm run dev
# atau
yarn dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Struktur Project

```
granite-chat-ai/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API endpoint untuk chat
│   ├── components/
│   │   └── ChatInterface.tsx     # Main chat component
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── .env.local                   # Environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies
```

## Konfigurasi API

Model yang digunakan: `ibm-granite/granite-3.3-8b-instruct`

Parameter default:
- `max_tokens`: 512
- `temperature`: 0.6
- `top_p`: 0.9
- `top_k`: 50

Anda bisa menyesuaikan parameter ini di file `app/api/chat/route.ts`.

## Customization

### Mengubah Tema
Edit variabel warna di `tailwind.config.js`:

```javascript
colors: {
  'chat-bg': '#212121',      // Background utama
  'sidebar-bg': '#171717',   // Background sidebar
  'message-bg': '#2f2f2f',   // Background pesan
  'user-message': '#2563eb', // Warna pesan user
}
```

### Mengubah Model AI
Ganti URL model di `app/api/chat/route.ts`:

```typescript
const response = await fetch('https://api.replicate.com/v1/models/MODEL_NAME/predictions', {
  // ...
});
```

## Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository di [Vercel](https://vercel.com)
3. Tambahkan environment variable `REPLICATE_API_TOKEN`
4. Deploy!

### Netlify
1. Build project: `npm run build`
2. Upload folder `out` ke Netlify
3. Set environment variables

## Troubleshooting

### 1. API Token Error
Pastikan `REPLICATE_API_TOKEN` sudah diset dengan benar di `.env.local`.

### 2. Build Error
Pastikan semua dependencies terinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 3. Replicate API Error
Cek status API di [Replicate Status](https://status.replicate.com/)

## Contributing

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Create Pull Request

## License

MIT License - feel free to use for personal and commercial projects.