export const user = {
  id: 1,
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

export const postsUser = [
  {
    id: 1,
    type: "user",
    title: "Quando você não pode estudar porque precisa dormir, mas não pode dormir porque precisa estudar...",
    text: "",
    image: "",
    tags: ["#faculdade", "#madrugada", "#hardstudy"],
    likes: 10,
    comments: 2,
    createdAt: "2026-04-01",
    userId: 1,
  },
  {
    id: 2,
    type: "user",
    title: "📖 estudando cálculo hoje...",
    text: "integral dupla tá começando a fazer sentido, mas ainda me perco na hora de mudar a ordem 😭\n\nalguém mais sofre com isso ou sou só eu?",
    image: "/public/post1_user.jpg",
    tags: ["#matematica", "#faculdade", "#calculo2"],
    likes: 5,
    comments: 1,
    createdAt: "2026-04-11",
    userId: 1,
  },
];

export const community = {
  id: 1,
  name: "Estudando com gatos",
  description: "Para quem estuda com um gato do lado 🐱📚",
  rules: "1. Respeitar os outros membros\n2. Compartilhar dicas e experiências\n3. Postar fotos dos seus gatos estudando",
  members: 120,
  image: "/community_perfil.jpg",
};

export const postsCommunity = [
  {
    id: 1,
    type: "community",
    content: "Pitu não me deixa estudar... 🐾📖",
    image: "/public/post1_community.jpg",
    likes: 15,
    comments: 3,
    createdAt: "2026-04-05",
    userId: 1,
  },
  {
    id: 2,
    type: "community",
    content: "Alguém tem que estudar nessa casa",
    image: "/public/post2_community.jpg",
    likes: 8,
    comments: 2,
    createdAt: "2026-04-10",
    userId: 1,
  },
];