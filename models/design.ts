export interface DesignElement {
  id: string
  type: "text" | "image" | "shape"
  properties: {
    x: number
    y: number
    width: number
    height: number
    rotation: number
    [key: string]: any // Additional properties based on element type
  }
}

export interface Design {
  id: string
  userId: string
  name: string
  description?: string
  productId?: string
  elements: DesignElement[]
  previewImage?: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
  tags?: string[]
}

export interface DesignRepository {
  createDesign(design: Omit<Design, "id" | "createdAt" | "updatedAt">): Promise<Design>
  getDesignById(id: string): Promise<Design | null>
  updateDesign(id: string, updates: Partial<Omit<Design, "id" | "userId" | "createdAt">>): Promise<Design | null>
  deleteDesign(id: string): Promise<boolean>
  listDesignsByUser(userId: string, page?: number, limit?: number): Promise<Design[]>
  listPublicDesigns(page?: number, limit?: number): Promise<Design[]>
  searchDesigns(query: string, userId?: string): Promise<Design[]>
}
