# אנגלית בגרות - מודול E 📘

אפליקציית למידה לבגרות באנגלית - מודול E (מתאימה ל-3, 4 ו-5 יחידות).
בנויה ב-Next.js 14 + TypeScript + Tailwind, עם Firebase (אופציונלי) לסנכרון בין מכשירים.

## התחלה מהירה (שלב אחד)

```bash
cd bagrut-app
npm install
npm run dev          # http://localhost:3000

# לדחיפה ל-GitHub פעם ראשונה:
rm -rf .git              # מנקה אם נשאר משהו
git init -b main
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## תכונות

- **5 משחקים שונים**: פלאשקארדים חכמים (SR), Multiple Choice, משחק זיווג, השלמת משפטים, ותרגול בגרות (קטעי קריאה).
- **חזרה מרווחת (SM-2)**: האלגוריתם בוחר אוטומטית את המילים שצריך לחזור עליהן עכשיו - מקסימום למידה ב-10 שעות.
- **מילים ידועות אוטומטית**: מילה שענית עליה נכון 3 פעמים עוברת לרשימת "ידועות" ופחות מופיעה - מצמצם את כמות הלמידה.
- **רב-פרופילים**: אפשר ללמוד באותה אפליקציה ברמות שונות (3/4/5 יחידות) וגם במסלול **אנגלית בסיסי לאוניברסיטה** 🎓 — רשימת מילים נפרדת, קריאה, תרגום ותרגול אנסין אקדמי.
- **Firebase + מצב אורח**: עם Firebase - סנכרון בין טלפון/מחשב/אייפד. בלי Firebase - הכל נשמר ב-localStorage.
- **RTL מלא בעברית** עם דוגמאות באנגלית ובעברית לכל מילה.

## התקנה מקומית

```bash
cd bagrut-app
npm install
npm run dev
```

האפליקציה תרוץ על http://localhost:3000

האפליקציה עובדת מצוין גם **בלי Firebase** - מצב אורח שומר הכל בדפדפן.

## הגדרת Firebase (אופציונלי)

1. היכנסי ל-[Firebase Console](https://console.firebase.google.com) ותיצרי פרויקט חדש.
2. **Authentication** -> Get Started -> Sign-in method -> הפעילי **Google**.
3. **Firestore Database** -> Create database -> Start in production mode -> בחרי אזור (eur3 או us-central).
4. בכללי Firestore (`Rules`), העתיקי:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```
5. **Project Settings** -> General -> Your apps -> Web app (`</>`) -> Register app.
6. העתיקי את ערכי ה-`firebaseConfig`.
7. צרי קובץ `.env.local` (העתק מ-`.env.local.example`) ומלאי את הערכים:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
8. הריצי `npm run dev` מחדש.

## פריסה ל-Vercel

הפריסה ל-Vercel היא הקלה ביותר:

1. דחפי את הקוד ל-GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git branch -M main
   git push -u origin main
   ```
2. היכנסי ל-[vercel.com](https://vercel.com) -> Add New -> Project -> בחרי את ה-repo.
3. Framework Preset: **Next.js** (מזוהה אוטומטית).
4. תחת **Environment Variables**, הוסיפי את 6 משתני ה-Firebase שמ-`.env.local`.
5. Deploy.

לאחר הפריסה, בקונסול של Firebase תחת **Authentication** -> Settings -> Authorized domains, הוסיפי את הדומיין של ה-Vercel (למשל `your-app.vercel.app`).

## מבנה הפרויקט

```
bagrut-app/
├── app/
│   ├── games/                # 5 משחקים: flashcards, multiple-choice, matching, completion, reading
│   ├── known-words/          # רשימת מילים ידועות / בלמידה
│   ├── profile/              # יצירה ובחירה של פרופילים
│   ├── layout.tsx            # פריסה ראשית RTL
│   ├── page.tsx              # דשבורד
│   └── globals.css
├── components/
│   ├── Header.tsx
│   └── ProfileGate.tsx
├── data/
│   ├── vocabulary.ts         # ~400 מילים, 6 יחידות (B1-B6)
│   └── reading.ts            # 5 קטעי קריאה + 20 השלמות משפט
├── lib/
│   ├── auth.tsx              # Context לפרופילים
│   ├── firebase.ts
│   ├── spacedRepetition.ts   # SM-2
│   ├── storage.ts            # Firestore + localStorage fallback
│   └── types.ts
└── package.json
```

## איך זה עובד - בקצרה

- **פרופיל**: בעת הכניסה הראשונה, יוצרים פרופיל לכל ילד עם שם, אמוג'י, ורמה (3/4/5 יחידות). כל פרופיל שומר את ההתקדמות שלו בנפרד.
- **חזרה מרווחת**: כל פעם שעונים על מילה (במשחק כלשהו), האלגוריתם מעדכן את ה-ease factor ואת זמן החזרה הבא של המילה. הפלאשקארדים והמשחקים בוחרים תמיד את המילים שהכי דחוף לחזור עליהן.
- **מילים ידועות**: אחרי 3 תשובות נכונות, המילה מסומנת אוטומטית כ"ידועה" ויוצאת מהמאגר הפעיל (אפשר לראות אותה ב-"המילים שלי" ולהחזיר אותה ידנית).
- **טקסטים**: התרגול הוא בסגנון בגרות אמיתי - 4 שאלות אמריקאיות לכל קטע + הסבר אחרי הבדיקה.

## טיפים ללמידה ב-10 שעות

1. **התחילי בפלאשקארדים** - הכי יעיל. 15-20 דקות ביום.
2. **השלמת משפטים** - מאוד קרוב למה שיהיה בבגרות.
3. **תרגול בגרות** - לפחות 2-3 קטעים ביום בשבוע האחרון.
4. **משחק זיווג** - מצוין כשיש 5 דקות פנויות.
5. כשמילה עוברת ל-"ידועות", זה הסימן שאתה מוכן/ה - אבל אל תפסיקי לתרגל את כולן ביחד באמת בשבוע שלפני.

בהצלחה! 🍀
