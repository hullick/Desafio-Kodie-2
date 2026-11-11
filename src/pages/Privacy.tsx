import { BulletList, Paragraph } from '../components/molecules/Prose'
import { InfoPage, type InfoSection } from '../components/templates/InfoPage'
import { SUPPORT_URL } from '../config/links'

/** Atualize junto com qualquer mudança no que o app guarda ou envia. */
const UPDATED_AT = '11 de novembro de 2026'

const SECTIONS: InfoSection[] = [
  {
    id: 'resumo',
    title: 'Em resumo',
    icon: 'shield',
    body: (
      <Paragraph>
        O ScanBite não tem cadastro, login nem servidor próprio. Não pedimos nome, e-mail ou qualquer dado pessoal, e não usamos ferramentas de análise de uso, cookies de publicidade
        ou rastreadores. O que você salva no app fica no seu aparelho.
      </Paragraph>
    ),
  },
  {
    id: 'aparelho',
    title: 'O que fica guardado no seu aparelho',
    icon: 'smartphone',
    body: (
      <>
        <Paragraph>Para o app funcionar (inclusive sem internet), o navegador guarda estas informações, só neste aparelho e neste navegador:</Paragraph>
        <BulletList
          items={[
            'seus favoritos, com os dados dos produtos salvos;',
            'a lista de produtos que você está comparando;',
            'o checklist de mercado (o carrinho), com o que já foi pego;',
            'os produtos escaneados recentemente;',
            'um cache temporário das consultas, para não repetir buscas à toa;',
            'um aviso de que você já permitiu a câmera, para pular a explicação na próxima vez.',
          ]}
        />
        <Paragraph>
          Nada disso é enviado para nós. Para apagar, use os botões “Limpar” do app (favoritos, carrinho e escaneados recentemente) ou limpe os dados do site nas configurações do
          navegador. Em aba anônima, tudo some quando você a fecha. Outro aparelho ou navegador não enxerga esses dados.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'camera',
    title: 'Câmera',
    icon: 'photo_camera',
    body: (
      <>
        <Paragraph>
          A câmera só é usada na tela de escanear, para ler o código de barras, e é desligada quando você sai dela. As imagens são analisadas no próprio aparelho: nada é gravado nem
          enviado. Só o número do código lido é usado para buscar o produto.
        </Paragraph>
        <Paragraph>
          A permissão é do navegador, que guarda a sua escolha para este site. Você pode mudá-la quando quiser, no cadeado ao lado do endereço ou nas configurações do navegador. Sem a
          câmera, dá para digitar o código manualmente.
        </Paragraph>
      </>
    ),
  },
  {
    id: 'terceiros',
    title: 'Serviços de terceiros',
    icon: 'cloud',
    body: (
      <>
        <Paragraph>Ao usar o app, o seu navegador se comunica com serviços externos, que recebem o endereço IP e dados técnicos do navegador, como acontece em qualquer site:</Paragraph>
        <BulletList
          items={[
            <>
              <strong>Open Food Facts:</strong> recebe o código de barras ou o texto que você busca, para devolver os dados e as fotos dos produtos.
            </>,
            <>
              <strong>Google Fonts:</strong> fornece a tipografia e os ícones do app.
            </>,
            <>
              <strong>Provedor de hospedagem:</strong> onde o site é publicado; ele pode registrar acessos (logs) conforme a própria política.
            </>,
          ]}
        />
        <Paragraph>Esses serviços têm políticas de privacidade próprias, que o ScanBite não controla.</Paragraph>
      </>
    ),
  },
  {
    id: 'compartilhar',
    title: 'Compartilhar um produto',
    icon: 'share',
    body: (
      <Paragraph>
        O botão Compartilhar envia apenas o link da página do produto, pelo menu de compartilhamento do aparelho ou copiado para a área de transferência. Seus favoritos e demais dados não
        vão junto.
      </Paragraph>
    ),
  },
  {
    id: 'controle',
    title: 'Seu controle',
    icon: 'tune',
    body: (
      <Paragraph>
        Como não há conta, não há dados seus em nossos servidores para pedir ou excluir: o controle está no seu navegador. Você pode apagar os dados do site, revogar a permissão da câmera
        e deixar de usar o app a qualquer momento. Se algum dia o ScanBite passar a guardar ou enviar outros dados, esta página será atualizada antes.
      </Paragraph>
    ),
  },
]

/** O que o app guarda, envia e usa (câmera, armazenamento local, serviços externos). */
export function Privacy() {
  return (
    <InfoPage
      title="Privacidade"
      subtitle="O que o ScanBite guarda, envia e usa"
      description="Sem cadastro e sem rastreamento: seus dados ficam no seu aparelho."
      sections={SECTIONS}
      footer={
        <>
          {SUPPORT_URL && (
            <p>
              Dúvidas sobre privacidade?{' '}
              <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
                Abra uma issue
              </a>
              . As issues são públicas: não inclua dados pessoais nelas.
            </p>
          )}
          <p>Última atualização: {UPDATED_AT}.</p>
        </>
      }
    />
  )
}
