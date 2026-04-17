import type { Community } from "../types/Community";
import type { Post } from "../types/Post";
import type { User } from "../types/User";

{/* USERS E COMMUNITIES */ }
export const users: Record<string, User> = {
  "1": {
    avatar: "/avatar_camz.jpg",
    name: "Larissa Rocha",
    pronoun: "ela/dela",
    username: "@lari_lari",
    
    bio: "Estudante de Matemática Aplicada no ICMC-USP 📚✨",
    
    studyTime: 345,
    followers: 120,
    following: 80,

    email: "lari@gmail.com",
    senha: "123456",
  },
    "2": {
    avatar: "/avatar_alice.jpg",
    name: "Alice",
    pronoun: "ela/dela",
    username: "@lice_alice",
    
    bio: "Estudante de Ciência da Computação no ICMC-USP 📚✨",
    
    studyTime: 1000,
    followers: 400,
    following: 80,

    email: "alice@gmail.com",
    senha: "345678",
  }
}

export const communities: Record<string, Community> = {
  "1": {
    communityId: "1",
    userId: "1",

    name: "Estudando com gatos",
    description: "Para quem estuda com um gato do lado 🐱📚",
    
    createdAt: "2025-12-01",
    visibility: "public",

    rules: "1. Respeitar os outros membros\n2. Compartilhar dicas e experiências\n3. Postar fotos dos seus gatos estudando",
    members: 120,
    avatar: "/community_perfil.jpg",
    background: "/community_fundo.jpg",
  },
  "2": {
    communityId: "2",
    userId: "1",

    name: "Aprendizes da culinária",
    description: "Comunidade para quem gosta de cozinhar e aprender receitas novas",
    
    createdAt: "2025-12-01",
    visibility: "public",

    rules: "1. Respeitar os outros membros\n2. Compartilhar dicas e experiências\n3. Postar receitas e dicas de cozinha",
    members: 10000,
    avatar: "/community_perfil2.jpg",
    background: "/community_background2.jpg",
  },
  "3": {
    communityId: "3",
    userId: "1",

    name: "Grafos e afins",
    description: "Comunidade para aprender e compartilhar conhecimento sobre grafos e algoritmos relacionados",
    
    createdAt: "2025-12-01",
    visibility: "public",

    rules: "1. Respeitar os outros membros\n2. Compartilhar dicas e experiências\n3. Postar códigos e projetos",
    members: 10000,
    avatar: "/community_perfil3.png",
    background: "/community_fundo3.jpg",
  },
  "4": {
    communityId: "4",
    userId: "1",

    name: "Matemática é vida",
    description: "Comunidade para aprender e compartilhar conhecimento sobre matemática em geral, desde o ensino médio até a pós-graduação",
    
    createdAt: "2025-11-01",
    visibility: "public",

    rules: "1. Respeitar os outros membros\n2. Compartilhar dicas e experiências\n3. Postar problemas e curiosidades matemáticas",
    members: 10000,
    avatar: "/community_perfil4.jpg",
    background: "/community_fundo4.jpg",
  }
}

{/* POSTS */}
export const posts: Post[] = [
  {
    id: "1",
    type: "user",

    title: "Quando você não pode estudar porque precisa dormir, mas não pode dormir porque precisa estudar...",

    tags: ["#faculdade", "#madrugada", "#hardstudy"],
    avatar: "/avatar_camz.jpg",

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
    avatar: "/avatar_camz.jpg",
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
    avatar: "/community_perfil.jpg",

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
    avatar: "/community_perfil.jpg",

    likes: 8,
    comments: 2,
    createdAt: "2026-04-10",

    communityId: "1",
  },
  {
    id: "5",
    type: "community",

    title: "Mousse delicioso 🤤",
    text: `    6 ovos\n100g de açúcar refinado
    150g de manteiga sem sal
    300g de chocolate 70% cacau
    1 colher de chá de essência de baunilha (opcional)
    50ml de licor de café ou 50ml de café expresso`,
    image: "/post1community 2.jpg",
    avatar: "/community_perfil.jpg",

    likes: 8,
    comments: 2,
    createdAt: "2026-02-10",

    communityId: "2",
  },
  {
    id: "6",
    type: "community",

    title: "Dia de torta de manteiga Escocesa! 🧈🥧",
    text:"",
    image: "/post2_community2.jpg",
    avatar: "/community_perfil.jpg",

    likes: 8,
    comments: 2,
    createdAt: "2026-02-10",

    communityId: "2",
  },

  {
    id: "6",
    type: "community",

    title: "Probleminha computacional clássico. Quem lenbra o nome??💻🌍",
    text:"",
    image: "/post1_community3.jpeg",
    avatar: "/community_perfil.jpg",

    likes: 8,
    comments: 2,
    createdAt: "2026-02-10",

    communityId: "3",
},
{
  id: "7",
  type: "community",

  title: "Grafos direcionados, o que são? 🤔📊",
  text:"Um grafo dirigido (= directed graph) é um par (V,E) de conjuntos em que é um conjunto finito não vazio e um conjunto de pares ordenados de elementos de V.",
  image: "/post2_community3.png",
  avatar: "/community_perfil.jpg",

  likes: 8,
  comments: 2,
  createdAt: "2026-02-10",

  communityId: "3",
},
{
  id: "7",
  type: "community",

  title: "Não consigo visualizar outra coisa além de números nesse momento... 🤯📊",
  text:"",
  image: "/post1_community4.jpg",
  avatar: "/community_perfil.jpg",

  likes: 8,
  comments: 2,
  createdAt: "2026-02-10",

  communityId: "4",
},
{
  id: "8",
  type: "community",

  title: "Algumas integrais pra quem quiser treinar! 📚🧠",
  text:"",
  image: "/post2_community4.jpg",
  avatar: "/community_perfil.jpg",

  likes: 8,
  comments: 2,
  createdAt: "2026-02-10",

  communityId: "4",
}


];