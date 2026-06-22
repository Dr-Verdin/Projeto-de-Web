export type Post = {
  id: string
  title: string
  content?: string
  image?: string
  createdAt: string
  updatedAt?: string
  authorId: string
  communityId?: string
  author?: {
    id: string
    username: string
    name: string
    avatar?: string
  }
}