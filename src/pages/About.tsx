import { BulletList, Paragraph } from '../components/molecules/Prose'
import { InfoPage, type InfoSection } from '../components/templates/InfoPage'
import { SUPPORT_URL } from '../config/links'

const SECTIONS: InfoSection[] = [
  {
    id: 'dados',
    title: 'De onde vêm os dados',
    icon: 'database',
    body: (
      <>
        <Paragraph>
          Todas as informações dos produtos vêm da Open Food Facts, uma base aberta e colaborativa mantida por voluntários do mundo todo. O ScanBite lê esses dados e os
          apresenta de forma mais clara; não os altera nem confere produto por produto.
        </Paragraph>
        <Paragraph>
          Como a base é colaborativa, um produto pode ter dados incompletos, desatualizados ou com erro de cadastro (por exemplo, uma gramatura escrita errada). Quando um
          campo não existe, mostramos “Não informado” em vez de inventar um valor. Se você achar um erro, corrija-o na própria Open Food Facts: o dado melhora para todo mundo.
        </Paragraph>
        <Paragraph>
          A busca por nome e as listas mostram só produtos vendidos no Brasil. Ao abrir um produto direto pelo código de barras, ele pode ser de outro país.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'nutriscore',
    title: 'Nutri-Score',
    icon: 'workspace_premium',
    body: (
      <>
        <Paragraph>
          É uma nota de A (melhor) a E (pior), calculada pela Open Food Facts a partir da composição do produto por 100 g ou 100 ml. Pesam contra a nota nutrientes como calorias,
          açúcares, gordura saturada e sal; pesam a favor fibras, proteínas e a presença de frutas, legumes e leguminosas.
        </Paragraph>
        <Paragraph>
          Mostramos a nota como ela vem da base. Produtos sem dados suficientes aparecem como “não avaliados” e ficam de fora das médias e da escolha de “melhor” produto.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'nova',
    title: 'Grupo NOVA',
    icon: 'conveyor_belt',
    body: (
      <>
        <Paragraph>
          A classificação NOVA, a mesma adotada pelo Guia Alimentar para a População Brasileira, agrupa os alimentos pelo grau de processamento:
        </Paragraph>
        <BulletList
          items={[
            <>
              <strong>NOVA 1:</strong> alimentos in natura ou minimamente processados.
            </>,
            <>
              <strong>NOVA 2:</strong> ingredientes culinários, como óleos, sal e açúcar.
            </>,
            <>
              <strong>NOVA 3:</strong> alimentos processados.
            </>,
            <>
              <strong>NOVA 4:</strong> ultraprocessados, com formulações industriais e aditivos.
            </>,
          ]}
        />
        <Paragraph>O grupo também vem da Open Food Facts. Produtos sem grupo informado ficam sem a marcação.</Paragraph>
      </>
    ),
  },
  {
    id: 'alertas',
    title: 'Alertas “Alto em…”',
    icon: 'warning',
    body: (
      <>
        <Paragraph>
          Os alertas de açúcar, gordura, gordura saturada e sódio usam o semáforo nutricional da Open Food Facts, que classifica cada nutriente, por 100 g ou 100 ml, como baixo,
          moderado ou alto. Esses limites não são os mesmos do selo de lupa da rotulagem frontal da ANVISA (RDC 429/2020): um produto pode ter o alerta aqui e não ter o selo na
          embalagem, ou o contrário.
        </Paragraph>
        <Paragraph>
          Na página do produto, o cartão de açúcar aparece quando há 15 g ou mais de açúcares por 100 g (sólidos) ou 7,5 g ou mais por 100 ml (líquidos). São os limites que a ANVISA
          usa para “alto em açúcar adicionado”, aplicados ao açúcar total informado, porque a base nem sempre separa o açúcar adicionado. Por isso o alerta pode aparecer em produtos
          cujo açúcar é natural, como alguns laticínios e frutas.
        </Paragraph>
        <Paragraph>Os filtros de açúcares e sódio da página inicial partem desses mesmos limites e você pode ajustá-los.</Paragraph>
      </>
    ),
  },
  {
    id: 'alternativas',
    title: 'Alternativas mais saudáveis',
    icon: 'eco',
    body: (
      <>
        <Paragraph>Para sugerir alternativas, o ScanBite procura outros produtos com estes critérios:</Paragraph>
        <BulletList
          items={[
            'da mesma categoria: começa pela mais específica (por exemplo, margarinas) e só amplia para categorias mais gerais quando faltam opções;',
            'vendidos no Brasil;',
            'com Nutri-Score melhor que o do produto que você está vendo;',
            'da mesma base de comparação: sólido com sólido e líquido com líquido, sempre por 100 g ou 100 ml;',
            'em ordem de Nutri-Score, com a classificação NOVA como desempate (menos processado primeiro). Mostramos até 3.',
          ]}
        />
        <Paragraph>
          Se o produto não tem Nutri-Score, não dá para dizer qual é “mais saudável”: mostramos então os mais bem avaliados da mesma categoria, e avisamos disso. Em categorias pequenas ou
          mal cadastradas, podem aparecer poucas alternativas, ou nenhuma. Isso depende dos dados da base.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'notas',
    title: 'Nota da despensa e do carrinho',
    icon: 'monitoring',
    body: (
      <>
        <Paragraph>
          A nota dos Favoritos (“nota da despensa”) e a do carrinho de mercado são a média dos Nutri-Scores dos produtos da lista: A vale 10 pontos, B 8, C 6, D 4 e E 2. Só entram
          produtos com Nutri-Score.
        </Paragraph>
        <BulletList items={['8 ou mais: Excelente;', 'de 6 a menos de 8: Boa;', 'de 4 a menos de 6: Atenção;', 'abaixo de 4: Precisa melhorar.']} />
        <Paragraph>Também mostramos que parte da lista tem Nutri-Score A ou B e quantos itens são ultraprocessados (NOVA 4).</Paragraph>
      </>
    ),
  },
  {
    id: 'comparador',
    title: 'Comparador',
    icon: 'compare_arrows',
    body: (
      <Paragraph>
        O comparador coloca de 2 a 5 produtos lado a lado, com os valores sempre por 100 g ou 100 ml. Em cada linha destacamos o melhor e o pior valor; valores não informados ficam
        neutros e não entram na disputa.
      </Paragraph>
    ),
  },
  {
    id: 'limites',
    title: 'O que o ScanBite não é',
    icon: 'info',
    body: (
      <Paragraph>
        As informações são educativas e não substituem a orientação de médicos ou nutricionistas, principalmente se você tem alguma condição de saúde, alergia ou restrição alimentar.
        Confira sempre o rótulo da embalagem: em caso de dúvida, especialmente sobre alérgenos, vale o que está impresso no produto.
      </Paragraph>
    ),
  },
]

/** Como os dados, notas e alertas são calculados e apresentados. */
export function About() {
  return (
    <InfoPage
      title="Sobre a metodologia"
      subtitle="Como o ScanBite apresenta e calcula cada informação"
      description="De onde vêm os dados, o que significam as notas e alertas e quais são os limites do que mostramos."
      sections={SECTIONS}
      footer={
        SUPPORT_URL && (
          <p>
            Achou um erro no app ou nesta explicação?{' '}
            <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
              Abra uma issue
            </a>
            .
          </p>
        )
      }
    />
  )
}
