import { SineWaveProps } from "../components/SineWave/SineWave";

export interface CustomOsc {
    sort: number;
    type: SineWaveProps["type"] | "custom";
    enabled: boolean;
    detune: number;
    sustain: number;
    octave: number;
    resonance: number;
    release: number;
    bend: number;
    volume: number;
  }
  