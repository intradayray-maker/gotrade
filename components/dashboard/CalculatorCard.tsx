"use client";

import { useState, useEffect, useRef } from "react";

export function CalculatorCard() {
  const [display, setDisplay] = useState("0");
  const [storedValue, setStoredValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [expression, setExpression] = useState("");

  // HISTORY SYSTEM
  const [history, setHistory] = useState<{ text: string; pinned: boolean }[]>([]);
  const [lastAddedIndex, setLastAddedIndex] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);

  // SWIPE STATE
  const swipeStartX = useRef<number | null>(null);
  const swipeIndex = useRef<number | null>(null);

  // LIVE LOCAL TIME
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setLocalTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  const fadeInClass = "opacity-0 animate-[fadeIn_0.35s_ease-out_forwards]";

  // SAFE LIVE FORMATTING
  const formatDisplay = (value: string) => {
    if (value === "" || value === "-" || value === "." || value === "-.") return value;

    const hasTrailingDot = value.endsWith(".");
    const [rawIntPart, rawDecimalPart] = value.split(".");

    let intPart = rawIntPart.replace(/,/g, "");
    let sign = "";

    if (intPart.startsWith("-")) {
      sign = "-";
      intPart = intPart.slice(1);
      if (intPart === "") return value;
    }

    if (intPart === "" || isNaN(Number(intPart))) return value;

    const formattedInt = Number(intPart).toLocaleString("en-US");

    if (rawDecimalPart !== undefined) return `${sign}${formattedInt}.${rawDecimalPart}`;
    if (hasTrailingDot) return `${sign}${formattedInt}.`;

    return `${sign}${formattedInt}`;
  };

const gtRed = `
  rounded-lg
  bg-[rgb(84,33,33)]
  text-[rgb(225,254,234)]
  border-[5px] border-transparent
  relative overflow-hidden
  shadow-[0_0_34px_rgba(84,33,33,0.55)]
  py-5 text-xl
  transition-all duration-150
  hover:bg-[rgb(100,40,40)]
  active:bg-[rgb(70,28,28)]
  active:scale-[0.97]
`;



const gtGreen = `
  rounded-lg
  bg-[rgb(3,82,65)]
  text-[rgb(225,254,234)]
  border-[5px] border-transparent
  relative overflow-hidden
  shadow-[0_0_34px_rgba(3,82,65,0.55)]
  py-5 text-xl
  transition-all duration-150
  hover:bg-[rgb(5,100,80)]
  active:bg-[rgb(2,60,48)]
  active:scale-[0.97]
`;


  // NUMBER + OPERATOR BUTTONS (patched)
  const gtGreenBorderOnly = `
    rounded-lg
    bg-[rgb(0, 0, 0)]
    py-5 text-xl text-slate-100
    hover:bg-[#1a1c27]
    hover:border-[rgb(3,100,80)]
    transition-all duration-150 active:scale-[0.97]
  `;

  // CLEAR
  const handleClear = () => {
    setDisplay("0");
    setStoredValue(null);
    setOperation(null);
    setExpression("");
    setShouldResetDisplay(false);
  };

  // NUMBER INPUT
  const handleNumber = (num: string) => {
    setDisplay(prev => (prev === "0" || shouldResetDisplay ? num : prev + num));
    setShouldResetDisplay(false);
  };

  // OPERATION
  const handleOperation = (op: string) => {
    if (op === "-" && display === "0" && storedValue === null) {
      setDisplay("-");
      setShouldResetDisplay(false);
      return;
    }

    if (op === "-" && shouldResetDisplay) {
      setDisplay("-");
      setShouldResetDisplay(false);
      return;
    }

    setStoredValue(Number(display));
    setOperation(op);
    setExpression(display + " " + op);
    setShouldResetDisplay(true);
  };

  // EQUALS
  const handleEquals = () => {
    if (storedValue === null || !operation) return;

    const current = Number(display);
    let result = storedValue;

    switch (operation) {
      case "+": result = storedValue + current; break;
      case "-": result = storedValue - current; break;
      case "×": result = storedValue * current; break;
      case "÷": result = current === 0 ? 0 : storedValue / current; break;
      case "%": result = storedValue % current; break;
    }

    const fullExpression = `${storedValue} ${operation} ${current} = ${result}`;
    setExpression(`${storedValue} ${operation} ${current} =`);
    setDisplay(String(result));

    setHistory(prev => [{ text: fullExpression, pinned: false }, ...prev].slice(0, 100));
    setLastAddedIndex(0);

    setStoredValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
  };

  // PIN
  const togglePin = (index: number) => {
    setHistory(prev => {
      const updated = [...prev];
      updated[index].pinned = !updated[index].pinned;
      updated.sort((a, b) => Number(b.pinned) - Number(a.pinned));
      return updated;
    });
  };

  // SWIPE DELETE
  const handleSwipeStart = (e: any, index: number) => {
    swipeStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    swipeIndex.current = index;
  };

  const handleSwipeEnd = (e: any) => {
    if (swipeStartX.current === null || swipeIndex.current === null) return;

    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    if (swipeStartX.current - endX > 60) {
      setHistory(prev => prev.filter((_, i) => i !== swipeIndex.current));
    }

    swipeStartX.current = null;
    swipeIndex.current = null;
  };

  return (
    <div className="p-0">
      
{/* HEADER */}
<div className="space-y-2 p-1 mt-0 mb-3">
<div className="flex items-center justify-between">

<p className="text-xs font-medium text-slate-500">

</p>
</div>
</div>



      {/* DISPLAY (TF GREEN BORDER) */}
      <div
        className="
        relative rounded-lg bg-black/40 p-6 text-right mb-7
        border-[5px] border-transparent
        before:absolute before:inset-0 before:p-[2px]
        before:rounded-lg
        before:bg-gradient-to-br before:from-emerald-300 before:to-emerald-700
        before:-z-10
      "
      >
        {/* COPY ICON */}
        <button
          onClick={() => navigator.clipboard.writeText(formatDisplay(display))}
          className="absolute left-3 top-3 text-slate-500 hover:text-slate-200 hover:scale-110 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.25)] transition-all duration-150"
          title="Copy"
        >
          📋
        </button>

        <div className="text-slate-400 text-sm h-5">{expression}</div>

        <div className="text-6xl font-semibold text-slate-100 mt-3">
          {formatDisplay(display)}
        </div>
      </div>

      {/* KEYPAD */}
      <div className="grid grid-cols-4 gap-2 gap-y-6">

        {/* RED BUTTONS */}
        <button className={gtRed} onClick={handleClear}>C</button>
        <button className={gtRed} onClick={() => setDisplay(display.slice(0, -1) || "0")}>⟵</button>

        {/* NUMBER + OPERATOR BUTTONS */}
        <button className={gtGreenBorderOnly} onClick={() => handleOperation("%")}>%</button>
        <button className={gtGreenBorderOnly} onClick={() => handleOperation("÷")}>÷</button>

        <button className={gtGreenBorderOnly} onClick={() => handleNumber("7")}>7</button>
        <button className={gtGreenBorderOnly} onClick={() => handleNumber("8")}>8</button>
        <button className={gtGreenBorderOnly} onClick={() => handleNumber("9")}>9</button>
        <button className={gtGreenBorderOnly} onClick={() => handleOperation("×")}>×</button>

        <button className={gtGreenBorderOnly} onClick={() => handleNumber("4")}>4</button>
        <button className={gtGreenBorderOnly} onClick={() => handleNumber("5")}>5</button>
        <button className={gtGreenBorderOnly} onClick={() => handleNumber("6")}>6</button>
        <button className={gtGreenBorderOnly} onClick={() => handleOperation("-")}>−</button>

        <button className={gtGreenBorderOnly} onClick={() => handleNumber("1")}>1</button>
        <button className={gtGreenBorderOnly} onClick={() => handleNumber("2")}>2</button>
        <button className={gtGreenBorderOnly} onClick={() => handleNumber("3")}>3</button>
        <button className={gtGreenBorderOnly} onClick={() => handleOperation("+")}>+</button>

        <button className={gtGreenBorderOnly} onClick={() => handleNumber(".")}>.</button>
        <button className={gtGreenBorderOnly} onClick={() => handleNumber("0")}>0</button>

        {/* EQUALS BUTTON (TF GREEN) */}
        <button className={`${gtGreen} col-span-2`} onClick={handleEquals}>=</button>
      </div>

      {/* HISTORY DRAWER */}
      <div className="mt-10 border-t border-slate-800 pt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">History</p>

          <div className="flex items-center gap-4">
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-[10px] uppercase tracking-wide text-red-400 hover:text-red-300 transition"
              >
                Clear
              </button>
            )}

            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="text-[10px] uppercase tracking-wide text-slate-400 hover:text-slate-200 transition"
            >
              {drawerOpen ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {drawerOpen && (
          <div className="max-h-48 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {history.map((item, idx) => {
              const isNew = idx === lastAddedIndex;

              return (
                <div
                  key={idx}
                  className={
                    "flex items-center justify-between p-2 rounded-md transition cursor-pointer select-none " +
                    (isNew
                      ? "bg-emerald-500/10 drop-shadow-[0_0_6px_rgba(16,185,129,0.55)] " + fadeInClass
                      : "hover:bg-white/5")
                  }
                  onClick={() => {
                    const parts = item.text.split("=");
                    const result = parts[1]?.trim();
                    if (result) setDisplay(result);
                  }}
                  onMouseDown={e => handleSwipeStart(e, idx)}
                  onMouseUp={e => handleSwipeEnd(e)}
                  onTouchStart={e => handleSwipeStart(e, idx)}
                  onTouchEnd={e => handleSwipeEnd(e)}
                >
                  <p className="text-sm font-mono truncate text-slate-300">{item.text}</p>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      togglePin(idx);
                    }}
                    className={
                      "text-xs ml-3 " +
                      (item.pinned
                        ? "text-emerald-400"
                        : "text-slate-500 hover:text-slate-300")
                    }
                  >
                    📌
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

