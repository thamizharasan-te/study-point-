# Study Point — Tuition Centre & Nursery Website

Point Pedro மற்றும் Vathiry கிளைகளுக்கான Study Point இணையத்தளம், நிர்வாகப் பக்கத்துடன்.

**Tech:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (database, login, photo storage) · Vercel

| பகுதி | விளக்கம் |
|---|---|
| பொதுப் பக்கங்கள் | Home, About Us, Nursery, Study Point Classes, Gallery (lightbox), Contact. எல்லாம் ஆங்கிலத்தில், மொபைலுக்கு முன்னுரிமை |
| எல்லாப் பக்கங்களிலும் | மிதக்கும் WhatsApp பொத்தான், "Enquire Now" pop-up படிவம் |
| `/admin` | Supabase email + password உள்நுழைவு, அனுமதிக்கப்பட்ட நிர்வாகிகள் மட்டும் |
| பாதுகாப்பு | Row level security, honeypot, rate limiting (ஒரு IP-க்கு மணிக்கு 3 / நாளுக்கு 8 விசாரணைகள்) |

---

## 1. கோப்புறை அமைப்பு

```
study-point-/
├─ design/                    வடிவமைப்பு மாதிரிப் படம்
├─ public/placeholders/       தற்காலிகப் படங்கள் (பின்னர் admin-ல் இருந்து மாற்றலாம்)
├─ scripts/make-placeholders.mjs
├─ supabase/                  ← Supabase SQL (கீழே படி 3)
│  ├─ schema.sql              அட்டவணைகள்
│  ├─ policies.sql            row level security
│  ├─ storage.sql             "gallery" படக் கூடை
│  ├─ seed.sql                மாதிரித் தரவு (SAMPLE என்று குறிக்கப்பட்டது)
│  └─ add_admin.sql           நிர்வாகியைச் சேர்க்க
├─ src/
│  ├─ app/(site)/             பொதுப் பக்கங்கள்
│  ├─ app/admin/              நிர்வாகப் பக்கங்கள் (login + (panel)/…)
│  ├─ app/api/enquiry/        விசாரணைப் படிவம் API (honeypot + rate limit)
│  ├─ components/             UI கூறுகள் (home/, admin/ உட்பட)
│  ├─ lib/                    தரவு, supabase clients, சரிபார்ப்பு, உதவிகள்
│  └─ middleware.ts           /admin பாதுகாப்பு
├─ .env.example
└─ README.md
```

## 2. கணினியில் ஓட்டிப் பார்க்க

```bash
npm install
cp .env.example .env.local     # பின் படி 4-ன்படி நிரப்பவும்
npm run dev                    # http://localhost:3000
```

Supabase இல்லாமலும் தளம் ஓடும். அப்போது மாதிரி உள்ளடக்கம் (`src/lib/defaults.ts`) காட்டப்படும்; விசாரணைப் படிவமும் admin-ம் Supabase இணைந்த பின்னரே வேலை செய்யும்.

---

## 3. Supabase திட்டம் உருவாக்குதல்

1. <https://supabase.com> → **Start your project** → GitHub அல்லது email மூலம் உள்நுழை.
2. **New project** அழுத்து.
   - **Name:** `study-point`
   - **Database Password:** வலுவான கடவுச்சொல் இட்டு, பாதுகாப்பான இடத்தில் எழுதி வை.
   - **Region:** இலங்கைக்கு அருகில் உள்ள **Southeast Asia (Singapore)** தேர்ந்தெடு.
3. திட்டம் தயாராக 1–2 நிமிடம் ஆகும்.
4. இடது பக்கம் **SQL Editor** → **New query**. கீழ்க்கண்ட கோப்புகளின் உள்ளடக்கத்தை **இதே வரிசையில்** ஒவ்வொன்றாக ஒட்டி **Run** அழுத்து. ஒவ்வொன்றும் "Success" என்று வர வேண்டும்:
   1. `supabase/schema.sql`
   2. `supabase/policies.sql`
   3. `supabase/storage.sql`
   4. `supabase/seed.sql`

   (எல்லாம் மீண்டும் ஓட்டினாலும் பாதுகாப்பானவை; ஏற்கனவே திருத்திய தரவை அழிக்காது.)

## 4. சூழல் மாறிகள் (environment variables)

Supabase → **Project Settings** (கியர் ஐகான்) → **API** பக்கத்தில்:

| `.env.local` / Vercel பெயர் | எங்கே கிடைக்கும் | குறிப்பு |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** | பொதுவானது |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **anon / publishable** key | உலாவியில் பயன்படுத்தலாம் |
| `SUPABASE_SERVICE_ROLE_KEY` | **service_role / secret** key | ⚠️ **ரகசியம்.** யாரிடமும் பகிராதே, GitHub-ல் இடாதே |
| `NEXT_PUBLIC_SITE_URL` | உன் இணையத்தள முகவரி, எ.கா. `https://studypoint.lk` | SEO, sitemap, share படத்துக்கு |
| `ENQUIRY_IP_SALT` | ஏதாவது நீண்ட random எழுத்துகள் | spam தடுப்புக்கு |

`.env.example` நகலெடுத்து `.env.local` என்று பெயரிட்டு நிரப்பு. `.env.local` Git-ல் சேராது.

## 5. முதல் நிர்வாகப் பயனரை உருவாக்குதல்

நிர்வாகியாக ஆக **இரண்டு** விஷயங்கள் தேவை: (அ) Supabase பயனர் கணக்கு, (ஆ) அனுமதிப் பட்டியலில் (allow-list) அவரது email.

1. Supabase → **Authentication → Users → Add user → Create new user**
   - Email: நிர்வாகியின் email
   - Password: தற்காலிகக் கடவுச்சொல் (பின்னர் admin-ல் மாற்றலாம்)
   - **Auto Confirm User** ✅ டிக் இடு
2. `supabase/add_admin.sql` திறந்து `owner@example.com` என்பதை **அதே email-ஆல் (சிறிய எழுத்துகளில்)** மாற்றி, SQL Editor-ல் ஓட்டு.
3. **முக்கியம் — பொதுப் பதிவை நிறுத்து:** Authentication → **Sign In / Providers** (அல்லது Settings) → **"Allow new users to sign up"** ஐ **Off** ஆக்கு. (அனுமதிப் பட்டியல் இல்லாதவரால் எதுவும் செய்ய முடியாது என்றாலும், இது கூடுதல் பாதுகாப்பு.)
4. `/admin` சென்று உள்நுழை.

மேலும் ஒருவரைச் சேர்க்க: படி 1 + 2 மீண்டும். நீக்க: `delete from public.admin_users where email = '...';`

## 6. Vercel-ல் வெளியிடுதல்

1. இந்தக் குறியீடு GitHub repo-வில் `main` branch-ல் இருக்க வேண்டும் (pull request-ஐ merge செய்).
2. <https://vercel.com> → **Add New… → Project** → `study-point-` repo-வுக்கு **Import**.
   - Repo பட்டியலில் தெரியவில்லையா? GitHub → Settings → Applications → **Installed GitHub Apps → Vercel → Configure** → Repository access-ல் `study-point-` ஐச் சேர்த்து Save.
3. **Framework Preset:** Next.js (தானாகத் தெரியும்). Build settings மாற்ற வேண்டாம்.
4. **Environment Variables** பகுதியில் படி 4-ன் ஐந்து மாறிகளையும் சேர் (**Deploy அழுத்தும் முன்!** `NEXT_PUBLIC_…` மாறிகள் build நேரத்தில் தேவை).
5. **Deploy** அழுத்து. சுமார் 1–2 நிமிடத்தில் `https://…vercel.app` முகவரி கிடைக்கும்.
6. Domain சேர்க்க: Project → **Settings → Domains**. பிறகு `NEXT_PUBLIC_SITE_URL`-ஐ உண்மை முகவரியாக மாற்றி **Redeploy** செய்.
7. Supabase → **Authentication → URL Configuration → Site URL** இலும் அதே முகவரியை இடு.

---

## 7. நிர்வாகப் பக்கம் — என்ன செய்யலாம்

| பிரிவு | செய்யக்கூடியவை |
|---|---|
| **Enquiries** | எல்லா விசாரணைகள்; New / Contacted / Joined என்று குறித்தல்; **Open WhatsApp chat** பொத்தான் (பெற்றோரின் எண்ணுக்கு நேரடி chat); Call; அழித்தல் |
| **Gallery** | படங்களை ஏற்றுதல் (உலாவியே படத்தைச் சிறிதாக்கி WebP ஆக்கும்), Up/Down மூலம் வரிசை மாற்றுதல், ஆல்பம் பெயர் + விளக்கம் (alt text), அழித்தல் |
| **Parent Comments** | சேர்த்தல், திருத்துதல், Show/Hide, அழித்தல் |
| **Numbers** | பிள்ளைகள், அனுபவ ஆண்டுகள், கிளைகள், பெற்றோர் திருப்தி |
| **Branches** | முகவரி, தொலைபேசிகள், WhatsApp எண், நேரம், வரைபடத் தொடுப்பு |
| **Website Text** | முகப்புத் தலைப்பு, Nursery / Classes பாடப் பட்டியல்கள் |
| **Announcements** | எல்லாப் பக்கங்களின் மேலே காட்டும் குறுகிய அறிவிப்பு |
| **Password** | தன் கடவுச்சொல்லை மாற்றுதல் |

## 8. ⚠️ வாடிக்கையாளர் உறுதிசெய்ய வேண்டிய இடம்நிரப்பிகள்

கீழ்க்கண்டவை **உண்மைத் தரவு அல்ல**. தளத்தில் "Sample — to be confirmed" என்ற மஞ்சள் குறியுடன் தெரியும். உண்மையானதை இட்டு "Confirmed" டிக் செய்தால் குறி மறையும்:

- [ ] **Numbers:** 500+ மாணவர்கள், 10+ ஆண்டுகள், 2 கிளைகள், 95% திருப்தி — எல்லாம் மாதிரி எண்கள்
- [ ] **Parent Comments:** 3 மாதிரிக் கருத்துகள் — உண்மைப் பெற்றோர் அல்ல. உண்மைக் கருத்துகளை (பெற்றோர் அனுமதியுடன்) இடு
- [ ] **Branches:** தொலைபேசி எண்கள் (0767666826 / 0767666827) வடிவமைப்பில் இருந்து எடுத்தவை — சரிபார். முகவரிகள், நேரங்கள், வரைபடம் இடம்நிரப்பிகள்
- [ ] **Gallery:** 8 தற்காலிக விளக்கப் படங்கள் — உண்மைப் படங்களை ஏற்றி இவற்றை அழி
- [ ] **Hero / About / Nursery / Classes பக்க எழுத்துகள்:** பொதுவான மாதிரி எழுத்து — வாடிக்கையாளர் படித்து ஒப்புதல் அளிக்க வேண்டும்
- [ ] **Logo:** தற்காலிக லோகோ (`src/components/Logo.tsx`). உண்மை லோகோ வந்ததும் மாற்று
- [ ] **முதன்மைப் படங்கள்:** `public/placeholders/*.svg` (hero, nursery, classes, why, about). உண்மைப் புகைப்படங்களை `public/` கீழ் இட்டு `src/components/home/*` மற்றும் பக்கங்களில் `src` பாதையை மாற்று
- [ ] **Social media:** Facebook / Instagram / YouTube தொடுப்புகள் இன்னும் இல்லை (அடிக்குறிப்பில் சேர்க்கவில்லை)

**"Watch Our Story"** பகுதி காணொளி வரும் வரை நீக்கப்பட்டுள்ளது. காணொளி வந்ததும் `src/components/home/Hero.tsx`-ல் பொத்தானைச் சேர்க்கலாம்.

---

## 9. பாதுகாப்பு — எப்படி வேலை செய்கிறது

- **விசாரணைப் படிவம்** → `/api/enquiry` (server). அங்கே (1) மறைவு `website` புலம் நிரப்பப்பட்டிருந்தால் (bot) அமைதியாக நிராகரிக்கும், (2) தரவைச் சரிபார்க்கும், (3) IP-யின் salted hash கொண்டு மணிக்கு 3 / நாளுக்கு 8 வரம்பைச் சரிபார்க்கும், (4) பின்னரே Supabase-ல் சேமிக்கும். உண்மையான IP சேமிக்கப்படுவதில்லை.
- **Row level security:** பார்வையாளர்கள் வெளியிடப்பட்ட உள்ளடக்கத்தை மட்டும் படிக்கலாம்; `enquiries` அட்டவணையை அவர்களால் தொடவே முடியாது; எழுத/மாற்ற `admin_users`-ல் உள்ள email வேண்டும்.
- **/admin:** middleware + ஒவ்வொரு பக்கம் + ஒவ்வொரு server action என்று மூன்று இடங்களில் "உள்நுழைந்தவர் + அனுமதிப் பட்டியலில் உள்ளவர்" சரிபார்க்கப்படும். Admin பக்கங்கள் Google-ல் தேடப்படாது (`noindex`, robots).
- **Service-role key** server-ல் மட்டும் (`src/lib/supabase/service.ts`, `server-only`). உலாவிக்குப் போவதில்லை. எந்தத் திறவியும் குறியீட்டில் எழுதப்படவில்லை.

## 10. சிக்கல் தீர்வு

| பிரச்சினை | தீர்வு |
|---|---|
| Admin login-ல் "This account is not allowed" | படி 5-ன் (2) `add_admin.sql` ஓட்டப்படவில்லை, அல்லது email எழுத்துப்பிழை/பெரிய எழுத்து |
| "Wrong email or password" | Authentication → Users-ல் பயனர் இருக்கிறாரா, Auto Confirm செய்யப்பட்டதா என்று பார் |
| விசாரணை அனுப்பினால் "not available right now" | `SUPABASE_SERVICE_ROLE_KEY` Vercel-ல் இல்லை; சேர்த்து Redeploy செய் |
| படம் ஏற்றினால் பிழை | `supabase/storage.sql` ஓட்டப்படவில்லை; படம் 5 MB-க்குள் இருக்க வேண்டும் |
| புதிதாக ஏற்றிய படங்கள் மெதுவாக / உகப்பாக்கப்படவில்லை | `NEXT_PUBLIC_SUPABASE_URL`-ஐ மாற்றிய பின் Redeploy செய்யவில்லை |
| Admin மாற்றம் தளத்தில் தெரியவில்லை | உடனே தெரியும் (cache தானாகப் புதுப்பிக்கப்படும்); உலாவியை refresh செய் |
| Vercel-ல் repo தெரியவில்லை | படி 6.2-ல் உள்ள GitHub app அனுமதி |

## 11. Developer notes

- `npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck`
- பொதுப் பக்கங்கள் ISR (`revalidate = 60`); admin செயல்கள் `revalidatePath` மூலம் உடனே புதுப்பிக்கும்.
- Supabase அமைக்கப்படாவிட்டால் `src/lib/data.ts` → `src/lib/defaults.ts` மாதிரி உள்ளடக்கத்துக்கு மாறும்.
- தற்காலிகப் படங்களை மீண்டும் உருவாக்க: `node scripts/make-placeholders.mjs`
- நிறங்கள்: `tailwind.config.ts` (`brand.green`, `brand.pink`, `brand.navy`, `brand.cream`). எழுத்துருக்கள்: Playfair Display (தலைப்புகள்), Nunito (உரை), Kaushan Script (லோகோ), Noto Sans Tamil (admin தமிழ் வரிகள்) — எல்லாம் npm மூலம் self-host (@fontsource).
