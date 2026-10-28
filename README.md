# Study Point — Tuition Centre & Kindergarten Website

Point Pedro மற்றும் Vathiry கிளைகளுக்கான Study Point இணையத்தளம், நிர்வாகப் பக்கத்துடன்.

**Tech:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase (database, login, photo storage) · Vercel

| பகுதி | விளக்கம் |
|---|---|
| பொதுப் பக்கங்கள் | Home, About Us, Early Years (Kindergarten), Study Point Classes, Gallery (lightbox), Contact. எல்லாம் ஆங்கிலத்தில், மொபைலுக்கு முன்னுரிமை |
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
   5. `supabase/analytics.sql` (பார்வையாளர் எண்ணிக்கைக்கு, விருப்பம்; /admin → Visitors)

   (எல்லாம் மீண்டும் ஓட்டினாலும் பாதுகாப்பானவை; ஏற்கனவே திருத்திய தரவை அழிக்காது.)

   **பின்னால் தேவைப்படும் சிறு கோப்புகள்** (ஏற்கனவே தளம் இயங்கும்போது, தேவையானபோது மட்டும்):
   - `supabase/applications.sql` — **"Apply" பக்கத்தின் விண்ணப்பங்களுக்கு** (ஒருமுறை ஓட்ட வேண்டும்): applications அட்டவணை, admin மட்டும் பார்க்கும் அனுமதி, பிள்ளையின் ஆவணங்களுக்கான **தனிப்பட்ட (private)** storage, PDF படிவத்துக்கான storage.
   - `supabase/update_wording.sql` — தளத்தின் புது முகப்புத் தலைப்பு / Kindergarten, Classes பட்டியல் வார்த்தைகள் தெரிய, பழைய சேமித்த உரையை நீக்கும் (படங்கள், கிளைகள், எண்கள் தொடாது).
   - `supabase/confirm_stats.sql` — முகப்பு எண்களை "உறுதி செய்யப்பட்டவை" என்று குறிக்கும் (அல்லது admin → Numbers-ல் tick).
   - `supabase/schema.sql`-ஐ மீண்டும் ஓட்டினால் தமிழ்ப் பெட்டிகள் (admin-ல்) கிடைக்கும்; கடைசியில் `notify pgrst, 'reload schema';` இருப்பதால் உடனே வேலை செய்யும்.

## 4. சூழல் மாறிகள் (environment variables)

Supabase → **Project Settings** (கியர் ஐகான்) → **API** பக்கத்தில்:

| `.env.local` / Vercel பெயர் | எங்கே கிடைக்கும் | குறிப்பு |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** | பொதுவானது |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **anon / publishable** key | உலாவியில் பயன்படுத்தலாம் |
| `SUPABASE_SERVICE_ROLE_KEY` | **service_role / secret** key | ⚠️ **ரகசியம்.** யாரிடமும் பகிராதே, GitHub-ல் இடாதே |
| `NEXT_PUBLIC_SITE_URL` | உன் இணையத்தள முகவரி, எ.கா. `https://studypoint.lk` | SEO, sitemap, share படத்துக்கு |
| `ENQUIRY_IP_SALT` | ஏதாவது நீண்ட random எழுத்துகள் | spam தடுப்புக்கு |
| `SHOW_SAMPLE_CONTENT` | *(விருப்பம்)* `false` (இயல்பு) | `true` ஆக்கினால் மட்டும் மாதிரி உள்ளடக்கம் "Sample" குறியுடன் தெரியும் (பகுதி 8) |

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
| **Applications** | பெற்றோர் **/apply** பக்கத்தில் நிரப்பிய சேர்க்கை விண்ணப்பங்கள் (பிள்ளை, பெற்றோர், அவசரத் தொடர்பு, புகைப்படம், பிறப்புச் சான்றிதழ்). ஆவணங்கள் admin மட்டுமே திறக்கும் தற்காலிக இணைப்புகளில். New / Contacted / Accepted / Declined என்று குறித்தல், அலுவலகக் குறிப்பு, WhatsApp, Call, அழித்தல் (ஆவணங்களும் அழியும்). **அச்சிடும் PDF படிவத்தை** இங்கே ஏற்றினால் தளத்தில் "Download printable form" பொத்தான் வரும் |
| **Visitors** | தளத்தைப் பார்த்தவர்கள்: இன்று / 7 நாள் / 30 நாள், 30 நாள் வரைபடம், அதிகம் பார்த்த பக்கங்கள், போன் vs கணினி, எங்கிருந்து வந்தார்கள் (IP, cookie சேமிக்காத, அநாமதேய எண்ணிக்கை) |
| **Gallery** | **ஒரே நேரத்தில் பல படங்கள்** (drag & drop, 60 வரை; ஒவ்வொன்றும் 4:3 வடிவத்துக்குத் தானாக வெட்டப்பட்டு WebP ஆக்கப்படும்), Up/Down மூலம் வரிசை (முகப்பில் முதல் 6 படங்கள் காட்டப்படும்), ஆல்பம் பெயர் + விளக்கம் (alt text), அழித்தல் |
| **Main Pictures** | முகப்பு hero (11:8), Kindergarten, Classes (8:7), About (10:7.6) படங்கள் — எந்த அளவுப் படத்தையும் ஏற்றலாம், தானாக அந்த வடிவத்துக்கு வெட்டப்படும், அதனால் தள அமைப்பு மாறாது. **லோகோ**: icon மட்டும் அல்லது பெயருடன் முழு லோகோ. "Use the illustration again" மூலம் பழைய நிலைக்குத் திரும்பலாம் |
| **Theme** | 7 நிறத் தீம்களில் ஒன்றைத் தேர்ந்தால் தளத்தின் எல்லா நிறங்களும் (header, பொத்தான்கள், footer…) ஒரே நேரத்தில் மாறும் |
| **Parent Comments** | சேர்த்தல், திருத்துதல், Show/Hide, அழித்தல் |
| **Numbers** | பிள்ளைகள், அனுபவ ஆண்டுகள், கிளைகள், பெற்றோர் திருப்தி |
| **Branches** | முகவரி, தொலைபேசிகள், WhatsApp எண், நேரம், வரைபடத் தொடுப்பு |
| **Website Text** | முகப்புத் தலைப்பு, Kindergarten / Classes பாடப் பட்டியல்கள், FAQ, **சமூக ஊடக இணைப்புகள்** (Facebook, Instagram, TikTok, YouTube — காலியாக விட்டால் மறையும்; footer, Contact, முகப்பு "Visit Our Updates" பட்டையில் தெரியும்) |
| **Announcements** | எல்லாப் பக்கங்களின் மேலே காட்டும் குறுகிய அறிவிப்பு |
| **Password** | தன் கடவுச்சொல்லை மாற்றுதல் |

## 8. ⚠️ வாடிக்கையாளர் உறுதிசெய்ய வேண்டிய இடம்நிரப்பிகள்

கீழ்க்கண்டவை **உண்மைத் தரவு அல்ல**. அதனால் **பொதுத் தளம் இவற்றை இயல்பாக மறைக்கிறது** (போலி எண்ணிக்கைகளோ போலிக் கருத்துகளோ வெளியே தெரியாது). `/admin`-ல் இவற்றுக்கு "Sample" குறி இருக்கும்; உண்மையானதை இட்டு **Confirmed** டிக் செய்தால் அது தளத்தில் தெரியத் தொடங்கும்.

| உள்ளடக்கம் | பொதுத் தளத்தில் இப்போது | எப்படி வெளிப்படுத்துவது |
|---|---|---|
| **Numbers** (500+, 10+, 2, 95%) மாதிரி எண்கள் | மறைந்திருக்கும். உறுதிசெய்தவை மட்டும் தெரியும் | Admin → Numbers → உண்மை எண் + *Confirmed* |
| **Parent Comments** 3 மாதிரிக் கருத்துகள் | மறைந்திருக்கும். "What Parents Say" பகுதியே வராது | Admin → Parent Comments → உண்மைக் கருத்துச் சேர் (பெற்றோர் அனுமதியுடன்) |
| **Branches** நேரம் | மறைந்திருக்கும் | Admin → Branches → நேரம் + *These details are correct* |
| **Gallery** தற்காலிக விளக்கப் படங்கள் | உண்மைப் படம் எதுவும் இல்லாதபோது மட்டும் தெரியும்; **ஒரு உண்மைப் படம் ஏற்றியதும் தானாக மறையும்** | Admin → Gallery → படம் ஏற்று |

மேலும் உறுதிசெய்ய வேண்டியவை:

- [ ] **தொலைபேசி எண்கள்** (0767666826 / 0767666827) வடிவமைப்பில் இருந்து எடுத்தவை — சரிபார்; **முகவரிகள்** (இப்போது "Point Pedro, Northern Province, Sri Lanka" மட்டும்) முழுமையாக்கு
- [ ] **எழுத்துகள்:** Hero, About, Kindergarten, Classes, **"How to Join" 4 படிகள்** (`src/components/home/HowToJoin.tsx`) மற்றும் **FAQ** — பொதுவான மாதிரி எழுத்து. வாடிக்கையாளர் படித்து ஒப்புதல் அளிக்க வேண்டும். கட்டணம், நேரம், இடம் போன்ற உண்மைகளை FAQ-ல் (Admin → Website Text) சரியாக எழுது
- [ ] **Logo:** தற்காலிக லோகோ (`src/components/Logo.tsx`)
- [ ] **முதன்மைப் படங்கள்:** இப்போது விளக்கப் படங்கள். **Admin → Main Pictures**-ல் உண்மைப் புகைப்படங்களை ஏற்று (code மாற்றம் தேவையில்லை). உன் சொந்த மாணவர்கள்/வகுப்பறைப் படங்களே சிறந்தவை (பெற்றோர் அனுமதியுடன்). இணையத்தில் இருந்து படங்களை எடுத்தால் அவை பதிப்புரிமை இல்லாதவையாக (எ.கா. Unsplash / Pexels உரிமம்) இருக்க வேண்டும்; Google தேடல் படங்களைப் பயன்படுத்த வேண்டாம்
- [ ] **Social media:** Admin → Website Text → "Social media links" (Facebook / Instagram / YouTube). காலியாக விட்டால் ஐகான் தெரியாது

மாதிரி உள்ளடக்கத்தை மதிப்பாய்வுக்காகப் பார்க்க விரும்பினால், Vercel-ல் `SHOW_SAMPLE_CONTENT=true` இட்டு Redeploy செய் (உண்மைத் தளத்தில் வேண்டாம்).

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

## 11. பார்வையாளர் எண்ணிக்கை (Analytics)

தளத்தில் **Vercel Web Analytics** (cookie இல்லாதது, தனிநபர் தகவல் சேகரிக்காதது) இணைக்கப்பட்டுள்ளது. இயக்க: Vercel → உன் project → **Analytics** tab → **Enable**. பின் புதிய deployment-ல் இருந்து எண்ணிக்கை தெரியும். இயக்காவிட்டால் எதுவும் நடக்காது.

## 12. இரு மொழிகள்: English + தமிழ்

- ஆங்கிலப் பக்கங்களின் மேல **"தமிழ்"** பொத்தான் (🌐), தமிழ்ப் பக்கங்களில் **"English"** பொத்தான். அதே பக்கத்திலேயே மொழி மாறும்.
- முகவரிகள்: ஆங்கிலம் `studypointlk.com/about`, தமிழ் `studypointlk.com/ta/about`. Google-க்கு `hreflang` மற்றும் இரு மொழி sitemap உள்ளது.
- **நிலையான எழுத்துகள்** (பட்டியல், பொத்தான்கள், பக்க உரைகள், படிவம்): `src/lib/i18n/en.ts` மற்றும் `ta.ts`. தமிழ் மொழிபெயர்ப்பை ஒரு தமிழ் அறிந்தவர் படித்துத் திருத்துவது நல்லது.
- **Admin-ல நீ மாத்தும் எழுத்துகள்**: ஒவ்வொன்றுக்கும் அருகில் **(தமிழ்)** கட்டம் உள்ளது: Website Text (தலைப்பு, பாடங்கள், FAQ), Branches (முகவரி, நேரம்), Numbers (லேபிள்), Parent Comments, Announcements. தமிழ் கட்டம் காலியாக இருந்தால், இயல்பு உள்ளடக்கத்துக்கு நிலையான தமிழும், உன் சொந்த எழுத்துக்கு ஆங்கிலமும் காட்டப்படும்.
- **முக்கியம் (ஏற்கனவே Supabase அமைத்திருந்தால்):** தமிழ் கட்டங்களுக்கான புதிய நெடுவரிசைகளைச் சேர்க்க `supabase/schema.sql`-ஐ SQL Editor-ல **மீண்டும் ஒருமுறை** ஓட்டு (பாதுகாப்பானது, தரவை அழிக்காது). அதுவரை admin-ல தமிழ்க் கட்டங்களுக்குப் பதிலா ஒரு அறிவிப்பு தெரியும்.
- படிவத்தில் தேர்ந்தெடுக்கும் மதிப்புகள் (பிரிவு, கிளை) எப்போதும் ஆங்கிலத்திலேயே சேமிக்கப்படும், அதனால் admin-ல குழப்பம் வராது.

## 13. Developer notes

- முகப்புப் பக்கத்தில் FAQ-க்கு `FAQPage` JSON-LD (Google rich results) உள்ளது; பாதுகாப்பு headers `next.config.mjs`-ல்.
- முன்பே உருவாக்கிய DB-யைப் புதுப்பிக்க `supabase/schema.sql` மற்றும் `seed.sql`-ஐ மீண்டும் ஓட்டினால் போதும் (FAQ / social keys சேரும்).
- `npm run dev` · `npm run build` · `npm run lint` · `npm run typecheck`
- பொதுப் பக்கங்கள் ISR (`revalidate = 60`); admin செயல்கள் `revalidatePath` மூலம் உடனே புதுப்பிக்கும்.
- Supabase அமைக்கப்படாவிட்டால் `src/lib/data.ts` → `src/lib/defaults.ts` மாதிரி உள்ளடக்கத்துக்கு மாறும்.
- தற்காலிகப் படங்களை மீண்டும் உருவாக்க: `node scripts/make-placeholders.mjs`
- நிறங்கள்: `tailwind.config.ts` (`brand.green`, `brand.pink`, `brand.navy`, `brand.cream`). எழுத்துருக்கள்: Playfair Display (தலைப்புகள்), Nunito (உரை), Kaushan Script (லோகோ), Noto Sans Tamil (admin தமிழ் வரிகள்) — எல்லாம் npm மூலம் self-host (@fontsource).
