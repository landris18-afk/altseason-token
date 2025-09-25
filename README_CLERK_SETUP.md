# Clerk Authentication Setup

## 🚀 Clerk beállítás lépései:

### 1. Clerk Dashboard
1. Menj a [Clerk Dashboard](https://dashboard.clerk.com/) oldalra
2. Hozz létre egy új alkalmazást
3. Válaszd ki a **Next.js** framework-et

### 2. Environment változók
Másold ki a kulcsokat a Clerk Dashboard-ból és add hozzá a `.env.local` fájlhoz:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/game
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/game
```

### 3. Clerk konfiguráció
A Clerk Dashboard-ban állítsd be:

#### **Social Login Providers:**
- ✅ Google
- ✅ GitHub
- ✅ Email/Password

#### **Appearance:**
- **Primary Color:** `#fbbf24` (yellow-400)
- **Background:** `#1f2937` (gray-800)
- **Text:** `#ffffff` (white)

#### **User Profile:**
- ✅ First Name
- ✅ Last Name
- ✅ Username
- ✅ Email

### 4. Tesztelés
1. Indítsd el a fejlesztői szervert: `npm run dev`
2. Nyisd meg a játékot
3. Kattints a "START GAME" gombra
4. Teszteld a bejelentkezést/regisztrációt

## 🎮 Játék Flow

### **Új Flow:**
1. **Ranglista megtekintése** (bejelentkezés nélkül)
2. **START GAME** gomb → Clerk bejelentkezés modal
3. **Bejelentkezés/Regisztráció** → Automatikus játék indítás
4. **Játékállapot mentése** (user ID alapján)

### **Előnyök:**
- ✅ Ranglista marketing (mindenki látja)
- ✅ Egyszerű bejelentkezés
- ✅ Automatikus név (Clerk profilból)
- ✅ User-specifikus játékállapot
- ✅ Nincs dupla név megadás

## 🔧 API Endpoints

### **Leaderboard:**
- `GET /api/leaderboard` - Ranglista lekérése
- `POST /api/leaderboard` - Ranglista frissítése (jövőben)

### **Game State:**
- `POST /api/game/save` - Játékállapot mentése
- `GET /api/game/save` - Játékállapot betöltése

## 📱 Responsive Design

A Clerk komponensek automatikusan adaptálódnak:
- **Desktop:** Teljes modal
- **Mobile:** Optimalizált layout
- **Custom styling:** Játék témájához igazított

## 🎯 Következő lépések

1. **Clerk kulcsok beállítása**
2. **Tesztelés fejlesztői környezetben**
3. **Production deployment**
4. **Valós adatbázis integráció** (jövőben)

---

**Kész! A Clerk authentication integrálva van a játékba!** 🚀✨

