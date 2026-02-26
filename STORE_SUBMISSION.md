# App Store & Play Store Submission Checklist

This document helps you address common rejection reasons (2.1, 4.0 Design, 5.1.1 Privacy).

---

## 5.1.1 Legal: Privacy – Data Collection and Storage

### Browsing without login (Account Sign-In)

**Done in the app:**
- **Splash** always goes to **Home** first. Users can browse **Home** (categories, popular services), **Packages**, and **Add** (category list) **without signing in**.
- **Sign-in is required only for**: booking a service (when they tap a category to book), **Orders** tab, and **Account** tab. Those screens show a “Sign in” prompt if the user is not logged in.
- **PrivacyInfo.xcprivacy** (iOS): Declares collected data types and purpose (App Functionality). No tracking.
- **Login screen**: Explicit consent text and Privacy Policy link.
- **Privacy Policy URL**: Set in `app.json` → `extra.privacyPolicyUrl`. Replace with your real hosted URL if different.

**You must do in the store:**
1. Host a real **Privacy Policy** at the URL in the app. Complete **App Privacy** (Nutrition Label) in App Store Connect and set **Privacy Policy URL** in App Information.
2. Google Play: add the same privacy policy URL under App content.

---

## 2.1 Information Needed – Demo Account

**Important:** This app uses **phone number + OTP** to sign in. It does **not** use email/password.

**Done in the app:**
- **“Try demo (no sign-in)”** on the **Welcome** screen. App Review can tap this to enter the app as a demo user (no phone or OTP) and browse all tabs, including Orders and Account. Booking may still require a real account depending on your backend.
- **Verify** and **Support** copy updated so there are no email/password placeholders.

**You must do in App Store Connect:**
1. **App Review Information** → **Sign-in required**:
   - Either leave a note such as:  
     **“Sign-in: This app uses phone number + OTP. For full access without SMS, use the ‘Try demo (no sign-in)’ button on the Welcome screen to browse the app as a demo user.”**
   - Or provide a **test phone number** (e.g. +966XXXXXXXX) that receives OTP, and in **Notes** explain: “Use this phone number; you will receive an OTP via SMS.”
2. **Do not** provide email/password as the only demo credentials; reviewers will not be able to sign in.

---

## 4.0 Design – iPad and Preamble

### iPad (Guideline 4.0 – screen size/resolution)

**Done in the app:**
- **`app.json`** → **`ios.supportsTablet`** set to **`true`** so the app runs on iPad.
- **Layout**: Main tab screens (Home, Orders, Account, etc.) use a max content width (~600pt) on large screens so the UI doesn’t over-stretch on iPad.

**You should do:**
- Test on **iPad** (e.g. iPad Air 11-inch) in Xcode Simulator or on device to confirm layout and navigation.

### Preamble (description and metadata)

**You should do:**
1. **App Store Connect** → **Description / Promotional Text**: Clear description of Drill Customer (home services, book instant/scheduled, track provider). No placeholder text.
2. **Screenshots**: Real app screens; no “coming soon” placeholders.
3. First screens (splash → home or welcome) should look complete and on-brand.

---

## Quick reference

| Item | Where | Action |
|------|--------|--------|
| Privacy policy URL | Hosted page + `app.json` → `extra.privacyPolicyUrl` | Must be live and match app |
| Demo / sign-in for review | App Store Connect → App Review Information | Use “Try demo” instructions or test phone + OTP; do not use email/password only |
| iPad support | `app.json` → `ios.supportsTablet` | Set to `true`; layout uses max width on large screens |
| App description | App Store Connect | Clear, complete, no placeholders |
| iOS Rate Us | `config.ts` → `APP_STORE_ID` | Set after app is on the App Store |
