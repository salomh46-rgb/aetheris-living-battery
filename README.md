# 🌿 AETHERIS Core — Living Battery & System Biome (Windows 11)

> **Cyluma muqobili — Windows 11 ekotizimi uchun estetik "Kvant Biosferasi" va batareya/tizim telemetriyasi.**

![Aetheris Preview](resources/tray.png)

## 🌌 Loyiha Haqida

**Aetheris** — bu macOS dagi mashhur *Cyluma* utilitasining Windows 11 uchun maxsus ishlab chiqilgan, yanada boyitilgan ekvivalenti. U standart zerikarli batareya foizlari o'rniga, noutbukingiz quvvatini va tizim holatini **suzuvchi 3D "Tirik Kvant Orolchasi" (Living Floating Island)** ko'rinishida namoyon etadi.

### ✨ Asosiy Imkoniyatlar

1. **🌿 Living Floating Island (Three.js WebGL Biome):**
   - Batareya to'la bo'lganda (80–100%) yam-yashil gullab-yashnaydi, zaryad olayotganda energiyaga to'lib, oltin/moviy zarrachalar yuqoriga oqadi.
   - Kam zaryadda (<20%) orol oqshom tumaniga burkanadi va qizil/qahrabo tusga kiradi.
   - Sichqoncha harakatiga mos nozik 3D gravitatsiya/tilt fizikasi.
2. **⚡ Real-time Telemetriya:**
   - Batareya zaryadi, qolgan vaqt va to'lish vaqti.
   - Batareya salomatligi (Battery Health) va o'tgan sikllar soni (Cycle Count).
   - CPU va RAM yuklamasi, protsessor harorati (°C).
3. **🛡️ 80% Smart Battery Limiter (Salomatlik Qo'riqchisi):**
   - Batareya degradatsiyasini oldini olish uchun 80% ga yetganda avtomatik Windows 11 bildirishnomasi (Notification).
4. **🔥 Power Leak Hunter (Quvvat O'g'rilari Detektori):**
   - Orqa fonda batareyani tez tugatayotgan eng og'ir jarayonlarni aniqlaydi.
5. **🪟 Windows 11 Native Tray Flyout:**
   - Taskbar'dagi kichik yashil batareya belgisi ustiga bosilganda `Acrylic/Mica` shisha oynasi ochiladi va tashqariga bosilganda o'z-o'zidan yashirinadi.

---

## 🚀 Ishga Tushirish

### Talablar:
- Node.js v20+

### O'rnatish va Ishga Tushirish:
```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Brauzerda test qilish (Web rejim)
npm run dev

# 3. Windows Tray ilovasi sifatida ishga tushirish (Desktop rejim)
npm start
```

---

## 🛠️ Arxitektura

```
aetheris/
├── electron/
│   ├── main.ts         # Windows Tray, Flyout positioning, systeminformation poller
│   └── preload.ts      # Xavfsiz contextBridge IPC API
├── src/
│   ├── components/
│   │   ├── FloatingIsland3D.tsx  # Three.js 3D Living Biome
│   │   ├── BatteryCard.tsx       # Quvvat, salomatlik, 80% toggle
│   │   ├── SystemTelemetry.tsx   # CPU/RAM/Harorat datchiklari
│   │   ├── PowerLeakHunter.tsx   # Quvvat sarflovchi jarayonlar
│   │   └── Header.tsx            # Windows nazorat tugmalari
│   ├── App.tsx                   # Windows 11 Acrylic Fluent Glass container
│   ├── types.ts                  # Telemetriya interfeyslari
│   └── index.css                 # Tailwind CSS v4 + Glassmorphism
├── resources/
│   ├── tray.png                  # Windows Tray belgisi
│   └── tray.ico                  # Windows Native Icon
├── package.json
└── vite.config.ts
```

---

**Muallif:** Javohirbek Asqarov (Jasper)  
**Texnologiyalar:** Electron + Vite + React + Three.js + Tailwind CSS v4 + systeminformation
