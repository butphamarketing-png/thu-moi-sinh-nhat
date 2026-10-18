const MELODY = [76, 79, 81, 84, 81, 79, 77, 74, 72, 74, 76, 79, 81, 79, 77, 76, 74, 72, 74, 76, 72, 0, 0, 0];
const BASS = [48, 45, 41, 43];

function midiToFreq(midi: number) {
  return 440 * 2 ** ((midi - 69) / 12);
}

/**
 * Nhạc hộp gốc, viết cho thư mời này.
 * Phát sau thao tác của khách, nhỏ hơn giọng đọc.
 */
export class MusicBed {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer = 0;
  private nextTime = 0;
  private step = 0;
  private started = false;
  private suspended = false;
  private volume = 0.14;
  private beat = 60 / 78;
  private lively = false;

  start() {
    if (this.started) {
      this.resume();
      return;
    }
    const ctx = new AudioContext();
    void ctx.resume();
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, ctx.currentTime);
    master.gain.exponentialRampToValueAtTime(this.volume, ctx.currentTime + 1.6);

    const delay = ctx.createDelay();
    delay.delayTime.value = 0.28;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.16;
    const wet = ctx.createGain();
    wet.gain.value = 0.22;
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    master.connect(ctx.destination);

    this.ctx = ctx;
    this.master = master;
    this.delay = delay;
    this.started = true;
    this.suspended = false;
    this.nextTime = ctx.currentTime + 0.12;
    this.loop();
    this.timer = window.setInterval(this.loop, 700);
  }

  private delay: DelayNode | null = null;

  pause() {
    if (!this.ctx || this.suspended) return;
    this.suspended = true;
    void this.ctx.suspend();
  }

  resume() {
    if (!this.ctx || !this.started) return;
    this.suspended = false;
    void this.ctx.resume();
    this.nextTime = Math.max(this.nextTime, this.ctx.currentTime + 0.05);
  }

  celebrate() {
    if (this.lively) return;
    this.lively = true;
    this.beat = 60 / 108;
    this.volume = 0.18;
    if (!this.ctx || !this.master || this.suspended) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(this.volume, now + 0.45);
  }

  setMuted(muted: boolean) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    const target = muted ? 0.0001 : this.volume;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(target, now + 0.25);
  }

  private loop = () => {
    if (!this.ctx || !this.started) return;
    if (!this.suspended && this.ctx.state === "running") {
      const horizon = this.ctx.currentTime + 1.5;
      while (this.nextTime < horizon) {
        this.playBeat(this.nextTime);
        this.nextTime += this.beat;
        this.step += 1;
      }
    }
  };

  private playBeat(time: number) {
    const note = MELODY[this.step % MELODY.length];
    if (note) this.tone(midiToFreq(note), time, this.beat * 1.35, "triangle", 0.22);
    if (this.step % 3 === 0) {
      const bass = BASS[Math.floor(this.step / 3) % BASS.length];
      this.tone(midiToFreq(bass), time, this.beat * 2.6, "sine", 0.16);
    }
  }

  private tone(freq: number, time: number, duration: number, type: OscillatorType, amount: number) {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(amount, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain);
    gain.connect(this.master);
    if (this.delay && type === "triangle") gain.connect(this.delay);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  dispose() {
    window.clearInterval(this.timer);
    void this.ctx?.close();
    this.ctx = null;
    this.started = false;
  }
}
