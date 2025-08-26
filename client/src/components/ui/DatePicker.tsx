"use client"

import * as React from "react"
import * as Popover from "@radix-ui/react-popover"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { format } from "date-fns"

export function DatePicker() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="flex items-center border border-gray-300 px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-4 h-4 mr-1 text-gray-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75h18M4.5 7.5h15v12H4.5V7.5z"
            />
          </svg>
          {date ? format(date, "PPP") : "Pick a date"}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          className="rounded-lg bg-white shadow-lg border border-gray-200 p-3 z-50"
        >
          <DayPicker
            mode="single"
            selected={date}
            onSelect={setDate}
            className="text-sm"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
