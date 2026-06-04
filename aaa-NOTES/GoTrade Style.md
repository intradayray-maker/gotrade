GOTRADE DESIGN SYSTEM v1.0  
--------------------------------------------------------
1. TYPOGRAPHY SYSTEM
--------------------------------------------------------

H1:
  text-3xl
  font-bold
  tracking-tight
  text-white/90
  drop-shadow-[0_0_10px_rgba(0,255,180,0.25)]

H2:
  text-2xl
  font-semibold
  text-white/80
  tracking-tight

H3:
  text-sm
  font-semibold
  text-white/70
  tracking-wide

Subheading:
  text-white/50
  text-sm
  tracking-wide
  max-w-md

Body:
  text-sm text-white/70

Muted:
  text-white/50

Extra Muted:
  text-white/40

Font Weights:
  Headings: bold
  Subheadings: medium
  Body: normal

Tracking:
  Headings: tight
  Subheadings: wide
  Body: normal


--------------------------------------------------------
2. SPACING SYSTEM
--------------------------------------------------------

Page Container:
  max-w-5xl mx-auto
  px-4 md:px-6 lg:px-8
  space-y-10

Card Padding:
  p-6 (outer)
  p-4 or p-5 (inner)

Gap Sizes:
  Small: gap-2
  Medium: gap-3
  Large: gap-4
  XL: gap-6

Vertical Rhythm:
  Major sections: space-y-10
  Subheading: mt-2
  Underline: mt-4


--------------------------------------------------------
3. ICON STYLE
--------------------------------------------------------

TF Icon:
  w-7 h-7
  text-emerald-400
  drop-shadow-[0_0_6px_rgba(0,255,180,0.35)]
  strokeWidth="1.6"

General Icons:
  Library: Lucide or Heroicons outline
  Size: 20–24px
  Color: white/70 or emerald-400
  Glow: subtle emerald glow


--------------------------------------------------------
4. LAYOUT RULES
--------------------------------------------------------

Page Layout:
  max-w-5xl centered
  flex or grid depending on section
  space-y-10 between sections

Heading Block:
  flex items-center gap-3
  H1 + TF icon
  subheading below
  emerald underline below that

Panels:
  rounded-lg
  bg-[#0f0f17]
  border border-slate-800/40
  p-3 or p-4 or p-5
  text-center

Dashboard Grid:
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
  gap-4

Breadcrumb:
  flex items-center gap-2
  text-[13px] text-white/40
  hover:text-white/70


--------------------------------------------------------
5. MODAL STYLE
--------------------------------------------------------

Background:
  bg-[#0b0b12]

Border:
  border border-white/10

Padding:
  p-6

Radius:
  rounded-xl

Backdrop:
  backdrop-blur-xl

Shadow:
  shadow-[0_0_25px_rgba(0,0,0,0.5)]

Animation:
  fade + slight upward motion (0.3s)


--------------------------------------------------------
6. TABLE STYLE
--------------------------------------------------------

Header:
  bg-[#0f0f17]
  text-slate-400

Rows:
  bg-[#0b0b12]
  hover:bg-white/5

Borders:
  border-slate-800/40

Cell Padding:
  p-3 or p-4

Text:
  text-white/80


--------------------------------------------------------
7. GOTRADE COLOR PALETTE
--------------------------------------------------------

FlowGreen = rgb(3,82,65)
FlowRed   = rgb(84,33,33)
FlowGold  = rgb(113,97,20)

Emerald Gradient Border:
  from-emerald-500/40
  via-teal-400/40
  to-emerald-600/40

Dark Panel:
  #0b0b12

Secondary Panel:
  #0f0f17

Borders:
  border-slate-800/40


--------------------------------------------------------
8. GOTRADE CARD COMPONENT (GTCard)
--------------------------------------------------------
components\ui\GTCard.tsx

"use client";
import React from "react";
interface GTCardProps extends
React.HTMLAttributes<HTMLDivElement> 
{children: React.ReactNode;}
export default function GTCard
({ children, className, ...rest }: GTCardProps)
{return (<divclassName={"relative rounded-xl p-[2px] bg-gradient-to-br
from-emerald-500/40 via-teal-400/40 to-emerald-600/40 
shadow-[0_0_25px_rgba(0,0,0,0.5)] " +(className || "")}
{...rest}><div className="rounded-xl bg-[#0b0b12] p-6">
{children}</div></div>);}

--------------------------------------------------------
9. GOTRADE BUTTON SYSTEM
--------------------------------------------------------

Green Button:
  bg-[rgb(3,82,65)]
  text-[rgb(225,254,234)]
  border-[5px] border-[rgb(3,82,65)]
  rounded-[6px]
  p-[15px]
  shadow-[0_0_34px_rgba(3,82,65,0.55)]

Red Button:
  bg-[rgb(84,33,33)]
  text-[rgb(225,254,234)]
  border-[5px] border-[rgb(84,33,33)]
  rounded-[6px]
  p-[15px]
  shadow-[0_0_34px_rgba(84,33,33,0.55)]


--------------------------------------------------------
10. JSX FORMATTING RULES (SIGNATURE STYLE)
--------------------------------------------------------

- Vertical whitespace JSX
- No indentation before tags
- One element per line
- Grouped closing tags
- Left-aligned JSX
- Spacious, readable layout
- No inline clutter

Example:

<div className="relative rounded-xl p-[2px] bg-gradient-to-br ...">

<div className="rounded-xl bg-[#0b0b12] p-4 h-full flex flex-col gap-4">

<div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-3 text-center">
<h3 className="text-xs bold text-slate-400 tracking-wide"> TOTAL LIVE P&L </h3>
</div>

<div className="w-full rounded-lg bg-[#0f0f17] border border-slate-800/40 p-5 text-center">
<p className={`text-3xl font-semibold ${totalUnrealizedPnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
{formatCurrency(totalUnrealizedPnl)}
</p>
</div></div></div>

