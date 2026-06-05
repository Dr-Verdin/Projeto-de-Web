export type Community = {
  communityId: string
  userId: string
  name: string
  description: string
  visibility: "public" | "private"
  createdAt: string
  rules: string
  members: number
  avatar?: string
  background?: string
}