# מדריך פריסה מלא — GitHub, Vercel, Firebase

## האם צריך Firebase?

**לא חובה.** האפליקציה עובדת מצוין בלי Firebase — כל מכשיר ישמור את ההתקדמות מקומית (localStorage).

| | בלי Firebase | עם Firebase |
|---|---|---|
| התחלה מיידית | ✅ | דרוש 10-15 דק' הגדרה |
| עובד אוף-ליין | ✅ | ✅ |
| סנכרון בין מכשירים | ❌ (כל מכשיר נפרד) | ✅ |
| גיבוי בענן | ❌ | ✅ |
| התחברות עם Google | ❌ | ✅ |
| עלות | חינם | חינם (במסגרת ה-Spark plan) |

**המלצה:** התחילי בלי Firebase, וודאי שהאפליקציה עובדת ב-Vercel, ואחר כך הוסיפי Firebase. תמיד אפשר להוסיף.

---

## שלב 1: העלאה ל-GitHub

### 1.1 יצירת repository

1. פתחי את https://github.com והיכנסי לחשבון.
2. בפינה ימין למעלה: **+** → **New repository**.
3. **Repository name:** `bagrut-english` (או כל שם)
4. בחרי **Private** (מומלץ — הילדים שלך, לא חייב להיות פומבי).
5. **אל תסמני** את "Add a README" / "Add .gitignore" / "Choose a license" — יש לנו כבר.
6. לחצי **Create repository**.

### 1.2 דחיפת הקוד

GitHub יציג לך עמוד עם הוראות. השתמשי בבלוק "**push an existing repository**", או פשוט הריצי בטרמינל:

```bash
cd "/Users/shiratgoldstein/Documents/בגרות באנגלית יעקב/bagrut-app"

# מנקה אם נשארו שאריות מהסשן הקודם
rm -rf .git

# יוצר repo חדש ודוחף
git init -b main
git add -A
git commit -m "Initial commit: Bagrut English study app"
git remote add origin https://github.com/YOUR_USERNAME/bagrut-english.git
git push -u origin main
```

החליפי את `YOUR_USERNAME` ב-username שלך ב-GitHub. ב-`git push` ראשון GitHub יבקש ממך אימות — Mac בדרך כלל יקפיץ דיאלוג Login. אם לא, תצטרכי [Personal Access Token](https://github.com/settings/tokens) במקום סיסמה.

### 1.3 ודאי שהעלייה הצליחה

רענני את עמוד ה-repo ב-GitHub — את צריכה לראות את כל הקבצים (`app/`, `lib/`, `package.json` וכו').

---

## שלב 2: פריסה ל-Vercel

### 2.1 חיבור החשבון

1. פתחי https://vercel.com והירשמי עם **Continue with GitHub** (הכי קל).
2. אשרי לוורסל גישה ל-repo שלך (אפשר לבחור רק את `bagrut-english`).

### 2.2 פריסת הפרויקט

1. בדאשבורד של Vercel: **Add New...** → **Project**.
2. ברשימת ה-repos שלך, לחצי **Import** ליד `bagrut-english`.
3. בעמוד ה-Configure:
   - **Framework Preset:** Next.js (אמור להיבחר אוטומטית — אם לא, בחרי).
   - **Root Directory:** לחצי **Edit** ליד Root Directory ובחרי `bagrut-app`. ⚠️ זה קריטי! אם לא תעשי את זה הפריסה תיכשל כי הפרויקט הוא בתת-תיקייה.
   - **Build / Output Settings:** השאירי כפי שהן (Next.js יודע לבד).
   - **Environment Variables:** רק אם את משתמשת ב-Firebase (שלב 3 בהמשך). אם לא — דלגי.
4. לחצי **Deploy**.
5. הפריסה לוקחת 1-3 דקות. תראי לוגים בזמן אמת.
6. בסוף תקבלי 🎉 + כפתור **Visit** + URL כמו `https://bagrut-english.vercel.app`.

### 2.3 פתחי את האפליקציה!

לחצי Visit. את אמורה לראות את עמוד יצירת הפרופיל. צרי פרופיל לילד הראשון, בחרי רמה, התחילי לתרגל. אם הכול עובד — הצלחה. את יכולה לעצור כאן או להמשיך ל-Firebase.

---

## שלב 3: Firebase (אופציונלי)

זמן: ~10-15 דקות.

### 3.1 יצירת פרויקט Firebase

1. https://console.firebase.google.com
2. **Add project** (או "Create a project" אם זה הראשון).
3. **Project name:** `bagrut-english` (או מה שתרצי). **Continue**.
4. **Google Analytics:** כבי את המתג (לא צריך). **Continue** → **Create project**.
5. ממתינים ~30 שניות → **Continue**.

### 3.2 הפעלת Authentication

1. בתפריט שמאל: **Build** → **Authentication** → **Get started**.
2. לשונית **Sign-in method**.
3. בחרי **Google** מהרשימה → לחצי **Enable**.
4. **Project support email:** האימייל שלך (shirgdev@gmail.com).
5. **Save**.

### 3.3 הפעלת Firestore Database

1. בתפריט שמאל: **Build** → **Firestore Database** → **Create database**.
2. **Location:** בחרי `eur3 (Europe)` או `eur5` (קרוב לישראל). **Next**.
3. בחרי **Start in production mode**. **Create**.
4. ממתינים ~30 שניות.

### 3.4 הגדרת חוקי Firestore

מבטיח שכל משתמש יכול לקרוא/לכתוב רק לנתונים שלו.

1. ב-Firestore Database: לשונית **Rules**.
2. מחקי את כל הטקסט והדביקי:

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

3. לחצי **Publish**.

### 3.5 רישום Web App ושליפת המפתחות

1. למעלה משמאל בקונסול: לחצי על גלגל ⚙️ → **Project settings**.
2. גוללי למטה ל-**Your apps**.
3. לחצי על האייקון `</>` (Web).
4. **App nickname:** `bagrut-app-web`. אל תסמני "Firebase Hosting". **Register app**.
5. תקבלי בלוק קוד שנראה ככה:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "bagrut-english.firebaseapp.com",
  projectId: "bagrut-english",
  storageBucket: "bagrut-english.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

📋 **שמרי את הבלוק הזה** — נשתמש בו עוד שנייה. אפשר להעתיק לפתק.

לחצי **Continue to console**.

### 3.6 הוספת המשתנים ל-Vercel

1. Vercel → הפרויקט שלך → **Settings** → **Environment Variables**.
2. הוסיפי 6 משתנים — לכל ערך מ-`firebaseConfig` יש משתנה תואם:

| Key (Vercel) | Value (מ-firebaseConfig) |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | apiKey |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | authDomain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | projectId |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | storageBucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | appId |

לכל משתנה: שם, ערך, ובחרי **Production, Preview, Development** (כל השלושה). **Save**.

### 3.7 הוספת הדומיין של Vercel ל-Firebase

זה קריטי — בלי זה Google login יחזיר שגיאת auth/unauthorized-domain.

1. Firebase Console → **Authentication** → לשונית **Settings** → **Authorized domains**.
2. **Add domain** → הקלידי את הדומיין שלך מ-Vercel: `bagrut-english.vercel.app` (בלי https://).
3. **Add**.

### 3.8 Redeploy

המשתנים החדשים נכנסים לתוקף רק אחרי בנייה מחדש.

1. Vercel → **Deployments**.
2. על הפריסה האחרונה: לחצי על שלוש הנקודות (...) → **Redeploy**.
3. בחרי "Use existing Build Cache" (מהיר יותר). **Redeploy**.
4. ~1 דקה ויש פריסה חדשה עם Firebase.

### 3.9 בדיקה

1. פתחי את האפליקציה.
2. בעמוד הפרופיל: לחצי **התחבר עם Google** → בחרי חשבון.
3. צרי פרופיל לילד — עכשיו הוא נשמר ב-Firestore.
4. פתחי את האפליקציה במכשיר אחר (טלפון), התחברי עם אותו חשבון Google — הפרופיל יופיע.

---

## פתרון בעיות נפוצות

**"Module not found" בפריסת Vercel**
שכחת להגדיר Root Directory ל-`bagrut-app`. Settings → General → Root Directory → bagrut-app → Save → Redeploy.

**"auth/unauthorized-domain" כשמתחברים עם Google**
דלגת על שלב 3.7. הוסיפי את הדומיין של Vercel ל-Authorized domains ב-Firebase.

**"Permission denied" על Firestore**
חוקי ה-Firestore לא נשמרו או לא תקינים. חזרי על שלב 3.4.

**הפרופילים לא מסתנכרנים בין מכשירים**
ודאי שהתחברת עם Google בשני המכשירים (אותו חשבון). פרופילי "אורח" נשמרים מקומית בלבד.

**שינית קוד מקומית — איך מעלים את העדכון?**
```bash
cd "/Users/shiratgoldstein/Documents/בגרות באנגלית יעקב/bagrut-app"
git add -A
git commit -m "Update: <תיאור השינוי>"
git push
```
Vercel יזהה אוטומטית ויפרוס מחדש.

---

## קישורים שימושיים

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Firebase Console](https://console.firebase.google.com)
- [GitHub](https://github.com)
- מסמך הפרויקט הראשי: [README.md](./README.md)
