const POEMAS = [
  {
    "titulo": "Amo, amas",
    "contenido": "Amar, amar, amar, amar siempre, con todo\nel ser y con la tierra y con el cielo,\ncon lo claro del sol y lo oscuro del lodo:\namar por toda ciencia y amar por todo anhelo.\n\nY cuando la montaña de la vida\nnos sea dura y larga y alta y llena de abismos,\namar la inmensidad que es de amor encendida\n¡y arder en la fusión de nuestros pechos mismos!",
    "autor": "Rubén Darío"
  },
  {
    "titulo": "Mar de Emociones",
    "contenido": "Soy un mar de emociones cuando miro tus ojos,\nolas grandes que chocan contra mis deseos,\nla marea sube y baja al ritmo de tu voz,\ny me ahogo feliz en tu profundidad y tu voz.",
    "autor": "JP"
  },
  {
    "titulo": "Sueños Compartidos",
    "contenido": "Nuestros sueños se entrelazan como vides en la parra,\nformamos una red de amor que nunca se desgarra,\nen el mundo de los sueños, somos reyes y reinas,\nde un reino hecho de ternura y caricias ajenas.",
    "autor": "JP"
  },
  {
    "titulo": "Tiempo Congelado",
    "contenido": "En tu mirada, el tiempo se congela y se detiene,\nsolamente tú y yo en un momento que nos sostiene,\nlas horas desaparecen, los años no existen,\nsolamente existe tu amor que mi alma resiste.",
    "autor": "JP"
  },
  {
    "titulo": "Eres Mi Cielo",
    "contenido": "Eres mi cielo cuando nubes grises me rodean,\neres mi sol cuando la noche larga desespera,\neres mi estrella que brilla cuando se oscurezca,\ny eres la razón por la que vivo sin tristeza.",
    "autor": "JP"
  },
  {
    "titulo": "Ven",
    "contenido": "Ven, te daré mis ojos para que veas,\ny el corazón también, para que sientas.\nVen, porque la vida se nos va,\ny es triste estar solo en la tierra.",
    "autor": "Vicente Aleixandre"
  },
  {
    "titulo": "Perfume Eterno",
    "contenido": "Tu perfume llena todos mis sentidos,\ndeja rastros en todos mis caminos,\nflota en el aire de mi habitación,\ny me persigue hasta la más profunda emoción.",
    "autor": "JP"
  },
  {
    "titulo": "Corazón Dividido",
    "contenido": "Mi corazón se divide entre tu amor y mi cordura,\nentonces decides que al verte, pierdo toda ternura,\ntus labios son de fuego, tu mirada es profunda,\ny en tus brazos encuentro una paz que es fecunda.",
    "autor": "JP"
  },
  {
    "titulo": "Noche de Plata",
    "contenido": "En la noche de plata, bajo las estrellas brillar,\ntu silhueta dibuja en la sombra, un cuadro sin par,\ntoma mi mano con suavidad, dame tu corazón,\ny en este momento perfecto, seremos uno en adoración.",
    "autor": "JP"
  },
  {
    "titulo": "Si me miras",
    "contenido": "Si me miras, yo me vuelvo\nhermoso como la hierba,\ntierno como si la lluvia\nacabaje de besarme.\n\n¡Si me hablas, yo me pongo\nsemejante a la montaña\nque le ha nacido, de pronto,\nuna flor en la garganta!",
    "autor": "Juan Ramón Jiménez"
  },
  {
    "titulo": "Abrazo Infinito",
    "contenido": "En tu abrazo encuentro el infinito,\ntus brazos son mi refugio y me siento bendecido,\nme proteges del mundo con tu calidez,\ny siento la paz, gracias a tu poder.",
    "autor": "JP"
  },
  {
    "titulo": "La cita",
    "contenido": "Yo te espero en el jardín de las estrellas,\ndonde la fuente canta su canción de cristal,\ndonde la luna vierte su luz sobre la tierra\ny el silencio es la voz de la inmensidad.",
    "autor": "Rubén Darío"
  },
  {
    "titulo": "Soneto de la noche",
    "contenido": "No cesa este rayo que cubre de alegría\nlas profundas cavernas de la carne mía:\nasí te amo, absorbido por tu presencia fuerte.\n\nLatiendo en la dulzura de la noche segura,\ndonde los corazones se desangran, perdura\nesta fiebre que me mantiene en la muerte.",
    "autor": "Miguel Hernández"
  },
  {
    "titulo": "Si el hombre pudiera...",
    "contenido": "Si el hombre pudiera decir lo que ama,\nsi el hombre pudiera levantar su amor por el cielo\ncomo una nube en la luz\nsi como muros que se derrumban,\npara saludar la verdad erguida en medio,\npudiera derrumbar su cuerpo, dejando sólo la verdad de su amor,\nla verdad de sí mismo,\nque no se llama gloria, fortuna o ambición,\nsino amor o deseo.\n\nYo sería aquel que imaginaba\naquel que con su lengua, sus ojos y sus manos\nprocama ante los hombres la verdad ignorada,\nla verdad de su amor verdadero.",
    "autor": "Gustavo Adolfo Bécquer"
  },
  {
    "titulo": "Tu Mirada",
    "contenido": "Tu mirada es un pozo de infinita profundidad,\ndonde caigo sin remedio en su calidez y claridad,\nme atrapas con tus ojos de color de miel y fuego,\ny pierdo todo cordura en tu dulce juego.",
    "autor": "JP"
  },
  {
    "titulo": "Para mi corazón...",
    "contenido": "Para mi corazón basta tu pecho,\npara tu libertad bastan mis alas.\nDesde mi boca llegará hasta el cielo\nlo que estaba dormido sobre tu alma.",
    "autor": "Antonio Machado"
  },
  {
    "titulo": "Poema 15",
    "contenido": "Me gustas cuando callas porque estás como ausente,\ny me oyes desde lejos, y mi voz no te toca.\nParece que los ojos se te hubieran volado\ny parece que un beso te cerrara la boca.",
    "autor": "Pablo Neruda"
  },
  {
    "titulo": "Mariposas del Alma",
    "contenido": "Mariposas de colores vuelan en mi alma,\ncuando tú caminas hacia mí con tu calma,\nlas alas tocan mi corazón con dulzura,\ny en ese instante, siento la eternidad pura.",
    "autor": "JP"
  },
  {
    "titulo": "Poema de la amistad",
    "contenido": "Tu corazón, una vez me abriste,\nen el jardín de tu quinta, un día...\nHalló, mis ojos, por vez primera,\nlos ojos tú, de la alegría mía.",
    "autor": "Antonio Machado"
  },
  {
    "titulo": "Alma Gemela",
    "contenido": "Eres mi alma gemela, encontrada en el destino,\nni el tiempo, ni la distancia puede cerrar nuestro camino,\nla vida nos juntó en este plano existencial,\ny ahora somos uno en un amor universal.",
    "autor": "JP"
  },
  {
    "titulo": "Beso Eterno",
    "contenido": "Un beso tuyo es como beber el néctar de los dioses,\nque despierta mi alma en formas que nunca supuse,\ntus labios rozan los míos en la oscuridad,\ny siento que muero y renazco en tu eternidad.",
    "autor": "JP"
  },
  {
    "titulo": "Rima XXI",
    "contenido": "¿Qué es poesía?, dices mientras clavas\nen mi pupila tu pupila azul.\n¿Qué es poesía? ¿Y tú me lo preguntas?\nPoesía... eres tú.",
    "autor": "Gustavo Adolfo Bécquer"
  },
  {
    "titulo": "Soneto XVII",
    "contenido": "No te amo como si fueras rosa de sal, topacio\no flecha de claveles que propagan el fuego:\nte amo como se aman ciertas cosas oscuras,\nsecretamente, entre la sombra y el alma.\n\nTe amo como la planta que no florece y lleva\ndentro de sí, escondida, la luz de aquellas flores,\ny gracias a tu amor vive oscuro en mi cuerpo\nel apretado aroma que ascendió de la tierra.\n\nTe amo sin saber cómo, ni cuándo, ni de dónde,\nte amo directamente sin problemas ni orgullo:\nasí te amo porque no sé amar de otra manera,\n\nsino así de este modo en que no soy ni eres,\ntan cerca que tu mano sobre mi pecho es mía,\ntan cerca que se cierran tus ojos con mi sueño.",
    "autor": "Pablo Neruda"
  },
  {
    "titulo": "Luz de Mi Vida",
    "contenido": "Eres la luz que ilumina mi camino oscuro,\neres el faro que me guía seguro,\nsin ti, mi mundo sería noche completa,\ny en tu presencia, mi vida se completa.",
    "autor": "JP"
  },
  {
    "titulo": "Promesa de Amor",
    "contenido": "Te prometo amor eterno bajo las estrellas,\nte prometo ser tu fuerza cuando caigas y no veas,\nte prometo guardar tu nombre en mi corazón,\nhasta que el tiempo se detenga en la eternidad del amor.",
    "autor": "JP"
  },
  {
    "titulo": "Canción del Alma",
    "contenido": "Mi alma canta una canción de amor eterno,\ncuando miro tu rostro, lleno de fuego tierno,\nlas notas suben al cielo en melodía,\ny el universo baila al son de tu armonía.",
    "autor": "JP"
  },
  {
    "titulo": "Soneto de la dulce queja",
    "contenido": "No quiero que te vayas, dolor, último amor.\nNo quiero que te vayas, flor de la tempestad.\nDéjame en el recuerdo de tu boca de miel,\ny en la locura azul de tu total verdad.",
    "autor": "Federico García Lorca"
  },
  {
    "titulo": "Lluvia de Amor",
    "contenido": "Como lluvia en primavera que cae sobre el verde prado,\ntu amor cae sobre mi pecho dejando rastros marcado,\nme empapo de tu ternura, de tu voz dulce y sincera,\ny florezco en tu presencia cada mañana y cada noche entera.",
    "autor": "JP"
  },
  {
    "titulo": "Verso de Pasión",
    "contenido": "En cada verso que escribo, \nestá tu nombre escrito,\ntu amor es la musa \nque me tiene circunscritos,\nen cada rima encuentro tu dulce voz,\ny en cada estrofa, \nla razón de mi existencia y mi voz.",
    "autor": "JP"
  },
  {
    "titulo": "Fuego Invisible",
    "contenido": "Un fuego invisible quema en mis venas cuando estás cerca,\ny aunque nadie lo ve, el alma mía se despierta,\ntus besos encienden llamas que consumen mi razón,\ny muero feliz en el fuego de tu pasión.",
    "autor": "JP"
  },
  {
    "titulo": "Espejo del Cielo",
    "contenido": "Tus ojos son espejo del cielo azul y claro,\nreflejan la belleza de todo lo que es raro,\nen ellos veo mi futuro, mi destino y mi verdad,\ny siento que he encontrado la eterna felicidad.",
    "autor": "JP"
  },
  {
    "titulo": "Rosa Lejana",
    "contenido": "Eres rosa lejana en el jardín del tiempo,\nque perfuma mis días con su aroma dulce y lento,\ntus pétalos de seda son mis sueños de belleza,\ny en ti encuentro la paz que mi alma anhelaba con presteza.",
    "autor": "JP"
  },
  {
    "titulo": "Rima LIII",
    "contenido": "Volverán las oscuras golondrinas\nen tu balcón sus nidos a colgar,\ny otra vez con el ala a sus cristales\njugando llamarán\n\npero aquéllas que el vuelo refrenaban\ntu hermosura y mi dicha al contemplar,\naquéllas que aprendieron nuestros nombres...\nésas... ¡no volverán!",
    "autor": "Gustavo Adolfo Bécquer"
  },
  {
    "titulo": "Danza Eterna",
    "contenido": "Danzamos bajo la luna en la noche infinita,\ntu cuerpo junto al mío en una danza maldita,\nlos pies tocan la tierra pero nuestras almas vuelan,\ny en el ritmo del amor, nuestras vidas se revelan.",
    "autor": "JP"
  },
  {
    "titulo": "Susurro Dulce",
    "contenido": "Un susurro dulce en mi oído despaciosamente,\nme cuenta historias de amor tan bellas,\nque hago mío cada sonido de tu voz,\nque me llena de dicha y de voz.",
    "autor": "JP"
  },
  {
    "titulo": "Poema de la tarde",
    "contenido": "Hoy te he visto pasar y me ha dado\nun vuelco el corazón. Ibas tan cerca,\nque pude tocarte con la mirada.\nY sin embargo, ibas tan lejos,\nque no pude decirte ni una palabra.",
    "autor": "Jaime Sabines"
  },
  {
    "titulo": "Tempestad de Amor",
    "contenido": "Como tempestad feroz que golpea la montaña,\ntu amor me arrastra sin que nada me amaña,\nrayo y trueno en mi pecho, granizo en mi respiración,\ny en la calma que sigue, encuentro tu consolación.",
    "autor": "JP"
  },
  {
    "titulo": "Himno del Amor",
    "contenido": "Cantaré un himno de amor que resuene en las montañas,\nque llegue a todos los corazones, y que nunca halla fallas.\nLes hablaré de tu belleza, de tu gracia sin igual,\nde cómo transformaste mi vida para bien y mucho más.",
    "autor": "JP"
  },
  {
    "titulo": "Amanecer Contigo",
    "contenido": "Cada amanecer contigo es un regalo divino,\nlos colores del cielo palidecen ante tu tino,\nla luz dorada te envuelve como un manto,\ny en tu sonrisa celestial, encuentro todo mi encanto.",
    "autor": "JP"
  },
  {
    "titulo": "Corazón Errante",
    "contenido": "Mi corazón errante encontró en ti su morada,\nya no busca en otros lados ni en otra madrugada,\nse quedó en tu pecho, latiendo con tu ritmo,\nformando la canción de nuestro nuevo corazón.",
    "autor": "JP"
  }
];