const CANCIONES = [
  {
    "titulo": "Love It",
    "artista": "Rels B",
    "razon": "Me encanta todo de ti, lo amo de verdad",
    "link": "https://open.spotify.com/intl-es/track/5u3FdkhdizFMMagxjbS53C?si=9a750acbfadd4710"
  },
  {
    "titulo": "I Wanna Be Yours",
    "artista": "Arctic Monkeys",
    "razon": "Quiero ser completamente tuyo, cuerpo y alma",
    "link": "https://open.spotify.com/intl-es/track/5XeFesFbtLpXzIVDNQP22n?si=d6e90daba555490a"
  },
  {
    "titulo": "Nanaena",
    "artista": "Paulo Londra",
    "razon": "Una canción que suena a ti, a amor verdadero",
    "link": "https://open.spotify.com/intl-es/track/5XX8OtWCYAP4s0zMVp5REJ?si=863e1888a65e4c5b"
  },
  {
    "titulo": "Me Encanta Todo Lo Tuyo",
    "artista": "Lucauy",
    "razon": "Me encanta absolutamente todo lo que eres y tienes",
    "link": "https://open.spotify.com/intl-es/track/6NHjr1XoiD305MLDr06uOm?si=073b3d117a7e483a"
  },
  {
    "titulo": "Ma Belle Evangeline",
    "artista": "Arturo Mercado",
    "razon": "Una canción mágica y romántica para la persona especial",
    "link": "https://open.spotify.com/intl-es/track/4i5L7KbZZ9ygJrZFNlc4hI?si=ac45278e1a264b64"
  },
  {
    "titulo": "I Love You",
    "artista": "Billie Eilish",
    "razon": "Simple pero poderosa, te amo sin necesidad de más palabras",
    "link": "https://open.spotify.com/intl-es/track/6CcJMwBtXByIz4zQLzFkKc?si=a29fe8111c2f466b"
  },
  {
    "titulo": "Rewrite The Stars",
    "artista": "The Greatest Showman",
    "razon": "Perfecta para expresar que deseo reescribir nuestro destino juntos",
    "link": "https://open.spotify.com/intl-es/track/7FlHNJT4TC120CDvFOHzei?si=34f100a03591413a"
  },
  {
    "titulo": "Weltita",
    "artista": "Bad Bunny",
    "razon": "Romántica y llena de sentimiento dedicada a ti",
    "link": "https://open.spotify.com/intl-es/track/5WEF0icHWmAZBBMglBd599?si=aae9923c76494cc1"
  },
  {
    "titulo": "Mi Mundo",
    "artista": "Manuel Lizarazo",
    "razon": "Eres mi mundo, mi razón de existir",
    "link": "https://open.spotify.com/intl-es/track/1aetAKSaFs4A8OO3DrWqdY?si=9ca8cb37eb7e47a3"
  },
  {
    "titulo": "Mujer Maravilla",
    "artista": "Paulo Londra",
    "razon": "Eres mi mujer maravilla, mi superheroína",
    "link": "https://open.spotify.com/intl-es/track/5Ngqa0mESN79RkVf7YLYBE?si=78999480c90d4308"
  },
  {
    "titulo": "Princesa",
    "artista": "Paulo Londra",
    "razon": "Eres mi princesa, la reina de mi corazón",
    "link": "https://open.spotify.com/intl-es/track/1db75lVrSgDFZI1gZh8JlV?si=c9a25e5fd4e84079"
  },
  {
    "titulo": "Quisiera",
    "artista": "Pasabordo",
    "razon": "Una canción que expresa el deseo profundo de estar cerca de ti",
    "link": "https://open.spotify.com/intl-es/track/56FmkP3sycSEX5ZvrPN1hR?si=178a025083b84814"
  },
  {
    "titulo": "La Propuesta",
    "artista": "Rels B",
    "razon": "La propuesta de amar y estar contigo para siempre",
    "link": "https://open.spotify.com/intl-es/track/6EUfOXUQtIAHKkBBOqMS2w?si=ef9f904a89764bd7"
  },
  {
    "titulo": "Planes",
    "artista": "Dezear",
    "razon": "Habla de los deseos y la esperanza en el amor",
    "link": "https://open.spotify.com/intl-es/track/0txaex32Gu66Bp1cox5n89?si=5da8d919d1d24418"
  },
  {
    "titulo": "Besito en la Frente",
    "artista": "Rauw Alejandro",
    "razon": "Un besito en la frente para decirte que te amo",
    "link": "https://open.spotify.com/intl-es/track/6PBoSxskeHXpOuyz7fuPNC?si=993c809ec1e04356"
  },
  {
    "titulo": "Photograph",
    "artista": "Ed Sheeran",
    "razon": "Como una fotografía, quiero recordarte siempre en mi corazón",
    "link": "https://open.spotify.com/intl-es/track/1HNkqx9Ahdgi1Ixy2xkKkL?si=bbf242dd9a804ae2"
  },
  {
    "titulo": "Reina Sin Corona",
    "artista": "Lilo Music",
    "razon": "Eres mi reina sin corona, reina de mi vida",
    "link": "https://open.spotify.com/intl-es/track/3aMTb7lZwn6cejnQEFtW2t?si=c0ba14acf7394849"
  },
  {
    "titulo": "Confieso",
    "artista": "Humbe",
    "razon": "Te confieso todos mis sentimientos en esta canción",
    "link": "https://open.spotify.com/intl-es/track/2k4MjD7I4ddpwwZKxHrONk?si=6b7161f2d3364c4f"
  },
  {
    "titulo": "Mil Vidas",
    "artista": "Mora",
    "razon": "En mil vidas diferentes, seguiría eligiéndote a ti",
    "link": "https://open.spotify.com/intl-es/track/4mIlk7LzrD260sNOY4hbtS?si=12f4f6746ad64c66"
  },
  {
    "titulo": "Solcito",
    "artista": "Miguel Bueno",
    "razon": "Eres mi solcito que ilumina mis días",
    "link": "https://open.spotify.com/intl-es/track/0JY2QXSvlpA8DZwgaAYWlY?si=e5c26fe88e184387"
  },
  {
    "titulo": "Nenita",
    "artista": "Manuel Medrano",
    "razon": "Mi nenita, la chica de mis sueños y mi corazón",
    "link": "https://open.spotify.com/intl-es/track/6Bwu10ojlaFg7BGfHxvTWO?si=bcaa0cf02dec430c"
  },
  {
    "titulo": "Si Te Interesa",
    "artista": "Beele",
    "razon": "Si te interesa, aquí estoy para ti completamente",
    "link": "https://open.spotify.com/intl-es/track/3cuxPiF5W1ID8R5Mmr36gS?si=cd4e4534a7a74cf3"
  },
  {
    "titulo": "Pretty Girl",
    "artista": "Rels B",
    "razon": "Eres la chica más hermosa que he visto",
    "link": "https://open.spotify.com/intl-es/track/2lW7JV6gBtF6vApavqbzGG?si=006896ced36d464a"
  },
  {
    "titulo": "Toda La Semana",
    "artista": "Angie",
    "razon": "Pienso en ti toda la semana, cada momento",
    "link": "https://open.spotify.com/intl-es/track/10hY5kpjbgzbVRO964O8dW?si=285c2c432ceb4470"
  }
];
