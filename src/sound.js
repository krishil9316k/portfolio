// A soundtrack made in code: no audio files, nothing licensed, generated live with Web Audio.
// Pad chords + sub bass + "data pulse" notes through a feedback delay and a generated reverb.
// Scroll opens the filter and makes the pulses busier; UI events get tiny sounds.
// Starts only after the visitor turns it on (browsers block autoplay with sound anyway).

const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);
// D minor world: Dm9 · Bbmaj7 · Fmaj7/A · C6/G (MIDI notes)
const CHORDS = [
  [50, 57, 60, 64, 65],
  [46, 53, 57, 62, 65],
  [45, 53, 57, 60, 64],
  [43, 52, 55, 60, 64],
];
const SCALE = [62, 64, 65, 69, 72, 74, 76, 77, 81]; // D minor pentatonic-ish, upper register

export function initSound({ button, onScroll }) {
  let ac = null, master, bus, padBus, padFilter, pulseBus, verbSend, uiBus;
  let on = false, chordIx = 0, chordTimer = 0, pulseTimer = 0, energy = 0, duck = 1;
  const pads = [];

  const setLabel = () => {
    button.setAttribute('aria-pressed', String(on));
    button.querySelector('.snd-txt').textContent = on ? 'Sound on' : 'Sound';
    button.classList.toggle('on', on);
    button.dataset.cursor = on ? 'Mute' : 'Play';
  };

  function impulse(sec = 3.2, decay = 2.6) {
    const len = ac.sampleRate * sec, buf = ac.createBuffer(2, len, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function build() {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = 0;
    const comp = ac.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    master.connect(comp).connect(ac.destination);

    const verb = ac.createConvolver(); verb.buffer = impulse();
    verbSend = ac.createGain(); verbSend.gain.value = 0.55; verbSend.connect(verb).connect(master);
    bus = ac.createGain(); bus.gain.value = 1; bus.connect(master); bus.connect(verbSend);

    // pad: two detuned voices per note through a slow-moving low-pass
    padFilter = ac.createBiquadFilter(); padFilter.type = 'lowpass'; padFilter.frequency.value = 520; padFilter.Q.value = 0.7;
    padBus = ac.createGain(); padBus.gain.value = 0.12; padFilter.connect(padBus).connect(bus);
    const lfo = ac.createOscillator(), lfoAmt = ac.createGain(); lfo.frequency.value = 0.05; lfoAmt.gain.value = 180;
    lfo.connect(lfoAmt).connect(padFilter.frequency); lfo.start();
    for (let v = 0; v < 5; v++) {
      const g = ac.createGain(); g.gain.value = 0; g.connect(padFilter);
      const oscs = [-6, 6].map((det, k) => {
        const o = ac.createOscillator(); o.type = k ? 'sawtooth' : 'triangle'; o.detune.value = det;
        o.connect(g); o.start(); return o;
      });
      pads.push({ g, oscs });
    }
    // sub bass
    const sub = ac.createOscillator(), subG = ac.createGain(); sub.type = 'sine'; subG.gain.value = 0.16;
    sub.connect(subG).connect(bus); sub.start(); pads.sub = sub;
    // air: soft filtered noise
    const nb = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    const noise = ac.createBufferSource(); noise.buffer = nb; noise.loop = true;
    const nf = ac.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 2400; nf.Q.value = 0.6;
    const ng = ac.createGain(); ng.gain.value = 0.012; noise.connect(nf).connect(ng).connect(bus); noise.start();
    // pulses: plucks through a ping-pong-ish feedback delay
    pulseBus = ac.createGain(); pulseBus.gain.value = 0.11;
    const dl = ac.createDelay(1), fb = ac.createGain(), df = ac.createBiquadFilter();
    dl.delayTime.value = 0.375; fb.gain.value = 0.38; df.type = 'lowpass'; df.frequency.value = 2600;
    pulseBus.connect(bus); pulseBus.connect(dl); dl.connect(df).connect(fb).connect(dl); df.connect(bus);
    uiBus = ac.createGain(); uiBus.gain.value = 0.09; uiBus.connect(master);
  }

  function setChord(ix, glide = 3) {
    const t = ac.currentTime, ch = CHORDS[ix % CHORDS.length];
    pads.forEach((p, i) => {
      const f = NOTE(ch[i]);
      p.oscs.forEach((o) => o.frequency.setTargetAtTime(f, t, glide / 3));
      p.g.gain.setTargetAtTime(i === 0 ? 0.18 : 0.12, t, 1.2);
    });
    pads.sub.frequency.setTargetAtTime(NOTE(ch[0] - 12), t, glide / 3);
  }

  function pluck(midi, when = 0, vel = 1) {
    const t = ac.currentTime + when, o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine'; o.frequency.value = NOTE(midi);
    const o2 = ac.createOscillator(); o2.type = 'triangle'; o2.frequency.value = NOTE(midi + 12); const g2 = ac.createGain(); g2.gain.value = 0.25;
    o.connect(g); o2.connect(g2).connect(g); g.connect(pulseBus);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.9 * vel, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0008, t + 1.4);
    o.start(t); o2.start(t); o.stop(t + 1.5); o2.stop(t + 1.5);
  }

  function tick() {
    if (!on) return;
    // chord change every 8 s
    if (ac.currentTime > chordTimer) { setChord(++chordIx); chordTimer = ac.currentTime + 8; }
    // pulses: busier with scroll energy (0..1)
    if (ac.currentTime > pulseTimer) {
      const ch = CHORDS[chordIx % CHORDS.length];
      const pool = SCALE.filter((n) => ch.some((c) => (n - c) % 12 === 0) || Math.random() < 0.35);
      const n = pool[Math.floor(Math.random() * pool.length)] || SCALE[0];
      pluck(n, 0, 0.55 + energy * 0.45);
      if (energy > 0.55 && Math.random() < 0.5) pluck(n + 7, 0.1875, 0.4);
      pulseTimer = ac.currentTime + (energy > 0.5 ? 0.375 : 0.75) * (Math.random() < 0.3 ? 2 : 1);
    }
    padFilter.frequency.setTargetAtTime(480 + energy * 1500, ac.currentTime, 0.8);
    master.gain.setTargetAtTime(0.85 * duck, ac.currentTime, 0.4);
    requestAnimationFrame(tick);
  }

  async function start() {
    if (!ac) build();
    await ac.resume();
    on = true; setLabel();
    chordTimer = ac.currentTime + 8; pulseTimer = ac.currentTime + 1.2; setChord(chordIx, 0.1);
    master.gain.cancelScheduledValues(ac.currentTime);
    master.gain.setValueAtTime(0, ac.currentTime);
    master.gain.linearRampToValueAtTime(0.85, ac.currentTime + 2.5);
    try { localStorage.setItem('kr-sound', '1'); } catch (e) {}
    requestAnimationFrame(tick);
  }
  function stop() {
    on = false; setLabel();
    if (ac) { master.gain.setTargetAtTime(0, ac.currentTime, 0.3); setTimeout(() => !on && ac.suspend(), 1200); }
    try { localStorage.setItem('kr-sound', '0'); } catch (e) {}
  }

  button.addEventListener('click', () => (on ? stop() : start()));
  document.addEventListener('visibilitychange', () => {
    if (!ac) return;
    if (document.hidden) ac.suspend(); else if (on) ac.resume();
  });
  onScroll((p) => { energy = Math.max(0, Math.min(1, p)); });
  setLabel();

  // small interface sounds, only while the soundtrack is on
  const ui = {
    hover() {
      if (!on) return; const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = 1760; o.connect(g).connect(uiBus);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      o.start(t); o.stop(t + 0.08);
    },
    click() {
      if (!on) return; const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(880, t); o.frequency.exponentialRampToValueAtTime(1320, t + 0.08);
      o.connect(g).connect(uiBus); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.start(t); o.stop(t + 0.2);
    },
    whoosh() {
      if (!on) return; const t = ac.currentTime, src = ac.createBufferSource(), len = ac.sampleRate * 0.6;
      const b = ac.createBuffer(1, len, ac.sampleRate), d = b.getChannelData(0); for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      src.buffer = b; const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.4;
      f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(3200, t + 0.45);
      const g = ac.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.6, t + 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      src.connect(f).connect(g).connect(uiBus); src.start(t); src.stop(t + 0.6);
    },
    duck(v) { duck = v ? 0.15 : 1; },
  };
  return ui;
}
