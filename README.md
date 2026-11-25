# Who Am I? (online party game)

Everyone joins a room on their own phone and gets a secret card. You see everyone's card except your own.
Take turns asking one yes/no question while the others answer out loud. Guess your card to be safe.
The **last one left loses** and gets a random punishment.

Plain static site with no build step. Phones sync through **Supabase Realtime** (free tier).

```
index.html   UI + styles
app.js       game logic + syncing (host phone holds the state, others send actions)
deck.js      all the cards and traits (edit freely)
config.js    your Supabase URL + key
```

---

## 1. Test it locally first (no accounts needed)

With `config.js` left empty, the game runs in **local test mode**. Each browser tab acts as a separate phone.

```bash
cd whoami-online
python3 -m http.server 8000
```

Open http://localhost:8000. Create a room, then either tap **+ Add test player** (bots that play along) or open 2–3 more tabs and join with the code.
Test players only appear in local mode and disappear once your Supabase keys are in.

## 2. Create the Supabase project (sync between phones)

1. Go to https://supabase.com, sign in with GitHub, and click **New project** (any name; pick the Sydney region).
2. When it's ready, open **Project Settings → API** (or the **Connect** button).
3. Copy the **Project URL** and the **anon / publishable key**.
4. Paste both into `config.js`:

```js
window.WHOAMI_CONFIG = {
  SUPABASE_URL: 'https://abcdxyz.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOi...'   // or sb_publishable_...
};
```

No tables or SQL are needed: the game only uses Realtime broadcast and presence.
If phones don't connect, check **Realtime → Settings** and make sure public channel access is allowed.

## 3. Deploy to Vercel

**Option A: GitHub + Vercel website (easiest to update later)**

```bash
cd whoami-online
git init
git add .
git commit -m "Who Am I party game"
gh repo create whoami-game --public --source=. --push    # or create the repo on github.com and push
```

Then go to https://vercel.com, click **Add New → Project**, import the repo, set Framework Preset to **Other**, and click **Deploy**.
Every `git push` redeploys automatically.

**Option B: Vercel CLI**

```bash
npm i -g vercel
cd whoami-online
vercel          # first time: log in, accept the defaults
vercel --prod   # gives you the public URL
```

## 4. Play

1. The host opens the site, types a name, and taps **Create room**.
2. Tap **Copy invite link** and send it to the group chat (or friends type the 4-letter code).
3. The host picks the decks and punishments, then taps **Start game**. Every phone counts down together.
4. On your turn: ask one question, then tap **Asked, next**. When you think you know your card, tap **I know it!** and say it out loud.
   The others tap **Correct** or **Wrong**.
5. The last one left loses. The host can reroll the punishment or tap **Play again**.

You need to be in the same room or on a voice call, because questions and answers happen out loud.

## Customising

- **Cards:** edit `deck.js`. Each line is `Name|deck|traits`. Traits drive the shared hint
  (two cards sharing `yellow` gives "Both of you are yellow"). The phrase for each trait is in `WHOAMI_PHRASE`.
- **New deck:** add it to `WHOAMI_DECKS`, then add cards with that deck name.
- **Default punishments:** edit `DEFAULT_PUNISH` at the top of `app.js`.

## Known limits

- The host's phone runs the game. If the host closes the tab, the round pauses until they reopen the same link
  (their state is saved, so it carries on). Anyone else can refresh or rejoin with no problem.
- Someone determined could peek at their own card through dev tools. It's a party game, so play fair.
