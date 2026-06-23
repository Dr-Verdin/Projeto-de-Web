import type { Community } from "../types/Community";
import type { Post } from "../types/Post";
import type { User } from "../types/User";
import type { Comment } from "../types/Comment";
import type { Notification } from "../types/Notification";

{/* USERS E COMMUNITIES */ }
export const users: Record<string, User> = {
  "u1": {
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
    "u2": {
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
  "c1": {
    communityId: "c1",
    userId: "u1",

    name: "Estudando com gatos",
    description: "Para quem estuda com um gato do lado 🐱📚",
    
    createdAt: "2025-12-01",
    visibility: "public",

    rules: "1. Respeitar os outros membros\n2. Compartilhar dicas e experiências\n3. Postar fotos dos seus gatos estudando",
    members: 120,
    avatar: "/community_perfil.jpg",
    background: "/community_fundo.jpg",
  },
  "c2": {
    communityId: "c2",
    userId: "u1",

    name: "Aprendizes da culinária",
    description: "Comunidade para quem gosta de cozinhar e aprender receitas novas",
    
    createdAt: "2025-12-01",
    visibility: "public",

    rules: "1. Respeitar os outros membros\n2. Compartilhar dicas e experiências\n3. Postar receitas e dicas de cozinha",
    members: 10000,
    avatar: "/community_perfil2.jpg",
    background: "/community_background2.jpg",
  },
  "c3": {
    communityId: "c3",
    userId: "u1",

    name: "Grafos e afins",
    description: "Comunidade para aprender e compartilhar conhecimento sobre grafos e algoritmos relacionados",
    
    createdAt: "2025-12-01",
    visibility: "public",

    rules: "1. Respeitar os outros membros\n2. Compartilhar dicas e experiências\n3. Postar códigos e projetos",
    members: 10000,
    avatar: "/community_perfil3.png",
    background: "/community_fundo3.jpg",
  },
  "c4": {
    communityId: "c4",
    userId: "u1",

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
    id: "p1",
    type: "user",
    title: "Quando você não pode estudar porque precisa dormir, mas não pode dormir porque precisa estudar...",
    tags: ["#faculdade", "#madrugada", "#hardstudy"],
    createdAt: "2026-04-01",
    likes: 10,

    userId: "u1",
  },
  {
    id: "p2",
    type: "user",

    title: "📖 estudando cálculo hoje...",
    text: "integral dupla tá começando a fazer sentido, mas ainda me perco na hora de mudar a ordem 😭\n\nalguém mais sofre com isso ou sou só eu?",
    image: "/post1_user.jpg",
    tags: ["#matematica", "#faculdade", "#calculo2"],
    createdAt: "2026-04-11",

    likes: 5,

    userId: "u1",
  },
  {
    id: "p3",
    type: "community",

    title: "Pitu não me deixa estudar... 🐾📖",
    text: "Meu gato, o Pitu, é super carinhoso e adora ficar no meu colo enquanto estudo, mas às vezes ele fica tão grudado que não consigo me concentrarkk",
    image: "/post1_community.jpg",

    likes: 15,
    createdAt: "2026-04-05",

    userId: "u2",
    communityId: "c1",
  },
  {
    id: "p4",
    type: "community",

    title: "Alguém tem que estudar nessa casa",
    text: "",
    image: "/post2_community.jpg",

    likes: 8,
    createdAt: "2026-04-10",

    userId: "u2",
    communityId: "c1",
  },
  {
    id: "p5",
    type: "community",

    title: "Mousse delicioso 🤤",
    text: `    6 ovos\n100g de açúcar refinado
    150g de manteiga sem sal
    300g de chocolate 70% cacau
    1 colher de chá de essência de baunilha (opcional)
    50ml de licor de café ou 50ml de café expresso`,
    image: "/post1community 2.jpg",

    likes: 8,
    createdAt: "2026-02-10",

    userId: "u1",
    communityId: "c2",
  },
  {
    id: "p6",
    type: "community",

    title: "Dia de torta de manteiga Escocesa! 🧈🥧",
    text:"",
    image: "/post2_community2.jpg",

    likes: 8,
    createdAt: "2026-02-10",

    userId: "u2",
    communityId: "c2",
  },

  {
    id: "p7",
    type: "community",

    title: "Probleminha computacional clássico. Quem lenbra o nome??💻🌍",
    text:"",
    image: "/post1_community3.jpeg",

    likes: 8,
    createdAt: "2026-02-10",

    userId: "u1",
    communityId: "c3",
},
{
  id: "p8",
  type: "community",

  title: "Grafos direcionados, o que são? 🤔📊",
  text:"Um grafo dirigido (= directed graph) é um par (V,E) de conjuntos em que é um conjunto finito não vazio e um conjunto de pares ordenados de elementos de V.",
  image: "/post2_community3.png",

  likes: 8,
  createdAt: "2026-02-10",

  userId: "u1",
  communityId: "c3",
},
{
  id: "p9",
  type: "community",

  title: "Não consigo visualizar outra coisa além de números nesse momento... 🤯📊",
  text:"",
  image: "/post1_community4.jpg",

  likes: 8,
  createdAt: "2026-02-10",

  userId: "u1",
  communityId: "c4",
},
{
  id: "p10",
  type: "community",

  title: "Algumas integrais pra quem quiser treinar! 📚🧠",
  text:"",
  image: "/post2_community4.jpg",

  likes: 8,
  createdAt: "2026-02-10",

  userId: "u2",
  communityId: "c4",
}
];


{/* COMMENTS */ }

export const comments: Comment[] = [
  {
    id: "d1",
    postId: "p2",
    userId: "u2",
    content: "isso de mudar a ordem da integral é sofrido mesmo 😭 mas depois que encaixa, fica mais tranquilo!",
    createdAt: "2026-04-11T14:30:00Z",
    likes: 3,
  },
  {
    id: "d2",
    postId: "p3",
    userId: "u1",
    content: "o Pitu claramente achando que ele está ajudando no estudo 🐱📚",
    createdAt: "2026-04-11T14:30:00Z",
    likes: 7,
  },
  {
    id: "d3",
    postId: "p7",
    userId: "u2",
    content: "acho que isso é um grafo dirigido! mas sempre confundo quando tem peso junto 😅",
    createdAt: "2026-02-10",
    likes: 2,
  },
];

{/* NOTIFICATIONS */}
export const notifications: Notification[] = [
  {
    id: "n1",
    userId: "u1",
    type: "like",
    title: "Alice curtiu seu post",
    message: "Alice curtiu: 📖 estudando cálculo hoje...",
    avatar: "/avatar_alice.jpg",
    createdAt: "2026-04-12T10:30:00Z",
    read: false,
    relatedId: "p2",
  },
  {
    id: "n2",
    userId: "u1",
    type: "comment",
    title: "Alice comentou no seu post",
    message: "Alice: isso de mudar a ordem da integral é sofrido mesmo 😭",
    avatar: "/avatar_alice.jpg",
    createdAt: "2026-04-11T14:30:00Z",
    read: true,
    relatedId: "p2",
  },
  {
    id: "n3",
    userId: "u1",
    type: "follow",
    title: "Alice começou a te seguir",
    message: "Alice está seguindo você agora",
    avatar: "/avatar_alice.jpg",
    createdAt: "2026-04-10T09:15:00Z",
    read: true,
  },
  {
    id: "n4",
    userId: "u1",
    type: "community",
    title: "Novo post em Estudando com gatos",
    message: "Alguém tem que estudar nessa casa",
    avatar: "/community_perfil.jpg",
    createdAt: "2026-04-10T08:45:00Z",
    read: false,
    relatedId: "c1",
  },
  {
    id: "n5",
    userId: "u1",
    type: "message",
    title: "Você tem uma nova mensagem",
    message: "Alice enviou uma mensagem para você",
    avatar: "/avatar_alice.jpg",
    createdAt: "2026-04-09T16:20:00Z",
    read: true,
  },
];