# The English - Sekolah Alam Al-Karim

Media pembelajaran & evaluasi Bahasa Inggris interaktif untuk tingkat TK, SD, SMP, dan SMA.

## 🚀 Fitur Auto-Sync GitHub & AI Studio

Proyek ini telah dilengkapi dengan script **Auto-Sync** watcher:
- **Command:** `npm run sync:watch` atau `node scripts/auto_sync.cjs`
- **Fungsi:** Memantau seluruh editan file secara *real-time*. Setiap ada perubahan file yang disimpan, sistem secara otomatis melakukan `git add .`, `git commit`, dan `git push origin main` setelah jeda *debounce* 5 detik.
- **AI Studio:** Sinkronisasi otomatis ke Google AI Studio melalui GitHub repository `alkarimschool/Theenglish`.

## 🛠️ Cara Menjalankan

```bash
# Menjalankan Server Utama
npm run dev

# Menjalankan Watcher Auto-Sync (jika belum berjalan di background)
npm run sync:watch
```
