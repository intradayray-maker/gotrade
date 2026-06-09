//app\components\GTHeaderCell.tsx 


import { GTTheme } from "@/app/theme/GTTheme"

export default function GTHeaderCell({
  children,
  first = false,
  last = false,
}: {
  children: React.ReactNode
  first?: boolean
  last?: boolean
}) {
  return (
    <th
      className={`
        ${GTTheme.table.headerBg}
        ${GTTheme.table.headerText}
        ${GTTheme.table.headerFont}
        ${GTTheme.table.headerPadding}
        ${GTTheme.table.headerBorder}
        ${first ? "rounded-tl-xl" : ""}
        ${last ? "rounded-tr-xl" : ""}
        text-left
      `}
    >
      {children}
    </th>
  )
}

