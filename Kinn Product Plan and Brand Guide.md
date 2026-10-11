# Kinn: Product Plan and Brand Guide

A social fitness app where friends train together, compete and earn rewards.

Status: Draft 1 · Name "Kinn" is a working name, pending trademark checks.

## 1. The idea in one paragraph

Kinn is a fitness app built around friends, in the way Snapchat is built around friends. You track your workouts, connect your watch and your music, and then share goals, challenges and progress with the people you actually know. Instead of training alone and posting to strangers, you train together, compete in short challenges, and win rewards. The app is simple, fast and elegant, and it feels more like a chat app than a medical dashboard.

**Tagline:** Move together.

## 2. The problem

Most fitness apps are good at one thing and weak at the rest.

- Tracking apps show numbers but are lonely. People quit within weeks because nobody notices.
- Community apps are built for serious athletes and strangers, so casual users feel judged or left out.
- Motivation is weak. Streaks and badges work for a while, then stop meaning anything.
- Data is scattered across watches, music apps and several fitness apps, so nothing feels connected.
- Friends with different fitness levels, devices and goals cannot compete fairly.

## 3. The solution

Kinn puts friends and friendly competition at the centre, and connects everything else around that.

1. **Your data in one place.** Workouts, steps, heart rate, sleep and calories from your phone and watch.
2. **Your music in the workout.** Connect Apple Music, Spotify and others, with playlists that match your activity.
3. **Your friends in the loop.** Add friends, see their activity, send quick reactions and nudges.
4. **Shared goals and challenges.** Set a target together or go head to head.
5. **Rewards on the line.** Stake points or rewards on a challenge, and the winner takes the pot.

## 4. Core features

### 4.1 Fitness data

- Daily dashboard: steps, active minutes, distance, calories, heart rate, sleep.
- Workout logging for running, walking, cycling, gym, football, swimming and custom activities.
- Weekly and monthly summaries in plain language.
- Data comes in from Apple Health and Google Health Connect, so the app does not depend on each watch brand separately.

### 4.2 Watch connections

- Apple Watch, Samsung Galaxy Watch, Oraimo, Garmin, Fitbit, Huawei and others.
- Phase 1 uses Apple Health and Health Connect as the bridge, since most watches already sync to them.
- Phase 2 adds direct connections where a brand offers an API.
- Note: some budget watch brands, including Oraimo, offer limited or no public access. We need to confirm each one early.

### 4.3 Music

- Connect Apple Music, Spotify and other music apps from inside Kinn.
- Start a playlist with a workout, and see what friends are listening to if they choose to share.
- Optional: playlists that adjust to running pace or heart rate.
- Playback control may need the user to have the music app installed and a subscription. We should check each service's developer rules.

### 4.4 Friends and social

- Add friends by username, phone contacts or QR code.
- Private friend circles for groups such as a gym crew, family or office team.
- Quick reactions, voice notes and short photo or video moments after a workout.
- Stories that disappear after 24 hours, so there is no pressure to be perfect.
- Full privacy controls: choose what each friend or circle can see.

### 4.5 Goals, challenges and competition

- Shared goals: "Our group walks 100 km this month."
- Head-to-head duels: "Most steps this weekend."
- Team versus team and leaderboards among friends.
- Fair play handicaps: scores are adjusted by personal baseline, so a beginner can beat an athlete by improving more.
- Challenge templates so a challenge takes under 30 seconds to create.

### 4.6 Rewards and betting

This is the most exciting feature and also the riskiest one, so it needs careful design.

- **Stage 1: points.** Friends stake in-app points. The winner takes the pot. No real money, no legal risk.
- **Stage 2: reward stakes.** Stakes use gift cards, airtime or partner rewards instead of cash.
- **Stage 3: money stakes (only if legal).** Real money stakes involve gambling and payments law. Rules differ by country and by app store. We need legal advice before building this, and we should check licensing in Kenya and in every launch market.
- Possible payment options for Kenya: M-Pesa and cards, through a licensed payment provider.
- Always include spending limits, age verification (18+), and a cool-off option.

## 5. What other fitness apps are missing

This is based on general knowledge of apps like Strava, Nike Run Club, Fitbit, Apple Fitness and Peloton. We should verify against current versions before we use it in marketing.

| Gap | What users face today | How Kinn answers it |
| --- | --- | --- |
| Fitness is lonely | Data is private, and nobody notices when you stop | Friends see your effort and nudge you |
| Competition favours the fit | Beginners lose every time and quit | Handicap scoring rewards improvement |
| Brand lock-in | Apple data stays with Apple, Samsung with Samsung | Cross-device challenges using one shared data layer |
| Music is separate | You switch between apps mid-workout | Music inside the workout screen |
| Too serious and too technical | Charts and jargon scare casual users | Plain language and simple visuals |
| Weak real rewards | Badges and streaks lose meaning | Real stakes, pots and partner rewards |
| Built for the West | Pricing, payments and watches ignore African markets | M-Pesa, budget watches, low data use, offline mode |
| Social pressure | Public feeds make people feel judged | Private circles and disappearing stories |
| Cheating | GPS faking and manual edits spoil leaderboards | Anti-cheat checks and flagged results |

## 6. Target users

- **Primary:** 18 to 35 year olds who want to get fitter but quit when training alone.
- **Secondary:** gym groups, university friends, office teams and running clubs.
- **Early market:** Kenya, with an emphasis on Nairobi and university towns, then East Africa, then global.

## 7. How we make money

- Free tier with core tracking, friends and point-based challenges.
- Premium subscription: advanced stats, bigger groups, custom challenges.
- A small fee on reward pots, if and when money stakes are legal.
- Brand partnerships: gyms, sports shops, drinks and watch brands sponsor challenges.

## 8. Technical overview

- **Mobile app:** one codebase for iOS and Android (for example React Native or Flutter), or native if the team prefers.
- **Health data:** Apple HealthKit and Google Health Connect.
- **Music:** Apple MusicKit and Spotify SDK.
- **Backend:** user accounts, friends graph, challenges, leaderboards, notifications and a rewards ledger.
- **Real-time:** live challenge updates and reactions.
- **Anti-cheat:** detect unrealistic speeds, duplicate data and edited entries.
- **Security and privacy:** encrypted data, clear consent, and compliance with the Kenya Data Protection Act 2019 and any rules in other markets. Health data is sensitive.

## 9. Roadmap

| Phase | Focus | What ships |
| --- | --- | --- |
| 0. Foundation | Brand, name checks, legal review | Name, logo, trademark search, legal advice on rewards |
| 1. MVP | Track and connect | Accounts, dashboard, Health Connect and HealthKit, friends |
| 2. Social | Make it sticky | Circles, reactions, stories, shared goals |
| 3. Compete | Make it exciting | Duels, leaderboards, handicap scoring, point stakes |
| 4. Music and watches | Make it connected | Spotify and Apple Music, direct watch integrations |
| 5. Rewards | Make it valuable | Partner rewards, then money stakes if legal |

## 10. Risks and how to handle them

- **Betting laws.** Start with points. Get legal advice before real money.
- **App store rules.** Apple and Google restrict gambling features. Confirm before building.
- **Cheating.** Build anti-cheat early because trust is everything in a competitive app.
- **Privacy.** Health and location data need strong consent and security.
- **Watch access.** Not every brand has an open API, so rely on Health Connect first.
- **Name and logo.** Run trademark searches before launch.
- **Cold start.** An empty social app is useless. Launch in friend groups, gyms and campuses first.

## 11. Success measures

- Percentage of new users who add at least one friend in the first week.
- Challenges created per active user each week.
- Day 7 and day 30 retention.
- Average workouts per user per week.
- Share of users connecting a watch or music app.

---

# Brand Guide

## 12. Brand personality

Elegant, simple, warm and a little competitive. It should feel like a premium chat app, never like a clinical medical tool.

**Voice:** short, friendly and encouraging. Example: "Amina's ahead. Your move."

## 13. Logo

- **Mark:** two overlapping rings with a lime lens where they meet. The rings are two friends, and the overlap is the shared goal.
- **Wordmark:** "kinn" in lowercase Sora Bold, with tight letter spacing (about -5%).
- **Clear space:** keep at least one ring radius of empty space around the logo.
- **Minimum size:** mark 24 px wide on screens, 8 mm in print.
- **Do not:** recolour the lens, stretch the mark, add shadows, or place it on busy photos.
- **App icon:** the mark centred on an ink or lime rounded square, using about 64% of the icon width.

## 14. Colours

| Name | Hex | Use |
| --- | --- | --- |
| Ink | #0D1014 | Main dark background, text on light |
| Lime | #C6F24E | The one accent: key actions, progress, highlights |
| Graphite | #1B2027 | Cards and panels on dark backgrounds |
| Paper | #F7F8F6 | Light background and text on dark |
| White | #FFFFFF | Cards on light backgrounds |
| Slate | #5F6873 | Secondary text on light backgrounds |
| Mist | #9AA3AD | Secondary text on dark backgrounds |
| Line | #E1E4E0 | Borders and dividers on light backgrounds |

**Colour rules**

- Use lime once or twice per screen, as the main call to action or the key number.
- Never put white text on lime. Use Ink on Lime.
- Dark mode is the hero look. Light mode uses Paper and White with Ink text.
- Add success, warning and error colours later, and always pair them with an icon or label so colour alone never carries meaning.

## 15. Typography

**Fonts**

- **Sora** (Bold and SemiBold) for the wordmark, headings and big numbers.
- **DM Sans** (Regular and Medium) for body text, labels and buttons.
- Both are free on Google Fonts. Fallbacks: system sans-serif.

**Type scale (mobile)**

| Style | Font | Size / line height | Weight |
| --- | --- | --- | --- |
| Hero number | Sora | 48 / 52 px | Bold |
| Display | Sora | 36 / 42 px | Bold |
| Heading 1 | Sora | 28 / 34 px | Bold |
| Heading 2 | Sora | 22 / 28 px | SemiBold |
| Title | Sora | 18 / 24 px | SemiBold |
| Body | DM Sans | 16 / 24 px | Regular |
| Body small | DM Sans | 14 / 20 px | Regular |
| Button | DM Sans | 16 / 20 px | Medium |
| Caption | DM Sans | 13 / 18 px | Regular |
| Label (uppercase) | DM Sans | 12 / 16 px, 12% letter spacing | Medium |

**Typography rules**

- Never use body text smaller than 14 px, except for short labels.
- Large numbers (distance, steps, time) use Sora and are the visual stars of every screen.
- Keep line length short and sentences simple.

## 16. Layout and components

- **Spacing:** 4 px base unit. Common steps are 4, 8, 12, 16, 24, 32, 48.
- **Screen margins:** 20 px on mobile.
- **Corner radius:** 12 px for buttons and inputs, 20 px for cards, 30 px for the app icon, full round for avatars and chips.
- **Buttons:** primary is Lime with Ink text, 52 px tall; secondary is a Graphite fill or Ink outline; every tap target is at least 44 × 44 px.
- **Cards:** Graphite on Ink in dark mode, White with a Line border in light mode, 20 px padding.
- **Progress bars:** 8 px tall, rounded ends, Lime on Graphite.
- **Icons:** simple line icons, 2 px stroke, 24 px size, rounded caps. No emoji as icons.
- **Motion:** quick and soft, 150 to 250 ms, with gentle easing. Celebrate wins with a small lime pulse, not heavy confetti.

## 17. Accessibility

- Body text must meet a contrast ratio of at least 4.5:1, and large text 3:1.
- Support system text size settings.
- Never rely on colour alone. Add icons or labels.
- Label every icon-only button for screen readers.

## 18. Next steps

1. Confirm the name, then run app store, domain, handle and trademark searches.
2. Take legal advice on rewards and betting in Kenya and each launch market.
3. Check which watch brands can connect, starting with Oraimo.
4. Design the key screens: onboarding, home dashboard, friends, challenge, workout with music, rewards.
5. Build the MVP from Phase 1 and test with 20 to 50 friends and gym members.
