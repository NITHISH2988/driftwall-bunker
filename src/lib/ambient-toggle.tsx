import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AmbientToggle() {
  const [playing, setPlaying] = useState(false);
  const audio = useRef<{ context: AudioContext; master: GainNode } | null>(null);

  useEffect(() => () => { void audio.current?.context.close(); }, []);

  async function toggle() {
    if (!audio.current) {
      const context = new AudioContext();
      const master = context.createGain();
      const lowpass = context.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.value = 560;
      master.gain.value = 0.0001;
      lowpass.connect(master);
      master.connect(context.destination);

      // A quiet, slowly shifting two-note pad generated in the browser. No audio
      // file, tracking, or autoplay is used.
      [174.61, 220, 261.63].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const voice = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        voice.gain.value = [0.54, 0.3, 0.16][index];
        const drift = context.createOscillator();
        const driftAmount = context.createGain();
        drift.type = "sine";
        drift.frequency.value = 0.055 + index * 0.018;
        driftAmount.gain.value = 2.2 + index * 0.7;
        drift.connect(driftAmount);
        driftAmount.connect(oscillator.detune);
        drift.start();
        oscillator.connect(voice);
        voice.connect(lowpass);
        oscillator.start();
      });
      audio.current = { context, master };
    }

    const { context, master } = audio.current;
    if (playing) {
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(0.0001, context.currentTime, 0.18);
      setPlaying(false);
    } else {
      await context.resume();
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(0.025, context.currentTime, 0.7);
      setPlaying(true);
    }
  }

  return (
    <button className="ambient-toggle glass-button" type="button" onClick={() => void toggle()} aria-pressed={playing} aria-label={playing ? "Turn ambient sound off" : "Turn ambient sound on"}>
      {playing ? <Volume2 size={15} /> : <VolumeX size={15} />}
      <span>{playing ? "Sound on" : "Sound off"}</span>
    </button>
  );
}
