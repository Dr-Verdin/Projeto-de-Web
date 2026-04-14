import type { Community } from "../types/Community";
import type { Post } from "../types/Post";
import type { User } from "../types/User";

{/* USERS E COMMUNITIES */ }
export const users: Record<string, User> = {
  "1": {
    avatar: "/avatar_camz.jpg",
    name: "Camila Piscioneri",
    pronoun: "ela/dela",
    username: "@dr_verdin",
    
    bio: "Estudante de Ciência de Computação no ICMC-USP 📚✨",
    
    studyTime: 345,
    followers: 120,
    following: 80,

    email: "piscioneri@gmail.com",
    senha: "123456",
  }
}

export const communities: Record<string, Community> = {
  "1": {
    communityId: "1",
    userId: "1",

    name: "Estudando com gatos",
    description: "Para quem estuda com um gato do lado 🐱📚",

    rules: "1. Respeitar os outros membros\n2. Compartilhar dicas e experiências\n3. Postar fotos dos seus gatos estudando",
    members: 120,
    image: "/community_perfil.jpg",
  }
}

{/* POSTS */}
export const posts: Post[] = [
  {
    id: "1",
    type: "user",

    title: "Quando você não pode estudar porque precisa dormir, mas não pode dormir porque precisa estudar...",

    tags: ["#faculdade", "#madrugada", "#hardstudy"],

    createdAt: "2026-04-01",

    likes: 10,
    comments: 2,

    userId: "1",
  },
  {
    id: "2",
    type: "user",

    title: "📖 estudando cálculo hoje...",
    text: "integral dupla tá começando a fazer sentido, mas ainda me perco na hora de mudar a ordem 😭\n\nalguém mais sofre com isso ou sou só eu?",
    image: "/post1_user.jpg",
    tags: ["#matematica", "#faculdade", "#calculo2"],
    createdAt: "2026-04-11",

    likes: 5,
    comments: 1,

    userId: "1",
  },
  {
    id: "3",
    type: "community",

    title: "Pitu não me deixa estudar... 🐾📖",
    text: "Meu gato, o Pitu, é super carinhoso e adora ficar no meu colo enquanto estudo, mas às vezes ele fica tão grudado que não consigo me concentrarkk",
    image: "/post1_community.jpg",

    likes: 15,
    comments: 3,
    createdAt: "2026-04-05",

    communityId: "1",
  },
  {
    id: "4",
    type: "community",

    title: "Alguém tem que estudar nessa casa",
    text: "",
    image: "/post2_community.jpg",

    likes: 8,
    comments: 2,
    createdAt: "2026-04-10",

    communityId: "1",
  }
]