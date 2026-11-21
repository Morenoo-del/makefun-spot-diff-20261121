// SoundEngine — every sound in the game is synthesized with WebAudio,
// so the game ships no audio files and makes no network request.
// The context is created lazily on the first user gesture, which is
// also when browsers allow audio to start.
export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // One short oscillator note with a quick fade, the building block
  // every effect below is made from.
  note(freq, startAt, dur, type = 'sine', vol = 0.16) {
    if (!this.ctx || this.muted) return;
    const t = this.ctx.currentTime + startAt;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // A soft blip for button presses, so the UI answers every tap.
  click() {
    this.ensure();
    this.note(520, 0, 0.08, 'triangle', 0.08);
  }

  // The satisfying two-note chime on a found difference. Higher notes
  // as the combo grows, so a streak sounds like climbing.
  chime(combo = 0) {
    this.ensure();
    const lift = Math.min(combo, 6) * 40;
    this.note(660 + lift, 0, 0.22, 'sine', 0.18);
    this.note(990 + lift, 0.07, 0.3, 'sine', 0.14);
    this.note(1320 + lift, 0.14, 0.32, 'triangle', 0.08);
  }

  // A soft low thud for a wrong click — noticeable, never harsh.
  wrong() {
    this.ensure();
    this.note(140, 0, 0.18, 'square', 0.07);
    this.note(98, 0.05, 0.22, 'square', 0.06);
  }

  // A shimmering arpeggio when a hint is spent.
  hint() {
    this.ensure();
    [523, 659, 784, 1047].forEach((f, i) => this.note(f, i * 0.06, 0.25, 'triangle', 0.09));
  }

  // A rising fanfare when a level is cleared.
  fanfare() {
    this.ensure();
    [523, 659, 784, 1047, 1319].forEach((f, i) => this.note(f, i * 0.09, 0.35, 'triangle', 0.12));
  }

  // A gentle descending line when time runs out.
  lose() {
    this.ensure();
    [392, 330, 262, 196].forEach((f, i) => this.note(f, i * 0.12, 0.3, 'sine', 0.11));
  }

  // A quiet tick in the last ten seconds, so the pressure is audible.
  tick() {
    this.ensure();
    this.note(880, 0, 0.05, 'square', 0.04);
  }
}
