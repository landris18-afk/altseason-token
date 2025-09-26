# Supabase beállítás útmutató

## 1. Supabase projekt létrehozása

1. Menj a [Supabase.com](https://supabase.com/) oldalra
2. Kattints a "Start your project" gombra
3. Regisztrálj vagy jelentkezz be
4. Kattints "New Project" gombra
5. Add meg a projekt adatokat:
   - **Name**: `altseason-token-game`
   - **Database Password**: válassz egy erős jelszót (mentd el!)
   - **Region**: válaszd ki a hozzád legközelebbit

## 2. Adatbázis séma létrehozása

1. A Supabase dashboard-ban menj a **SQL Editor**-be
2. Másold be a `supabase-schema.sql` fájl tartalmát
3. Kattints a **Run** gombra
4. Ellenőrizd, hogy minden tábla létrejött a **Table Editor**-ben

## 3. API kulcsok lekérése

1. A dashboard bal oldalán kattints a **Settings** (fogaskerék ikon) gombra
2. Menj a **API** szekcióba
3. Másold ki ezeket az értékeket:
   - **Project URL** (pl: `https://your-project.supabase.co`)
   - **anon public** key
   - **service_role** key (⚠️ **SOHA ne add hozzá a frontend-hez!**)

## 4. Environment változók beállítása

Hozz létre egy `.env.local` fájlt a projekt gyökerében:

```env
# Supabase konfiguráció
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 5. Clerk integráció tesztelése

1. Indítsd el a fejlesztői szervert: `npm run dev`
2. Nyiss meg egy böngészőt és menj a `http://localhost:3000`-ra
3. Jelentkezz be Clerk-rel
4. Játssz egy kicsit a játékkal
5. Ellenőrizd a Supabase dashboard-ban, hogy:
   - Létrejött-e a felhasználó a `users` táblában
   - Mentődtek-e a játék adatok a `game_states` táblában
   - Megjelent-e a ranglistán a `game_states` táblában

## 6. Cross-device szinkronizáció tesztelése

1. Jelentkezz be egy eszközön
2. Játssz és érj el egy eredményt
3. Jelentkezz be egy másik eszközön (vagy inkognitó ablakban)
4. Ellenőrizd, hogy ugyanott folytathatod-e a játékot

## 7. RLS (Row Level Security) ellenőrzése

A beállított RLS szabályok biztosítják, hogy:
- ✅ Felhasználók csak a saját adataikat láthatják
- ✅ Mindenki láthatja a ranglistát (csak azokat, akik engedélyezték)
- ✅ Csak bejelentkezett felhasználók menthetnek adatokat
- ✅ Felhasználók beállíthatják a display name-et és a ranglista megjelenést

## 8. Backup és monitoring

### Backup
- Supabase automatikusan készít backup-ot
- További backup-ot készíthetsz a **Database** → **Backups** menüben

### Monitoring
- **Database** → **Logs**: adatbázis lekérdezések
- **API** → **Logs**: API hívások
- **Auth** → **Users**: bejelentkezett felhasználók

## 9. Hibaelhárítás

### Gyakori problémák:

**"Invalid API key" hiba:**
- Ellenőrizd, hogy helyesen másoltad-e a kulcsokat
- Győződj meg róla, hogy a `.env.local` fájl a projekt gyökerében van

**"RLS policy" hiba:**
- Ellenőrizd, hogy futott-e le a `supabase-schema.sql`
- Győződj meg róla, hogy be vagy jelentkezve Clerk-rel

**"User not found" hiba:**
- Ellenőrizd, hogy a Clerk user ID helyesen van-e átadva
- Nézd meg a `users` táblát a Supabase dashboard-ban

### Debug mód:
```javascript
// A konzolban láthatod a Supabase hívásokat
console.log('Supabase response:', response);
```

## 10. Produkciós telepítés

1. **Vercel/Netlify**: Add hozzá a környezeti változókat
2. **Domain**: Állítsd be a custom domain-t a Supabase-ben
3. **SSL**: Automatikusan működik
4. **Monitoring**: Használd a Supabase dashboard monitoring funkcióit

## Költségek

- **Free tier**: 500MB adatbázis, 50MB fájl tárhely, 2GB sávszélesség
- **Pro tier**: $25/hó - nagyobb limiték
- **Team tier**: $599/hó - csapat funkciók

A jelenlegi projekthez a **Free tier** tökéletesen elég!
