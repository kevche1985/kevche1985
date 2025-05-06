"use client"

interface ShapePreset {
  id: string
  name: string
  color: string
  borderColor: string
  borderWidth: number
}

interface ShapePresetsProps {
  onSelectPreset: (preset: ShapePreset) => void
}

const presets: ShapePreset[] = [
  {
    id: "preset-1",
    name: "Basic",
    color: "#FF5733",
    borderColor: "#000000",
    borderWidth: 2,
  },
  {
    id: "preset-2",
    name: "Bold",
    color: "#33A1FF",
    borderColor: "#003366",
    borderWidth: 5,
  },
  {
    id: "preset-3",
    name: "Neon",
    color: "#39FF14",
    borderColor: "#FF00FF",
    borderWidth: 3,
  },
  {
    id: "preset-4",
    name: "Minimal",
    color: "#FFFFFF",
    borderColor: "#333333",
    borderWidth: 1,
  },
  {
    id: "preset-5",
    name: "Contrast",
    color: "#FFFF00",
    borderColor: "#000000",
    borderWidth: 4,
  },
]

export function ShapePresets({ onSelectPreset }: ShapePresetsProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Shape Presets</h3>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="flex items-center p-2 border rounded hover:bg-gray-100"
          >
            <div
              className="w-6 h-6 mr-2 rounded"
              style={{
                backgroundColor: preset.color,
                border: `${preset.borderWidth}px solid ${preset.borderColor}`,
              }}
            />
            <span className="text-sm">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
