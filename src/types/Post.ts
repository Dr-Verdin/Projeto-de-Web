export type Post = {
  id: string
  type: "user" | "community"
  title: string
  text?: string
  image?: string
  avatar?: string
  tags?: string[]
  createdAt: string
  likes: number
  userId: string
  communityId?: string
}