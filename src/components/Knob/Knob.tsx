import React, { useRef, useEffect, useState } from "react";

interface KnobProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (newValue: number) => void;
  knobStyle?: React.CSSProperties;
  indicatorStyle?: React.CSSProperties;
  label?: string;
  onDoubleClick?: () => void;
}

const Knob: React.FC<KnobProps> = ({
  value,
  min,
  max,
  step,
  onChange,
  knobStyle,
  onDoubleClick,
  indicatorStyle,
  label = "",
}) => {
  const knobRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    event.preventDefault();
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && knobRef.current) {
      const rect = knobRef.current.getBoundingClientRect();
      const knobSize = rect.width;
      const centerX = rect.left + knobSize / 2;
      const centerY = rect.top + knobSize / 2;
      const angle = Math.atan2(
        event.clientY - centerY,
        event.clientX - centerX
      );
      const newValue =
        Math.round(((angle / (Math.PI * 2) + 0.5) * (max - min)) / step) *
          step +
        min;
      if (newValue >= max) return;
      onChange(newValue);
    }
  };

  const indicatorRotation = valueToAngle(value, min, max);

  return (
    <div
      ref={knobRef}
      aria-label={`${label} knob ${value}`}
      style={{ ...knobStyle, ...defaultKnobStyle }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onDoubleClick={onDoubleClick}
    >
      <div
        style={{
          ...indicatorStyle,
          ...defaultIndicatorStyle,
          transform: `rotate(${indicatorRotation}deg)`,
        }}
      />
      {label && <div style={labelStyle}>{label}</div>}
    </div>
  );
};

const defaultKnobStyle: React.CSSProperties = {
  position: "relative",
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "#ddd",
  cursor: "pointer",
  margin: "20px 0",
};

const defaultIndicatorStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "40%",
  height: "4px",
  background: "#333",
  transformOrigin: "left center",
  transform: "translate(-50%, -50%) rotate(-90deg)", // Start at the middle (12 o'clock position)
};

const labelStyle: React.CSSProperties = {
  position: "absolute",
  bottom: -30,
  textAlign: "center",
  padding: "4px",
  fontSize: "12px",
  color: "#eee",
};

const valueToAngle = (value: number, min: number, max: number) => {
  const normalizedValue = (value - min) / (max - min);
  const clampedValue = clampValue(normalizedValue, 0, 1);
  return clampedValue * 270 - 220; // Range of 0deg to +270deg
};

const clampValue = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

const MemoizedKnob = React.memo(Knob);

export default MemoizedKnob;
