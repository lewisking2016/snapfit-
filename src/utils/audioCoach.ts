// Web Audio API & Speech Synthesis integration for Marcus coaching & ducked Spotify mix

class AudioCoachEngine {
  private audioCtx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private beatInterval: number | null = null;
  private isPlayingMix = false;

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
      this.masterGain = this.audioCtx.createGain();
      this.musicGain = this.audioCtx.createGain();
      this.voiceGain = this.audioCtx.createGain();

      this.musicGain.connect(this.masterGain);
      this.voiceGain.connect(this.masterGain);
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Synthesize a kick/sub-bass pulse to simulate rhythmic electronic beat
  private playBeat(bpm = 140) {
    if (!this.audioCtx || !this.musicGain) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine';
    const now = this.audioCtx.currentTime;
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.09);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Speak coach cue with Ducking
  public speakCue(text: string, duckingRatio = 65, onComplete?: () => void) {
    try {
      this.initContext();
    } catch {
      // AudioContext could fail on some restricted webviews
    }

    // Apply ducking to music gain
    if (this.audioCtx && this.musicGain) {
      const duckLevel = Math.max(0.05, 1 - (duckingRatio / 100));
      const now = this.audioCtx.currentTime;
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(duckLevel, now + 0.1);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;

      // Try selecting British English voice for Marcus
      const voices = window.speechSynthesis.getVoices();
      const ukVoice = voices.find(v => v.lang.includes('en-GB') || v.name.includes('UK') || v.name.includes('British') || v.name.includes('Daniel') || v.name.includes('Oliver'));
      if (ukVoice) {
        utterance.voice = ukVoice;
      }

      utterance.onend = () => {
        // Release ducking
        if (this.audioCtx && this.musicGain) {
          const now = this.audioCtx.currentTime;
          this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
          this.musicGain.gain.linearRampToValueAtTime(0.7, now + 0.4);
        }
        if (onComplete) onComplete();
      };

      utterance.onerror = () => {
        if (this.audioCtx && this.musicGain) {
          this.musicGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);
        }
        if (onComplete) onComplete();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        if (this.audioCtx && this.musicGain) {
          this.musicGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);
        }
        if (onComplete) onComplete();
      }, 3000);
    }
  }

  // Play the ducked simulation
  public startDuckedSimulation(quote: string, duckingRatio: number, onWaveChange: (active: boolean) => void) {
    this.initContext();
    this.isPlayingMix = true;
    onWaveChange(true);

    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(0.7, this.audioCtx!.currentTime);
    }

    // Start 140 BPM metronome kicks
    const intervalMs = (60 / 140) * 1000;
    this.playBeat(140);
    this.beatInterval = window.setInterval(() => {
      this.playBeat(140);
    }, intervalMs);

    // Speak cue after 800ms
    setTimeout(() => {
      if (!this.isPlayingMix) return;
      this.speakCue(quote, duckingRatio, () => {
        // Continue beat for 2 more seconds then stop
        setTimeout(() => {
          this.stopSimulation();
          onWaveChange(false);
        }, 2200);
      });
    }, 700);
  }

  public stopSimulation() {
    this.isPlayingMix = false;
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.musicGain && this.audioCtx) {
      this.musicGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    }
  }
}

export const audioCoach = new AudioCoachEngine();
