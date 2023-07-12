import React, { useContext } from "react";
import { SineWaveProps } from "../SineWave/SineWave";
import OscillatorSettings from "../OscillatorSettings/OscillatorSettings";
import { OscillatorContext } from "../../context/OscillatorContext";
import { CustomOscillatorContext } from "../../context/CustomOscillatorContext";
import { OscillatorTypesContext } from "../../context/OscillatorTypesContext";

interface OscillatorListProps {
  onOscillatorTypeChange: (index: number, type: SineWaveProps["type"]) => void;
  onOscillatorToggleEnabled: (index: number) => void;
  onOscillatorDetuneChange: (index: number, value: number) => void;
  onOscillatorVolumeChange: (index: number, value: number) => void;
  onOscillatorOctaveChange: (index: number, value: number) => void;
  onOscillatorSustainChange: (index: number, value: number) => void;
  onOscillatorResonanceChange: (index: number, value: number) => void;
  onOscillatorDelayChange: (index: number, value: number) => void;
}

const OscillatorList: React.FC<OscillatorListProps> = ({
  onOscillatorTypeChange,
  onOscillatorVolumeChange,
  onOscillatorToggleEnabled,
  onOscillatorDetuneChange,
  onOscillatorSustainChange,
  onOscillatorResonanceChange,
  onOscillatorDelayChange,
  onOscillatorOctaveChange,
}) => {
  const oscillators = useContext(OscillatorContext);
  const customOsc = useContext(CustomOscillatorContext);
  const types = useContext(OscillatorTypesContext);

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      }}
    >
      {customOsc
        .sort((a, b) => a.sort - b.sort)
        .map((osc, i) => (
          <OscillatorSettings
            key={i}
            osc={osc}
            types={types}
            oscData={oscillators[i]}
            onChangeType={(type: SineWaveProps["type"]) =>
              onOscillatorTypeChange(i, type)
            }
            onToggleEnabled={() => onOscillatorToggleEnabled(i)}
            onChangeDetune={(value: number) =>
              onOscillatorDetuneChange(i, value)
            }
            onChangeSustain={(value: number) =>
              onOscillatorSustainChange(i, value)
            }
            onChangeResonance={(value: number) =>
              onOscillatorResonanceChange(i, value)
            }
            onVolumeChange={(value: number) =>
              onOscillatorVolumeChange(i, value)
            }
            onOctaveChange={(value: number) =>
              onOscillatorOctaveChange(i, value)
            }
            onDelayChange={(value: number) => onOscillatorDelayChange(i, value)}
          />
        ))}
    </section>
  );
};

const MemoizedOscillatorList = React.memo(OscillatorList);

export default MemoizedOscillatorList;
