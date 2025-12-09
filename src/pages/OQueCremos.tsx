import Layout from "@/components/Layout";

const crencas = [
  {
    titulo: "A Bíblia é suficiente para conduzir nossas vidas, igreja, família e ministérios",
    texto: "Cremos que a Bíblia é a Palavra de Deus Inerrante (Mt 5.17-18; Jo 10.35), Inspirada (2 Tm 3.16-17; 2 Pe 1.20-21) e totalmente Suficiente para o homem moderno (1 Pe 1.3; Hb 4.12; Sl 119.105)."
  },
  {
    titulo: "Deus é o Criador de todas as coisas",
    texto: "Cremos num Deus único (Dt 6.4-5), eterno, infinito, imutável, criador de todas as coisas, pessoal, e que se revela por meio de três pessoas essencialmente iguais: Pai, Filho e Espírito Santo (Is 48.16; Mt 28.19-20)."
  },
  {
    titulo: "Jesus Cristo é Deus que se tornou homem para redimir a humanidade de seus pecados",
    texto: "Conforme Mt 16.16, Jesus é o Cristo o filho do Deus vivo. Ele é o Deus-Homem, partilhando plenamente da eterna divindade e de nossa frágil humanidade (Fp 2.7). As duas naturezas foram inseparavelmente unidas de tal forma que não houve mistura ou perda de suas identidades particulares nem perda ou transferência de qualquer atributo ou propriedade de uma natureza para outra (João 1.1-14)."
  },
  {
    titulo: "O Espírito Santo é Deus e o agente da vida da igreja",
    texto: "Cremos que o Espírito Santo é a terceira pessoa da Trindade. Ele não é uma força impessoal, pois tem personalidade (Rm 8.27), emoções (Ef 4.30), e vontade (1 Co 12.11). Por essa razão, ele batiza os salvos, no ato de sua conversão (Cl 2.12; Rm 8.9)."
  },
  {
    titulo: "O homem foi criado por Deus para sua glória",
    texto: "Cremos que Deus criou o homem, para a sua própria glória – Is 43.7. O corpo do homem foi criado do pó da terra; e a sua natureza imaterial, pelo sopro de Deus (Gn 1.26-27; 2.7; Ec 12.7). O homem é composto de duas substâncias, material e imaterial. A imaterial possui vários aspectos (não partes). Tais aspectos são distintos, mas interpenetráveis e interdependentes."
  },
  {
    titulo: "A salvação do homem é um ato da graça de Deus",
    texto: "Cremos que todos os seres humanos nascem espiritualmente mortos (Ef 2.1; Rm 3.10) e por isso, necessitados de salvação, que se dá pela oferta voluntária de Jesus Cristo, que ao morrer na cruz e ressuscitar ao terceiro dia, venceu o pecado e ofereceu a vida eterna a todo aquele que crê (Rm 5.8; Jo 3.16)."
  },
  {
    titulo: "A salvação não pode ser perdida",
    texto: "Entendemos que o salvo não pode perder a salvação porque suas obras não lhe dão direito, nem tiram a salvação (Ef 2.8-9); também porque ao ser salvo ele é selado com o Espírito Santo (Ef 1.13; 4.30; 2 Co 1.21-22); e ainda porque a Bíblia garante a segurança através de Jesus (Jo 3.16, 18, 36; 5.24; 6.37; 10.17-18, 27-28)."
  },
  {
    titulo: "A volta de Jesus é iminente",
    texto: "Cremos que Jesus cumprirá sua promessa de voltar a terra (At 1.11). Esse retorno ocorrerá em dois eventos: primeiro acontecerá o arrebatamento dos salvos para o céu (1 Co 15.51-53; 1 Ts 4.13-17); e um período de 7 anos de Tribulação na terra (Ap 4-16; Ap 6.17; Mt 24.15-31). E então ocorrerá a 2ª Vinda de Cristo (Ap 19). A segunda vinda de Cristo será seguida de um período de Mil anos literais (Ap 20), onde Ele reinará. Ao término desses anos, teremos o Grande trono branco, julgamento dos incrédulos (Ap 20.11), e por fim novos céus e nova terra (Ap 22)."
  },
  {
    titulo: "A base de um ministério eficaz está no investimento pessoal de vidas",
    texto: "Cremos que a missão da igreja é fazer discípulos de Cristo (Mt 28.19-20) e ajudá-los a crescer na graça e conhecimento de Cristo, frutificando em toda boa obra (Col 1.9-10)."
  },
  {
    titulo: "O Culto é um reflexo da adoração pessoal e diária de cada salvo",
    texto: "Cremos que cada salvo por ser um adorador, deve viver todos os dias em comunhão com Deus, e ao se reunir com a igreja, apresentar um culto que reflete esta intimidade (1 Co 10.31)."
  },
  {
    titulo: "A integridade pessoal é um instrumento nas mãos de Deus",
    texto: "Cremos que cada salvo tem um compromisso pessoal com Jesus de seguir seus passos em tudo, e, portanto, ser uma testemunha viva de Sua pessoa por meio de um viver agradável a Ele (Ef 4)."
  },
  {
    titulo: "Todo salvo é um servo apto para desenvolver seus dons",
    texto: "Cremos que cada salvo tem pelo menos um dom (Ef 4.7; Rm 12.6; 1 Co 12.11) para ser usado na edificação da obra de Deus, contribuindo com o avanço da igreja, por meio de um ministério eficaz."
  },
  {
    titulo: "Uma igreja ministerialmente unida cumpre sua missão",
    texto: "Cremos que o modelo de Efésios 4.1-16 demonstra que o crescimento da igreja é natural, por ser ela um organismo vivo; e que resulta de uma unidade na visão, ministérios e relacionamentos promovidos por seus membros."
  },
  {
    titulo: "O ministério pastoral funciona melhor com multiplicidade de pastores",
    texto: "Cremos que o modelo bíblico para o pastorado visa o trabalho em equipe (Ef 4.11; At 13.1-3; 14.23; 15.4). Por isso entendemos que a autoridade pastoral essencial independe da área de atuação, dando à igreja pastores e não pastores sêniores e auxiliares. Neste caso, a função não determina a vocação."
  }
];

const OQueCremos = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold animate-fade-in">O Que Cremos</h1>
          <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto animate-fade-in-delay-1">
            As doutrinas que fundamentam nossa fé e prática.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            {crencas.map((crenca, index) => (
              <div key={index} className="border-l-4 border-primary pl-6 py-2">
                <h3 className="font-display font-semibold text-foreground text-lg">
                  {crenca.titulo}
                </h3>
                <p className="mt-2 text-muted-foreground">{crenca.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OQueCremos;
