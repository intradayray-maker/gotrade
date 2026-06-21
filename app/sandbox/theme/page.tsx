"use client";

import { useState } from "react";
import GTCard from "@/components/ui/GTCard";
import Slider from "@/components/ui/Slider";

export default function ThemeSandbox() {
  const [primary, setPrimary] = useState("#035241"); // FlowGreen
  const [secondary, setSecondary] = useState("#542121"); // FlowRed
  const [accent, setAccent] = useState("#716114"); // FlowGold
  const [background, setBackground] = useState("#2C557D"); // FlowBlue

  const [font, setFont] = useState("Verdana"); // GoFont
  const [fontColor, setFontColor] = useState("#E1FEEA"); // GoLightGray

  const [radius, setRadius] = useState(6);
  const [padding, setPadding] = useState(15);
  const [shadow, setShadow] = useState(34);

  const [borderThickness, setBorderThickness] = useState(5);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [useGradientBorder, setUseGradientBorder] = useState(true);
  const [animateBorder, setAnimateBorder] = useState(false);

  const [hoverRipple, setHoverRipple] = useState(false);
  const [hoverGlow, setHoverGlow] = useState(false);
  const [hoverLift, setHoverLift] = useState(false);

  return (
    <div className="max-w-6xl mx-auto py-16 space-y-12">

      <h1 className="text-4xl font-bold text-white text-center mb-10">
        GoTrade Theme Sandbox
      </h1>

      {/* ============================
          COLOR PICKERS (4)
      ============================ */}
      <GTCard>
        <h2 className="text-xl font-semibold text-white mb-4">Color Pickers</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Primary */}
          <div className="flex flex-col items-center gap-3">
            <input
              type="color"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="w-32 h-32 rounded-full cursor-pointer border border-white/10 shadow-lg"
            />
            <p className="text-white/70 text-sm">Primary</p>
            <p className="text-white text-xs">{primary}</p>
          </div>

          {/* Secondary */}
          <div className="flex flex-col items-center gap-3">
            <input
              type="color"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
              className="w-32 h-32 rounded-full cursor-pointer border border-white/10 shadow-lg"
            />
            <p className="text-white/70 text-sm">Secondary</p>
            <p className="text-white text-xs">{secondary}</p>
          </div>

          {/* Accent */}
          <div className="flex flex-col items-center gap-3">
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              className="w-32 h-32 rounded-full cursor-pointer border border-white/10 shadow-lg"
            />
            <p className="text-white/70 text-sm">Accent</p>
            <p className="text-white text-xs">{accent}</p>
          </div>

          {/* Background */}
          <div className="flex flex-col items-center gap-3">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-32 h-32 rounded-full cursor-pointer border border-white/10 shadow-lg"
            />
            <p className="text-white/70 text-sm">Background</p>
            <p className="text-white text-xs">{background}</p>
          </div>

        </div>
      </GTCard>

      {/* ============================
          LOCKED PALETTE
      ============================ */}
      <GTCard>
        <h2 className="text-xl font-semibold text-white mb-4">Locked Palette</h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">

          {/* FlowRed */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-16 w-full rounded-lg shadow-lg border border-white/10" style={{ background: "#542121" }} />
            <p className="text-white/70 text-xs">#542121</p>
            <p className="text-white/40 text-[10px]">rgb(84,33,33)</p>
          </div>

          {/* FlowGold */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-16 w-full rounded-lg shadow-lg border border-white/10" style={{ background: "#716114" }} />
            <p className="text-white/70 text-xs">#716114</p>
            <p className="text-white/40 text-[10px]">rgb(113,97,20)</p>
          </div>

          {/* FlowBlue */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-16 w-full rounded-lg shadow-lg border border-white/10" style={{ background: "#2C557D" }} />
            <p className="text-white/70 text-xs">#2C557D</p>
            <p className="text-white/40 text-[10px]">rgb(44,85,125)</p>
          </div>

          {/* GoLightGray */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-16 w-full rounded-lg shadow-lg border border-white/10" style={{ background: "#E1FEEA" }} />
            <p className="text-white/70 text-xs">#E1FEEA</p>
            <p className="text-white/40 text-[10px]">rgb(225,254,234)</p>
          </div>

          {/* FlowGray */}
          <div className="flex flex-col items-center gap-1">
            <div className="h-16 w-full rounded-lg shadow-lg border border-white/10" style={{ background: "#545454" }} />
            <p className="text-white/70 text-xs">#545454</p>
            <p className="text-white/40 text-[10px]">rgb(84,84,84)</p>
          </div>

        </div>
      </GTCard>

      {/* ============================
          BUTTON BUILDER (ADVANCED)
      ============================ */}
      <GTCard>
        <div style={{ fontFamily: "Verdana" }}>
          <h2 className="text-xl font-semibold text-white mb-4">Button Builder</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Controls */}
            <div className="space-y-6">

              {/* Background */}
              <div>
                <p className="text-white/70 text-sm mb-1">Background Color</p>
                <input
                  type="color"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-white/10"
                />
              </div>

              {/* Text Color */}
              <div>
                <p className="text-white/70 text-sm mb-1">Text Color</p>
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border border-white/10"
                />
              </div>

              {/* Border Thickness */}
              <div>
                <p className="text-white/70 text-sm mb-1">Border Thickness</p>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={borderThickness}
                  onChange={(e) => setBorderThickness(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "rgb(84,84,84)" }}
                />
                <p className="text-white/40 text-xs mt-1">{borderThickness}px</p>
              </div>

              {/* Border Color */}
              {!useGradientBorder && (
                <div>
                  <p className="text-white/70 text-sm mb-1">Border Color</p>
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-white/10"
                  />
                </div>
              )}

              {/* Border Type Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={useGradientBorder}
                  onChange={() => setUseGradientBorder(!useGradientBorder)}
                />
                <p className="text-white/70 text-sm">Use Gradient Border</p>
              </div>

              {/* Animated Border Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={animateBorder}
                  onChange={() => setAnimateBorder(!animateBorder)}
                />
                <p className="text-white/70 text-sm">Animated Border</p>
              </div>

              {/* Hover Ripple */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={hoverRipple}
                  onChange={() => setHoverRipple(!hoverRipple)}
                />
                <p className="text-white/70 text-sm">Hover Ripple</p>
              </div>

              {/* Hover Glow */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={hoverGlow}
                  onChange={() => setHoverGlow(!hoverGlow)}
                />
                <p className="text-white/70 text-sm">Hover Glow</p>
              </div>

              {/* Hover Lift */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={hoverLift}
                  onChange={() => setHoverLift(!hoverLift)}
                />
                <p className="text-white/70 text-sm">Hover Lift</p>
              </div>

              {/* Radius */}
              <div>
                <p className="text-white/70 text-sm mb-1">Border Radius</p>
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "rgb(84,84,84)" }}
                />
                <p className="text-white/40 text-xs mt-1">{radius}px</p>
              </div>

              {/* Padding */}
              <div>
                <p className="text-white/70 text-sm mb-1">Padding</p>
                <input
                  type="range"
                  min="4"
                  max="24"
                  value={padding}
                  onChange={(e) => setPadding(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "rgb(84,84,84)" }}
                />
                <p className="text-white/40 text-xs mt-1">{padding}px</p>
              </div>

              {/* Shadow */}
              <div>
                <p className="text-white/70 text-sm mb-1">Shadow Strength</p>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={shadow}
                  onChange={(e) => setShadow(Number(e.target.value))}
                  className="w-full"
                  style={{ accentColor: "rgb(84,84,84)" }}
                />
                <p className="text-white/40 text-xs mt-1">{shadow}px</p>
              </div>

            </div>

            {/* Live Preview */}
            <div className="flex items-center justify-center">

              {/* Outer wrapper for gradient border */}
              <div
                className="p-[2px] rounded-lg"
                style={{
                  borderRadius: `${radius}px`,
                  background: useGradientBorder
                    ? "linear-gradient(135deg, rgb(3,82,65), rgb(113,97,20), rgb(84,33,33))"
                    : "transparent",
                  animation: animateBorder ? "spin 6s linear infinite" : "none",
                }}
              >
                <button
                  className={`
                    font-semibold transition-all duration-300 block
                    ${hoverRipple ? "button-ripple" : ""}
                    ${hoverGlow ? "button-glow" : ""}
                    ${hoverLift ? "button-lift" : ""}
                  `}
                  style={{
                    background: primary,
                    color: fontColor,
                    borderRadius: `${radius}px`,
                    padding: `${padding}px ${padding * 2}px`,
                    boxShadow: `0 0 ${shadow}px ${primary}55`,
                    border: useGradientBorder
                      ? "none"
                      : `${borderThickness}px solid ${borderColor}`,
                    fontFamily: "Verdana",
                  }}
                >
                  Live Button
                </button>
              </div>

            </div>

          </div>
        </div>
      </GTCard>

      {/* ============================
          SLIDERS (GoTrade)
      ============================ */}
      <GTCard>
        <h2 className="text-xl font-semibold text-white mb-4">Sliders</h2>

        <div className="space-y-10">

          {/* FlowBlue Slider */}
          <div className="flex flex-col gap-2" style={{ fontFamily: "Verdana" }}>
            <label className="text-[13px]" style={{ color: "rgb(225,254,234)" }}>
              FlowBlue Slider — 90%
            </label>

            <input
              type="range"
              defaultValue={90}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(44,85,125) 90%, rgb(84,84,84) 90%)`,
              }}
            />
          </div>

          {/* FlowGold Slider */}
          <div className="flex flex-col gap-2" style={{ fontFamily: "Verdana" }}>
            <label className="text-[13px]" style={{ color: "rgb(225,254,234)" }}>
              FlowGold Slider — 50%
            </label>

            <input
              type="range"
              defaultValue={50}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(113,97,20) 50%, rgb(84,84,84) 50%)`,
              }}
            />
          </div>

        </div>
      </GTCard>

      {/* ============================
          FONT PICKER
      ============================ */}
      <GTCard>
        <h2 className="text-xl font-semibold text-white mb-4">Font Picker</h2>

        <div className="flex flex-col md:flex-row gap-6 items-center">

          {/* Font Dropdown */}
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-white/10"
          >
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Tahoma">Tahoma</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="system-ui">System UI</option>
          </select>

          {/* Font Color */}
          <input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            className="w-20 h-20 rounded-full cursor-pointer border border-white/10 shadow-lg"
          />

          {/* Preview */}
          <div className="flex-1 p-4 rounded-lg bg-[#0f0f16] border border-white/10">
            <p style={{ fontFamily: font, color: fontColor }} className="text-xl">
              The quick brown fox jumps over the lazy dog.
            </p>
          </div>

        </div>
      </GTCard>

    </div>
  );
}

