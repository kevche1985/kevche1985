import type { Design, DesignRepository } from "../models/design"
import {
  setValue,
  getValue,
  deleteValue,
  getMultipleValues,
  addToSet,
  getSetMembers,
  removeFromSet,
  incrementCounter,
} from "../lib/kv-store"

export class RedisDesignRepository implements DesignRepository {
  private readonly designPrefix = "design:"
  private readonly userDesignsIndex = "index:design:user:"
  private readonly publicDesignsSet = "set:designs:public"
  private readonly designIdCounter = "counter:design:id"
  private readonly designTagsIndex = "index:design:tag:"

  async createDesign(designData: Omit<Design, "id" | "createdAt" | "updatedAt">): Promise<Design> {
    const id = `design_${await incrementCounter(this.designIdCounter)}`
    const now = new Date().toISOString()

    const design: Design = {
      ...designData,
      id,
      createdAt: now,
      updatedAt: now,
    }

    // Store the design
    await setValue(`${this.designPrefix}${id}`, design)

    // Add to user's designs
    await addToSet(`${this.userDesignsIndex}${designData.userId}`, id)

    // If public, add to public designs set
    if (designData.isPublic) {
      await addToSet(this.publicDesignsSet, id)
    }

    // Index by tags
    if (designData.tags && designData.tags.length > 0) {
      for (const tag of designData.tags) {
        await addToSet(`${this.designTagsIndex}${tag.toLowerCase()}`, id)
      }
    }

    return design
  }

  async getDesignById(id: string): Promise<Design | null> {
    return getValue<Design>(`${this.designPrefix}${id}`)
  }

  async updateDesign(
    id: string,
    updates: Partial<Omit<Design, "id" | "userId" | "createdAt">>,
  ): Promise<Design | null> {
    const design = await this.getDesignById(id)
    if (!design) return null

    // Handle public status change
    if (updates.isPublic !== undefined && updates.isPublic !== design.isPublic) {
      if (updates.isPublic) {
        await addToSet(this.publicDesignsSet, id)
      } else {
        await removeFromSet(this.publicDesignsSet, id)
      }
    }

    // Handle tags change
    if (updates.tags) {
      // Remove old tags
      if (design.tags) {
        for (const tag of design.tags) {
          await removeFromSet(`${this.designTagsIndex}${tag.toLowerCase()}`, id)
        }
      }

      // Add new tags
      for (const tag of updates.tags) {
        await addToSet(`${this.designTagsIndex}${tag.toLowerCase()}`, id)
      }
    }

    const updatedDesign: Design = {
      ...design,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    await setValue(`${this.designPrefix}${id}`, updatedDesign)

    return updatedDesign
  }

  async deleteDesign(id: string): Promise<boolean> {
    const design = await this.getDesignById(id)
    if (!design) return false

    // Remove from user's designs
    await removeFromSet(`${this.userDesignsIndex}${design.userId}`, id)

    // Remove from public designs if applicable
    if (design.isPublic) {
      await removeFromSet(this.publicDesignsSet, id)
    }

    // Remove from tag indexes
    if (design.tags) {
      for (const tag of design.tags) {
        await removeFromSet(`${this.designTagsIndex}${tag.toLowerCase()}`, id)
      }
    }

    // Delete design
    await deleteValue(`${this.designPrefix}${id}`)

    return true
  }

  async listDesignsByUser(userId: string, page = 1, limit = 20): Promise<Design[]> {
    const designIds = await getSetMembers(`${this.userDesignsIndex}${userId}`)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = designIds.slice(start, end)

    const designKeys = paginatedIds.map((id) => `${this.designPrefix}${id}`)
    const designs = await getMultipleValues<Design>(designKeys)

    return designs.filter((design): design is Design => design !== null)
  }

  async listPublicDesigns(page = 1, limit = 20): Promise<Design[]> {
    const designIds = await getSetMembers(this.publicDesignsSet)

    // Simple pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedIds = designIds.slice(start, end)

    const designKeys = paginatedIds.map((id) => `${this.designPrefix}${id}`)
    const designs = await getMultipleValues<Design>(designKeys)

    return designs.filter((design): design is Design => design !== null)
  }

  async searchDesigns(query: string, userId?: string): Promise<Design[]> {
    // Search by tag
    const tagDesignIds = await getSetMembers(`${this.designTagsIndex}${query.toLowerCase()}`)

    // If userId is provided, filter to only that user's designs
    let designIds = tagDesignIds
    if (userId) {
      const userDesignIds = await getSetMembers(`${this.userDesignsIndex}${userId}`)
      designIds = tagDesignIds.filter((id) => userDesignIds.includes(id))
    }

    const designKeys = designIds.map((id) => `${this.designPrefix}${id}`)
    const designs = await getMultipleValues<Design>(designKeys)

    return designs.filter((design): design is Design => design !== null)
  }
}
