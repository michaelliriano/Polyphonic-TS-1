import { useContext } from "react";
import Piano from "../../components/Piano/Piano";
import OscillatorList from "../../components/OscillatorList/OscillatorList";
import useAudioContext from "../../hooks/useAudioContext";
import useOscillators from "../../hooks/useOscillator";
import PresetList from "../../components/PresetList/PresetList";
import PresetForm from "../../components/PresetForm/PresetForm";
import usePresets from "../../hooks/usePresets";
import { OscillatorContext } from "../../context/OscillatorContext";
import { CustomAudioContext } from "../../context/CustomAudioContext";
import React from "react";
import { ColorContext } from "../../context/ColorContext";
import { CustomOscillatorContext } from "../../context/CustomOscillatorContext";
import useWindowType from "../../hooks/useWindowType";
import { OscillatorTypesContext } from "../../context/OscillatorTypesContext";
import useOscillatorTypes from "../../hooks/useOscillatorTypes";

export function PolyphonicTS1() {
  const { types } = useOscillatorTypes();

  const { audioContext, filters } = useAudioContext(4);

  const { isMobile, isDesktop } = useWindowType();

  const {
    customOsc,
    oscillators,
    setCustomOsc,
    onOscillatorTypeChange,
    onOscillatorToggleEnabled,
    onOscillatorDetuneChange,
    onOscillatorSustainChange,
    onOscillatorResonanceChange,
    onOscillatorDelayChange,
    onOscillatorVolumeChange,
    handleOscillatorOctaveChange,
    handleNotePlay,
    handleNoteStop,
  } = useOscillators({
    audioContext: audioContext as AudioContext,
    filters,
  });

  const { color, setColor } = useContext(ColorContext);

  const {
    presets,
    selectedPreset,
    handleSavePreset,
    handleSelectPreset,
    handleDeletePreset,
  } = usePresets(setCustomOsc);

  return (
    <CustomAudioContext.Provider value={audioContext}>
      <CustomOscillatorContext.Provider value={customOsc}>
        <OscillatorTypesContext.Provider value={types}>
          <OscillatorContext.Provider value={oscillators}>
            <div
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    marginBottom: 10,
                  }}
                >
                  Polyphonic TS-1{" "}
                  <input
                    type="color"
                    value={color}
                    aria-label="Change the synths theme color"
                    onChange={(e) => setColor?.(e.target.value)}
                  />
                </h1>
              </div>

              {!isMobile && (
                <p
                  style={{
                    paddingTop: 10,
                    borderTop: "1px solid #eee",
                    marginBottom: 0,
                    marginTop: 0,
                    position: "absolute",
                    maxWidth: 400,
                  }}
                >
                  A powerful and flexible synthesizer for crafting intricate
                  soundscapes through precise control over oscillators, filters,
                  and effects.
                </p>
              )}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {audioContext && oscillators[0]?.type && isDesktop && (
                  <div
                    style={{
                      width: 500,
                      height: 120,
                    }}
                  />
                )}
                <div
                  style={{
                    minHeight: 120,
                    minWidth: isDesktop ? 500 : 0,
                  }}
                ></div>
                <div style={{ display: "flex" }}>
                  <PresetList
                    presets={presets}
                    onSelectPreset={handleSelectPreset}
                  />

                  <PresetForm
                    onSavePreset={handleSavePreset}
                    selectedPreset={selectedPreset}
                    onDeletePreset={handleDeletePreset}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                }}
              >
                <OscillatorList
                  onOscillatorTypeChange={onOscillatorTypeChange}
                  onOscillatorToggleEnabled={onOscillatorToggleEnabled}
                  onOscillatorDelayChange={onOscillatorDelayChange}
                  onOscillatorDetuneChange={onOscillatorDetuneChange}
                  onOscillatorSustainChange={onOscillatorSustainChange}
                  onOscillatorResonanceChange={onOscillatorResonanceChange}
                  onOscillatorVolumeChange={onOscillatorVolumeChange}
                  onOscillatorOctaveChange={handleOscillatorOctaveChange}
                />
              </div>
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.9)",
                  padding: "0 30px",
                  paddingTop: 30,
                  borderRadius: 3,
                }}
              >
                <Piano
                  onNotePlay={handleNotePlay}
                  onNoteStop={handleNoteStop}
                />
              </div>
            </div>
          </OscillatorContext.Provider>
        </OscillatorTypesContext.Provider>
      </CustomOscillatorContext.Provider>
    </CustomAudioContext.Provider>
  );
}

const MemoizedPolyphonicTS1 = React.memo(PolyphonicTS1);
export default MemoizedPolyphonicTS1;
