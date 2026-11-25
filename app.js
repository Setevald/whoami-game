// Who Am I? — online party game.
// Model: the HOST's phone holds the game state and broadcasts it to everyone in the room.
// Other phones send "actions" (next turn, guess, verdict) to the host, who applies them.
(() => {
'use strict';
const CFG = window.WHOAMI_CONFIG || {};
const params = new URLSearchParams(location.search);
const LOCAL = !CFG.SUPABASE_URL || params.has('local');
const DECKS = window.WHOAMI_DECKS, CARDS = window.WHOAMI_CARDS, PHRASE = window.WHOAMI_PHRASE;
const DEFAULT_DECKS = ['animals', 'food', 'jobs', 'things', 'places', 'people', 'games'];
const DEFAULT_PUNISH = [
  'Do 15 push-ups',
  'Buy the winner a bubble tea',
  'Sing the chorus of a song the group picks',
  'Speak in an accent until the next round ends',
  'Do your best catwalk across the room',
  'Plank for 45 seconds',
  'Show everyone the last photo in your camera roll',
  'Text your mum "I love you" right now',
  'Let the group pick your profile picture for 24 hours',
  'Do an impression of someone in the room',
  'Compliment every player, one by one',
  'Eat a spoonful of something the group picks (nothing unsafe)'
];
const HUES = ['#d9467a', '#4a8fe7', '#e8803a', '#3fae6e', '#8a5cd6', '#d4a017', '#2bb3b1', '#c4473a'];

/* ---------- helpers ---------- */
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.random() * a.length | 0];
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);
const LS = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
// Each browser tab gets its own id (sessionStorage), so local-mode tabs act as separate phones.
// On a real phone the id survives refreshes, so you rejoin as yourself.
const myId = (() => {
  let store; try { store = LOCAL ? sessionStorage : localStorage; } catch (e) {}
  let id; try { id = store.getItem('wa.id'); } catch (e) {}
  if (!id) { id = Math.random().toString(36).slice(2, 10); try { store.setItem('wa.id', id); } catch (e) {} }
  return id;
})();

let myName = LS.get('wa.name', '');
let room = null, isHost = false, T = null, S = null, presence = [], askTimer = null;
let seenRound = 0, seenLast = 0, primed = false;

/* ---------- transport: Supabase Realtime, or BroadcastChannel for local testing ---------- */
function setConn(on) { $('dot').classList.toggle('on', on); }

function supabaseTransport(code, onMsg, onPres) {
  const sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  const ch = sb.channel('whoami-' + code, { config: { broadcast: { self: false }, presence: { key: myId } } });
  ch.on('broadcast', { event: 'm' }, ({ payload }) => onMsg(payload));
  ch.on('presence', { event: 'sync' }, () => onPres(Object.values(ch.presenceState()).map(a => a[0])));
  ch.subscribe(async status => {
    if (status === 'SUBSCRIBED') { setConn(true); await ch.track({ id: myId, name: myName }); onReady(); }
    else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') setConn(false);
  });
  return { send: m => ch.send({ type: 'broadcast', event: 'm', payload: m }), close: () => sb.removeChannel(ch) };
}

function localTransport(code, onMsg, onPres) {
  const bc = new BroadcastChannel('whoami-' + code), seen = {};
  const meta = () => ({ id: myId, name: myName });
  let lastKey = '';
  const emit = () => {
    const now = Date.now();
    for (const id in seen) if (id !== myId && now - seen[id].t > 6000) delete seen[id];
    const list = Object.values(seen).map(s => s.meta);
    const key = list.map(p => p.id + p.name).sort().join('|');
    if (key !== lastKey) { lastKey = key; onPres(list); }
  };
  bc.onmessage = e => {
    const m = e.data;
    if (m.t === 'hi') { seen[m.meta.id] = { meta: m.meta, t: Date.now() }; if (m.ask) bc.postMessage({ t: 'hi', meta: meta() }); emit(); }
    else if (m.t === 'bye') { delete seen[m.id]; emit(); }
    else onMsg(m);
  };
  seen[myId] = { meta: meta(), t: Date.now() };
  bc.postMessage({ t: 'hi', meta: meta(), ask: true });
  emit();
  const iv = setInterval(() => { seen[myId] = { meta: meta(), t: Date.now() }; bc.postMessage({ t: 'hi', meta: meta() }); emit(); }, 2000);
  addEventListener('pagehide', () => bc.postMessage({ t: 'bye', id: myId }));
  setConn(true); setTimeout(onReady, 50);
  return { send: m => bc.postMessage(m), close: () => { bc.postMessage({ t: 'bye', id: myId }); clearInterval(iv); bc.close(); } };
}

/* ---------- room lifecycle ---------- */
function newState() {
  return {
    v: 0, host: myId, phase: 'lobby', round: 0,
    players: [{ id: myId, name: myName }],
    opts: { decks: DEFAULT_DECKS.slice(), hint: true, punish: DEFAULT_PUNISH.join('\n'), custom: '' },
    cards: {}, order: [], turn: null, done: [], pending: null, tag: null,
    last: null, loser: null, punish: '', used: [], started: 0, bots: []
  };
}

function enterRoom(code, host) {
  room = code; isHost = host; S = null; seenRound = 0; seenLast = 0; primed = false;
  if (isHost) {
    const saved = LS.get('wa.host.' + code, null);
    S = saved && saved.host === myId ? saved : newState();
  }
  history.replaceState(null, '', '?room=' + code + (params.has('local') ? '&local' : ''));
  T = (LOCAL ? localTransport : supabaseTransport)(code, onMsg, onPres);
  render();
}

function onReady() {
  if (isHost) push();
  else {
    clearInterval(askTimer);
    const ask = () => { if (S) clearInterval(askTimer); else T.send({ t: 'need' }); };
    ask(); askTimer = setInterval(ask, 1500);
  }
}

function leaveRoom() {
  clearInterval(askTimer);
  if (T) T.close();
  T = null; room = null; S = null; presence = [];
  history.replaceState(null, '', location.pathname + (params.has('local') ? '?local' : ''));
  render();
}

function onPres(list) {
  presence = list;
  if (isHost) { if (S.phase === 'lobby') syncPlayers(); push(); }
  else render();
}

function onMsg(m) {
  if (m.t === 'state' && !isHost) { S = m.s; render(); }
  else if (m.t === 'act' && isHost) reduce(m.from, m.a);
  else if (m.t === 'need' && isHost) push(false);
}

function push(bump = true) {
  if (!isHost || !S) return;
  if (bump) S.v++;
  LS.set('wa.host.' + room, S);
  if (T) T.send({ t: 'state', s: S });
  render();
  scheduleBots();
}

/* ---------- test players (local/preview mode only) ---------- */
let botT;
function scheduleBots() {
  clearTimeout(botT);
  if (!S || S.phase !== 'play' || !(S.bots || []).length) return;
  const wait = Math.max(0, 3200 - (Date.now() - S.started));
  if (S.pending) {
    if (isBot(S.pending)) return; // you judge the bots' guesses
    const judge = S.order.find(id => isBot(id) && id !== S.pending);
    if (judge) botT = setTimeout(() => reduce(judge, { type: 'verdict', ok: Math.random() < 0.7 }), wait + 2200);
  } else if (isBot(S.turn)) {
    const id = S.turn;
    botT = setTimeout(() => reduce(id, { type: Math.random() < 0.3 ? 'guess' : 'next' }), wait + 1800);
  }
}
const BOT_NAMES = ['Budi', 'Clara', 'Dewi', 'Kevin', 'Jess', 'Tom', 'Mei'];
function addBot() {
  S.bots = S.bots || [];
  const used = new Set(S.bots.map(b => b.name));
  const nm = BOT_NAMES.find(n => !used.has(n + ' (bot)')) || 'Bot';
  S.bots.push({ id: 'bot-' + Math.random().toString(36).slice(2, 7), name: nm + ' (bot)' });
  syncPlayers(); push();
}
function clearBots() { S.bots = []; syncPlayers(); push(); }

function act(a) {
  if (isHost) reduce(myId, a);
  else if (T) T.send({ t: 'act', from: myId, a });
}

/* ---------- game logic (runs on the host only) ---------- */
function syncPlayers() {
  const here = new Map(presence.map(p => [p.id, p.name || 'Player']));
  here.set(myId, myName);
  for (const b of S.bots || []) here.set(b.id, b.name);
  const list = S.players.filter(p => here.has(p.id)).map(p => ({ id: p.id, name: here.get(p.id) }));
  for (const [id, name] of here) if (!list.some(p => p.id === id)) list.push({ id, name });
  list.sort((a, b) => (b.id === S.host) - (a.id === S.host));
  S.players = list;
}

function parseCustom(txt) {
  return String(txt || '').split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    const i = l.indexOf(':');
    const n = (i < 0 ? l : l.slice(0, i)).trim().slice(0, 40);
    const t = i < 0 ? [] : l.slice(i + 1).split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    return { n, d: 'mine', t };
  }).filter(c => c.n);
}

function cardPool(opts) {
  let p = CARDS.filter(c => opts.decks.includes(c.d));
  if (opts.decks.includes('mine')) p = p.concat(parseCustom(opts.custom));
  const seen = new Set();
  return p.filter(c => { const k = c.n.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
}

function deal() {
  syncPlayers();
  const ids = S.players.map(p => p.id), n = ids.length;
  if (n < 2) return 'You need at least 2 players.';
  const all = cardPool(S.opts);
  let fresh = all.filter(c => !S.used.includes(c.n));
  if (fresh.length < n) { S.used = []; fresh = all; }
  if (fresh.length < n) return 'Not enough cards. Turn on more decks.';
  let chosen = null, tag = null;
  if (S.opts.hint) {
    const by = {};
    for (const c of fresh) for (const t of c.t) (by[t] = by[t] || []).push(c);
    const ok = Object.keys(by).filter(t => by[t].length >= n);
    if (ok.length) { tag = pick(ok); chosen = shuffle(by[tag]).slice(0, n); }
  }
  if (!chosen) chosen = shuffle(fresh).slice(0, n);
  S.used = S.used.concat(chosen.map(c => c.n)).slice(-400);
  S.cards = {}; ids.forEach((id, i) => { S.cards[id] = { n: chosen[i].n, d: chosen[i].d }; });
  S.tag = tag; S.order = shuffle(ids); S.turn = S.order[0];
  S.done = []; S.pending = null; S.last = null; S.loser = null; S.punish = '';
  S.round++; S.started = Date.now(); S.phase = 'play';
  return null;
}

const remaining = () => S.order.filter(id => !S.done.includes(id));

function advanceFrom(id) {
  const left = remaining();
  if (left.length <= 1) return finish();
  let i = S.order.indexOf(id);
  for (let k = 0; k < S.order.length; k++) {
    i = (i + 1) % S.order.length;
    if (!S.done.includes(S.order[i])) { S.turn = S.order[i]; return; }
  }
}

function finish() {
  S.loser = remaining()[0] || null;
  const list = String(S.opts.punish || '').split('\n').map(s => s.trim()).filter(Boolean);
  S.punish = list.length ? pick(list) : 'The group decides!';
  S.phase = 'end'; S.pending = null; S.turn = null;
}

function reduce(from, a) {
  const host = from === S.host;
  const inGame = S.order.includes(from);
  switch (a.type) {
    case 'opts': if (host && S.phase === 'lobby') S.opts = a.opts; break;
    case 'start': if (host) { const err = deal(); if (err) { toast(err); return; } } break;
    case 'next': if (S.phase === 'play' && from === S.turn && !S.pending) advanceFrom(from); break;
    case 'guess': if (S.phase === 'play' && from === S.turn && !S.pending) S.pending = from; break;
    case 'verdict':
      if (S.phase !== 'play' || !S.pending || from === S.pending || !inGame) return;
      {
        const g = S.pending; S.pending = null;
        S.last = { k: S.v + 1, id: g, ok: !!a.ok, by: from };
        if (a.ok) S.done.push(g);
        advanceFrom(g);
      }
      break;
    case 'skip': if (host && S.phase === 'play') { S.pending = null; advanceFrom(S.turn); } break;
    case 'cancel': if (host) { S.phase = 'lobby'; syncPlayers(); } break;
    case 'reroll': if (host && S.phase === 'end') { const old = S.punish; finish(); if (S.punish === old) finish(); } break;
    case 'lobby': if (host) { S.phase = 'lobby'; syncPlayers(); } break;
    default: return;
  }
  push();
}

/* ---------- rendering ---------- */
const nameOf = id => (S.players.find(p => p.id === id) || {}).name || 'Someone';
const isBot = id => String(id).startsWith('bot-');
const online = id => id === myId || isBot(id) || presence.some(p => p.id === id);
const phrase = t => PHRASE[t] || `share "${t}"`;
const hintText = () => S.tag ? `${S.order.length === 2 ? 'Both of you' : `All ${S.order.length} of you`} ${phrase(S.tag)}` : '';
const ord = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');

function cardHTML(c, mine) {
  if (mine) return `<div class="card me"><div class="frame"><span class="mono">?</span></div><div class="cname">You</div><div class="cdeck">Your secret card</div></div>`;
  const ini = c.n.replace(/\(.*?\)|".*?"/g, '').trim().split(/\s+/).filter(w => /^[A-Za-z]/.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('') || '?';
  const h = HUES[Math.abs(hash(c.n)) % HUES.length];
  return `<div class="card"><div class="frame" style="background:radial-gradient(circle at 35% 30%,${h}cc,${h})"><span class="mono">${esc(ini)}</span></div><div class="cname">${esc(c.n)}</div><div class="cdeck">${esc(DECKS[c.d] || '')}</div></div>`;
}

function show(id) { for (const s of document.querySelectorAll('section')) s.classList.toggle('on', s.id === id); }

function render() {
  $('localBanner').hidden = !LOCAL;
  $('roomPill').hidden = !room;
  if (room) $('roomTxt').textContent = room;
  if (!room) { show('home'); $('name').value = myName; if (params.get('room')) $('code').value = params.get('room').toUpperCase(); return; }
  if (!S) { show('lobby'); renderLobby(); return; }
  if (S.phase === 'lobby') { show('lobby'); renderLobby(); }
  else if (S.phase === 'play') { show('play'); renderPlay(); }
  else { show('end'); renderEnd(); }
  effects();
}

let optsDrawn = false;
function renderLobby() {
  $('bigCode').textContent = room;
  const players = S ? S.players : presence;
  $('pCount').textContent = players.length;
  $('people').innerHTML = players.map(p => `<span class="person${S && p.id === S.host ? ' host' : ''}">${esc(p.name)}${p.id === myId ? ' (you)' : ''}</span>`).join('') || '<span class="mut">Connecting…</span>';
  $('hostOpts').hidden = !isHost;
  $('guestWait').hidden = isHost;
  if (!S) { $('guestDecks').textContent = 'Connecting to the host… check the room code if this takes long.'; return; }
  if (isHost) {
    $('cats').innerHTML = Object.entries(DECKS).map(([k, v]) => `<button class="cat" data-c="${k}" aria-pressed="${S.opts.decks.includes(k)}">${esc(v)}</button>`).join('');
    $('hint').checked = S.opts.hint;
    if (!optsDrawn) { $('punishTxt').value = S.opts.punish; $('customTxt').value = S.opts.custom; optsDrawn = true; }
    $('botRow').hidden = !LOCAL;
    $('start').disabled = S.players.length < 2;
    $('start').textContent = S.players.length < 2 ? 'Waiting for players…' : `Start game (${S.players.length} players)`;
  } else {
    $('guestDecks').textContent = 'Decks: ' + S.opts.decks.map(d => DECKS[d]).filter(Boolean).join(', ');
  }
}

function renderPlay() {
  const n = S.order.length, me = myId, playing = S.order.includes(me);
  $('hintTxt').textContent = hintText();
  let box;
  if (!playing) {
    box = `<h2>Watching</h2><p>A round is in progress. You'll be dealt in next round.</p>`;
  } else if (S.pending) {
    const g = S.pending;
    if (g === me) box = `<h2>Say your guess!</h2><p>Say it out loud. The others will confirm if you got it.</p>`;
    else box = `<h2>${esc(nameOf(g))} is guessing</h2><p>Their card is <b>${esc(S.cards[g].n)}</b>. Did they get it?</p>
      <div class="btns"><button class="go" data-v="1">Correct</button><button class="no" data-v="0">Wrong</button></div>`;
  } else if (S.done.includes(me)) {
    box = `<h2>You're safe!</h2><p>Keep answering. It's <b>${esc(nameOf(S.turn))}</b>'s turn to ask.</p>`;
  } else if (S.turn === me) {
    box = `<h2>Your turn</h2><p>Ask <b>one</b> yes/no question about your card. Everyone else answers.</p>
      <div class="btns"><button class="ghost" id="bNext">Asked, next</button><button class="gold" id="bGuess">I know it!</button></div>`;
  } else {
    box = `<h2>${esc(nameOf(S.turn))}'s turn</h2><p>Answer their question out loud. Their card is <b>${esc(S.cards[S.turn].n)}</b>.</p>`;
  }
  $('turnBox').innerHTML = box;
  $('grid').innerHTML = S.order.map(id => {
    const done = S.done.indexOf(id);
    const st = done >= 0 ? `Safe, ${ord(done + 1)}` : id === S.turn ? (S.pending === id ? 'Guessing…' : 'Asking now') : online(id) ? '' : 'Offline';
    return `<div class="tile${id === S.turn ? ' act' : ''}${done >= 0 ? ' done' : ''}"><div class="nm">${esc(nameOf(id))}${id === me ? ' (you)' : ''}</div>${cardHTML(S.cards[id], id === me && done < 0)}<div class="st">${st}</div></div>`;
  }).join('');
  $('hostCtl').hidden = !isHost;
  const nb = $('bNext'), gb = $('bGuess');
  if (nb) nb.onclick = () => act({ type: 'next' });
  if (gb) gb.onclick = () => act({ type: 'guess' });
  for (const b of $('turnBox').querySelectorAll('[data-v]')) b.onclick = () => act({ type: 'verdict', ok: b.dataset.v === '1' });
}

function renderEnd() {
  const ranked = S.done.concat(S.loser ? [S.loser] : []);
  const me = S.loser === myId;
  $('endBox').innerHTML = `
    <div class="panel loser">
      <div class="k">${me ? 'Unlucky…' : 'Last one standing'}</div>
      <h2 class="pop">${esc(me ? 'You lose!' : nameOf(S.loser) + ' loses!')}</h2>
      <div class="punish pop"><small>Punishment</small>${esc(S.punish)}</div>
      ${S.tag ? `<p class="mut">The hint was: ${esc(hintText())}</p>` : ''}
      ${isHost ? `<div class="rowb"><button class="ghost" id="reroll">Reroll punishment</button></div>` : ''}
    </div>
    <div class="panel"><h2>Results</h2><ol class="rank">${ranked.map((id, i) => `<li class="${id === S.loser ? 'l' : ''}"><span>${i + 1}. ${esc(nameOf(id))}</span><span>${esc(S.cards[id]?.n || '')}</span></li>`).join('')}</ol></div>
    <div class="grid">${S.order.map(id => `<div class="tile"><div class="nm">${esc(nameOf(id))}</div>${cardHTML(S.cards[id])}</div>`).join('')}</div>
    <div class="rowb">${isHost ? `<button class="gold" id="again">Play again</button><button class="ghost" id="toLobby">Back to lobby</button>` : `<p class="mut">Waiting for the host to start the next round…</p>`}</div>`;
  const r = $('reroll'), ag = $('again'), tl = $('toLobby');
  if (r) r.onclick = () => act({ type: 'reroll' });
  if (ag) ag.onclick = () => act({ type: 'start' });
  if (tl) tl.onclick = () => act({ type: 'lobby' });
}

/* countdown when a new round starts, toast on guesses */
function effects() {
  if (!primed) { // first state after joining: don't replay old events
    primed = true; seenLast = S.last?.k || 0;
    if (S.phase !== 'play' || Date.now() - S.started > 15000) seenRound = S.round;
  }
  if (S.phase === 'play' && S.round !== seenRound) { seenRound = S.round; countdown(); }
  if (S.last && S.last.k !== seenLast) {
    seenLast = S.last.k;
    const who = S.last.id === myId ? 'You' : nameOf(S.last.id);
    toast(S.last.ok ? `${who} got it! Safe ✓` : `Wrong guess from ${who}`);
  }
}
function countdown() {
  let n = 3; const ov = $('ov'), t = $('ovN');
  ov.classList.add('on'); t.textContent = n; t.className = 'n pop';
  const iv = setInterval(() => {
    n--; t.className = 'n'; void t.offsetWidth; t.className = 'n pop';
    if (n > 0) t.textContent = n; else if (n === 0) t.textContent = 'GO'; else { clearInterval(iv); ov.classList.remove('on'); }
  }, 800);
}
let toastT;
function toast(msg) { const el = $('toast'); el.textContent = msg; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 2600); }

/* ---------- UI events ---------- */
const genCode = () => Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ'[Math.random() * 24 | 0]).join('');
function needName() {
  myName = $('name').value.trim().slice(0, 16);
  if (!myName) { $('name').focus(); toast('Type your name first'); return false; }
  LS.set('wa.name', myName); return true;
}
$('create').onclick = () => { if (needName()) enterRoom(genCode(), true); };
$('join').onclick = () => {
  if (!needName()) return;
  const c = $('code').value.trim().toUpperCase();
  if (!/^[A-Z]{4}$/.test(c)) { toast('Room codes are 4 letters'); return; }
  const saved = LS.get('wa.host.' + c, null);
  enterRoom(c, !!(saved && saved.host === myId));
};
$('code').addEventListener('keydown', e => { if (e.key === 'Enter') $('join').click(); });
$('leave').onclick = leaveRoom;
$('share').onclick = async () => {
  const url = location.origin + location.pathname + '?room=' + room + (params.has('local') ? '&local' : '');
  try {
    if (navigator.share) await navigator.share({ title: 'Who Am I?', text: 'Join my Who Am I? room ' + room, url });
    else { await navigator.clipboard.writeText(url); toast('Invite link copied'); }
  } catch (e) { toast(url); }
};
const sendOpts = () => act({ type: 'opts', opts: Object.assign({}, S.opts, { hint: $('hint').checked, punish: $('punishTxt').value, custom: $('customTxt').value }) });
$('cats').addEventListener('click', e => {
  const k = e.target.dataset.c; if (!k || !isHost) return;
  const decks = S.opts.decks.includes(k) ? S.opts.decks.filter(d => d !== k) : S.opts.decks.concat(k);
  S.opts.decks = decks; sendOpts();
});
$('hint').onchange = sendOpts;
$('punishTxt').onchange = sendOpts;
$('customTxt').onchange = sendOpts;
$('start').onclick = () => { sendOpts(); act({ type: 'start' }); };
$('skip').onclick = () => act({ type: 'skip' });
$('addBot').onclick = () => { if (isHost && S.phase === 'lobby' && S.players.length < 10) addBot(); };
$('clearBots').onclick = () => { if (isHost && S.phase === 'lobby') clearBots(); };
$('cancel').onclick = () => act({ type: 'cancel' });

// Auto-rejoin after a refresh if you were already in this room
if (params.get('room') && myName) {
  const c = params.get('room').toUpperCase();
  const saved = LS.get('wa.host.' + c, null);
  if (/^[A-Z]{4}$/.test(c)) enterRoom(c, !!(saved && saved.host === myId));
  else render();
} else render();
})();
