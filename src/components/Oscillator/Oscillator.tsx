import { useState } from "react";
import Knob from "../Knob/Knob";
import { SineWaveProps } from "../SineWave/SineWave";

export interface CustomOsc {
  sort: number;
  type: OscillatorType;
  enabled: boolean;
  detune: number;
  bend: number;
  sustain: number;
  octave: number;
  volume: number;
  release: number
  resonance: number;
}

export function Oscillator({
  type,
  detune,
  volume,
  sustain,
  resonance,
  enabled,
  onVolumeChange,
  onChangeType,
  onToggleEnabled,
  onChangeDetune,
  onChangeSustain,
  onChangeResonance,
}: {
  type: OscillatorType;
  detune: number;
  volume: number;
  bend: number;
  sustain: number;
  resonance: number;
  enabled: boolean;
  onChangeType: (type: SineWaveProps["type"]) => void;
  onToggleEnabled: () => void;
  onChangeDetune: (value: number) => void;
  onVolumeChange: (value: number) => void;
  onChangeSustain: (value: number) => void;
  onChangeResonance: (value: number) => void;
}) {
  const [types] = useState<SineWaveProps["type"][]>([
    "sawtooth",
    "square",
    "triangle",
    "sine",
  ]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 25,
        border: "1px solid rgba(255,255,255,0.9)",
        borderRadius: 3,
        padding: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <select
          value={type}
          onChange={(e) =>
            onChangeType(e.target.value as SineWaveProps["type"])
          }
          style={{
            padding: 5,
            fontSize: 16,
            maxWidth: 90,
          }}
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <span>OSC</span>
        <button
          onClick={onToggleEnabled}
          style={{
            height: 30,
            width: 30,
            marginTop: 10,
            borderRadius: "50%",
            border: "1px solid #fff",
            backgroundColor: enabled ? "green" : "#E15141",
            cursor: "pointer",
          }}
        ></button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingRight: 20,
        }}
      >
        <Knob
          label="Volume"
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={onVolumeChange}
        />
        <Knob
          label="Detune"
          value={detune}
          min={-100}
          max={100}
          step={1}
          onChange={onChangeDetune}
        />
        <Knob
          label="Grit"
          value={sustain}
          min={0}
          max={100}
          step={1}
          onChange={onChangeSustain}
        />
        <Knob
          label="Resonance"
          value={resonance}
          min={0}
          max={1000}
          step={1}
          onChange={onChangeResonance}
        />
      </div>
    </div>
  );
}
