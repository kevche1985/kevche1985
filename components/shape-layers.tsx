"use client"
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react"

interface Shape {
  id: string
  type: "circle" | "square" | "triangle"
  color: string
  borderColor: string
  borderWidth: number
}

interface ShapeLayersProps {
  shapes: Shape[]
  selectedShapeId: string | null
  onSelectShape: (id: string) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  onDelete: (id: string) => void
}

export function ShapeLayers({
  shapes,
  selectedShapeId,
  onSelectShape,
  onMoveUp,
  onMoveDown,
  onDelete,
}: ShapeLayersProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Layers</h3>
      <div className="border rounded overflow-hidden">
        {shapes.length === 0 ? (
          <p className="p-3 text-sm text-gray-500">No shapes added yet</p>
        ) : (
          <ul>
            {shapes.map((shape, index) => (
              <li
                key={shape.id}
                className={`flex items-center justify-between p-2 border-b last:border-b-0 cursor-pointer ${
                  selectedShapeId === shape.id ? "bg-blue-50" : ""
                }`}
                onClick={() => onSelectShape(shape.id)}
              >
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 mr-2 rounded"
                    style={{
                      backgroundColor: shape.color,
                      border: `${shape.borderWidth}px solid ${shape.borderColor}`,
                    }}
                  />
                  <span className="text-sm capitalize">{shape.type}</span>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onMoveUp(shape.id)
                    }}
                    disabled={index === shapes.length - 1}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onMoveDown(shape.id)
                    }}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(shape.id)
                    }}
                    className="p-1 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
