import React, { useContext } from "react";
import { CustomOsc } from "../Oscillator/Oscillator";
import { SineWaveProps } from "../SineWave/SineWave";
import Knob from "../Knob/Knob";
import { Oscilloscope } from "../../components/AudioVisualizer/OscVisulaizer";
import { ColorContext } from "../../context/ColorContext";

interface OscillatorSettingsProps {
  osc: CustomOsc;
  oscData: OscillatorNode;
  types: OscillatorType[];
  onChangeType: (type: SineWaveProps["type"]) => void;
  onToggleEnabled: () => void;
  onChangeDetune: (value: number) => void;
  onVolumeChange: (value: number) => void;
  onChangeSustain: (value: number) => void;
  onOctaveChange: (value: number) => void;
  onChangeResonance: (value: number) => void;
  onDelayChange: (value: number) => void;
}

export const OscillatorSettings: React.FC<OscillatorSettingsProps> = ({
  osc,
  oscData,
  types,
  onChangeType,
  onDelayChange,
  onToggleEnabled,
  onChangeDetune,
  onVolumeChange,
  onChangeSustain,
  onOctaveChange,
  onChangeResonance,
}) => {
  const { color } = useContext(ColorContext);
  return (
    <article
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
          alignItems: "space-between",
          height: "100%",
        }}
      >
        <span
          style={{
            color,
          }}
        >
          OSC {osc.sort}
        </span>
        <span
          style={{
            fontSize: 10,
          }}
        >
          PWR: {osc.enabled ? "ON" : "OFF"}
        </span>
        <span
          style={{
            fontSize: 10,
          }}
        >
          Freq: {oscData?.frequency?.value || 0}
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <button
            onClick={onToggleEnabled}
            aria-label={"toggle power on OSC " + String(osc.sort)}
            aria-labelledby="toggle"
            style={{
              height: 30,
              width: 30,
              marginTop: 10,
              borderRadius: "50%",
              border: "1px solid #fff",
              backgroundColor: osc.enabled ? "green" : "red",
              cursor: "pointer",
            }}
          ></button>
          {osc.enabled && (
            <Oscilloscope
              type={osc.type}
              frequency={oscData?.frequency?.value || 0}
              width={80}
              height={70}
            />
          )}
        </div>
        <select
          value={osc.type}
          aria-label={"Select oscillator type for OSC " + String(osc.sort)}
          onChange={(e) =>
            onChangeType(e.target.value as SineWaveProps["type"])
          }
          style={{
            padding: 5,
            fontSize: 16,
            maxWidth: 80,
          }}
        >
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 30,
        }}
      >
        <Knob
          label="Volume"
          value={osc.volume}
          min={0}
          max={1}
          step={0.01}
          onChange={onVolumeChange}
        />
        <Knob
          label="Octave"
          value={osc.octave}
          min={-5}
          max={5}
          step={1}
          onChange={onOctaveChange}
        />
        <Knob
          label="Detune"
          value={osc.detune}
          min={-100}
          max={100}
          step={1}
          onChange={onChangeDetune}
        />
        <Knob
          label="Grit"
          value={osc.sustain}
          min={0}
          max={100}
          step={1}
          onChange={onChangeSustain}
        />
        <Knob
          label="Resonance"
          value={osc.resonance}
          min={0}
          max={1000}
          step={1}
          onChange={onChangeResonance}
        />
        <Knob
          label="Bend"
          value={osc.bend}
          min={0}
          max={1}
          step={0.01}
          onChange={onDelayChange}
        />
      </div>
    </article>
  );
};

const MemoizedOscillatorSettings = React.memo(OscillatorSettings);

export default MemoizedOscillatorSettings;
