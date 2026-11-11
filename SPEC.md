# SPEC — ScanBite (Open Food Facts)

> Desafio 02: Painel Interativo com API Pública (React + Vite).
> Status: **rascunho para aprovação**. Itens marcados com _(sugestão)_ são propostas
> do assistente, não decisões do autor. Itens marcados com _(a confirmar)_ dependem de verificação.

## 1. Nome do projeto
**ScanBite** (decisão do autor).

## 2. Problema e contexto
Consumidores leem e comparam rótulos manualmente no supermercado, o que é lento e difícil de
interpretar. O app dá acesso **rápido e intuitivo** às informações nutricionais de produtos
comuns em supermercados e mostra quais riscos ou alertas cada produto traz
(ex.: alto em açúcar → risco de diabetes; alto em sódio → risco de hipertensão).

## 3. Usuários
- **Principal:** consumidores de 30 a 50 anos.
- **Contexto de uso:** celular, no mercado; e na internet, para tirar dúvidas depois.
- **Secundário:** pessoa com condição de saúde ou restrição alimentar que quer cruzar suas
  condições com os produtos (fase 2).

## 4. Objetivo e critério de sucesso
- **Função central:** o **detalhamento do produto**.
- **Sucesso:** o detalhamento do produto é **preciso**, isto é, os dados exibidos batem com os
  da API e os alertas seguem os limites oficiais.

## 5. Não-objetivos
- Não dá conselho médico (os riscos exibidos são informativos).
- Não vende produtos.
- Não tem autenticação nem backend (dados do usuário só no `localStorage`).

## 6. Escopo

### Fase 1 (entrega obrigatória, prazo: até amanhã)
1. **Busca** por nome/marca, somente produtos vendidos no Brasil.
2. **Detalhamento do produto**: foto, nome, marca, Nutri-Score, grupo NOVA, nutrientes por
   100 g/ml, ingredientes, alérgenos, aditivos, alertas ANVISA e riscos associados.
3. **Comparação** de 2 a 5 produtos (lado a lado, com destaque do melhor valor por linha).
4. **Escaneamento de código de barras** pela câmera, com digitação manual como alternativa.
5. **Favoritos** persistidos em `localStorage`.
6. **Estados:** carregando (item em carregamento), sem resultados, erro de rede/API (inclui 503),
   câmera negada ou indisponível (tela própria).
7. Interface responsiva (celular, tablet, desktop), publicada na Vercel ou Netlify.

### Fase 2 (somente se sobrar tempo) _(sugestão de divisão)_
- **Alternativa mais saudável** (ver seção 8).
- **Perfil de saúde local:** o usuário registra condições (ex.: diabetes, hipertensão) em
  `localStorage` e o app cruza com os dados do produto.
- **Seleção de país** (hoje fixo em Brasil).
- Filtros por Nutri-Score e categoria, ordenação, gráficos.

## 7. Dados e API

**API:** Open Food Facts (gratuita, sem chave para leitura).

Base única: `https://world.openfoodfacts.org`. **Brasil é o filtro padrão** de toda busca/listagem
(`countries_tags_en=brazil` na v2; critério `countries contains brazil` na `search.pl`). O filtro
significa "vendido também no Brasil" (produto pode ter outros países).

| # | Uso | Endpoint | Verificado (11/11/2026) |
|---|---|---|---|
| 1 | Produto por código (Detalhes, Scanner, digitação) | `GET /api/v3/product/{codigo}?fields=...` | Sim. Inexistente → HTTP 404 com JSON `status: "failure"`, `result.id: "product_not_found"` |
| 2 | Busca por texto (+ filtros) | `GET /cgi/search.pl?search_terms=...&search_simple=1&json=1&action=process&tagtype_N=...&tag_contains_N=contains&tag_N=...` | Sim: texto + Brasil, filtro de uma nota (`nutrition_grades`), `sort_by=nutriscore_score`. CORS liberado |
| 3 | Navegar só por filtros (categoria, Nutri-Score, NOVA) | `GET /api/v2/search?countries_tags_en=brazil&categories_tags_en=...&nutrition_grades_tags=a\|b&nova_groups_tags=...` | Sim: `\|` funciona como "ou"; NOVA e `sort_by=nutriscore_score` ok |
| 4 | Vários produtos por código (Comparador, atualizar Favoritos) | `GET /api/v2/search?code=a,b,c&fields=...` | Sim, uma chamada só |
| 5 | Alternativas mais saudáveis | `GET /api/v2/search?categories_tags_en={categoria}&nutrition_grades_tags=...&sort_by=nutriscore_score` | Sim (mesma sintaxe do item 3) |
| — | Lista de países (fase 2) | `static.openfoodfacts.org/data/taxonomies/countries.json` | Sim (~700 KB) |

**Descobertas dos testes:**
- A v2 **ignora `search_terms`** (com "aveia" devolveu 38 mil produtos sem relação). Texto livre só pela `search.pl`.
- `world.` e `br.` responderam igual na busca; o **503 é intermitente nos dois** (inclusive com página
  HTML "Page temporarily unavailable" no corpo) e ocorreu também abaixo de 10 buscas/min.
- Não testado: vários Nutri-Scores/NOVA ao mesmo tempo na `search.pl` (implementado por exclusão,
  `tag_contains_N=does_not_contain`) e `sort_by` por nome/popularidade.
- Não precisam de requisição: imagens (links de `images.openfoodfacts.org`), favoritos e histórico
  (salvos no aparelho), lista de categorias do filtro (fixa no código), cadastro de produto (link
  externo) e o monitor da tela de erro (derivado das últimas chamadas).

**Campos usados:** `code`, `product_name`, `brands`, `quantity`, `image_front_url`,
`nutriscore_grade`, `nova_group`, `nutriments` (`*_100g`), `nutrient_levels`,
`additives_tags`, `allergens_tags`, `ingredients_text`, `categories_tags`.

**Regras de dados:**
- Sem dado → o campo não é exibido; seção inteira sem dados → a seção não é exibida.
- Converter unidades: a API devolve **sódio em gramas** (ex.: `0.005`); a lei usa **mg**.
- Produto sem Nutri-Score ou sem imagem deve ter exibição própria (sem quebrar o layout).
- A documentação oficial pede `User-Agent` próprio no formato `NomeDoApp/Versão (E-mail)`.
  **Atenção:** navegadores não permitem alterar o `User-Agent` em `fetch`. Verificar na
  implementação se isso gera bloqueio; se gerar, avaliar alternativa. O e-mail de contato é
  decisão do autor (não usar dados pessoais sem aprovação).
- Para desenvolvimento/testes, a documentação recomenda o ambiente de **staging**
  (`world.openfoodfacts.net`, autenticação básica `off`/`off`) em vez da produção.
- A API v2 está marcada como obsoleta (a v3 é a atual), mas a **busca estruturada só existe
  na v2**; produto por código existe na v3. Usar v3 para produto, v2 para filtros/códigos e
  `search.pl` para texto.
- Produto por código **não** é filtrado por país (a API não permite); a interface pode usar
  `Product.isFromBrazil` para avisar.
- **Alternativas para volume maior** (se necessário): baixar o dump oficial (CSV/JSONL) e
  filtrar produtos do Brasil num catálogo local pequeno, usado para busca sem consumir limite.

**Limites de uso (confirmados na documentação oficial, seção "Rate limits"):**
- Leitura de produto (`/api/v*/product`): **15 req/min por IP**.
- Busca (`/api/v*/search`): **10 req/min por IP**. A documentação diz expressamente para
  **não** usar busca a cada tecla digitada (risco de bloqueio rápido).
- Há também limite global; excesso retorna **HTTP 503**, e abuso pode gerar **banimento de IP**.
- Se a chamada parte do navegador do usuário, o limite vale por usuário.
- Fonte: https://openfoodfacts.github.io/openfoodfacts-server/api/

**Consequências para o projeto:**
- Busca só dispara por **ação explícita** (botão/Enter), nunca por digitação.
- Cache das respostas (em memória e `sessionStorage`) para não repetir requisições.
- Comparação de até 5 produtos = **1 busca** (`code=a,b,c`), e só dos que não estão em cache.
- Produtos vindos de buscas entram no cache de produto: abrir o detalhe depois não gasta requisição.
- Limitador no navegador com margem: 12 leituras/min e 8 buscas/min.
- 503/502/504/429 ou resposta não-JSON: até 2 novas tentativas com espera crescente
  (respeitando `Retry-After`); persistindo, tela de erro com "tentar de novo".
- Desenvolvimento e testes devem respeitar os limites (evitar loops de chamadas).

**Risco técnico (a confirmar no início da implementação):** CORS ao chamar a API direto do
navegador. Se bloquear, é preciso um proxy (ex.: função serverless).

## 8. Alternativa mais saudável (fase 2)
Não existe endpoint pronto. Abordagem: buscar na **mesma categoria** (`categories_tags`) e no
mesmo país, filtrar por Nutri-Score melhor que o do produto atual e ordenar no código.
Produtos sem Nutri-Score ficam de fora. Respeitar o limite da busca (10/min por IP).

## 9. Regras de negócio: alertas ANVISA
Base: RDC 429/2020 e IN 75/2020 (rotulagem nutricional frontal). Alerta "alto em" quando o valor
é **igual ou maior** que o limite:

| Nutriente | Sólidos (por 100 g) | Líquidos (por 100 ml) |
|---|---|---|
| Açúcar adicionado | ≥ 15 g | ≥ 7,5 g |
| Gordura saturada | ≥ 6 g | ≥ 3 g |
| Sódio | ≥ 600 mg | ≥ 300 mg |

**A confirmar:** valores vieram de fontes secundárias (uma matéria do Idec diverge num valor de
líquidos). Conferir no **Anexo XV da IN 75/2020 (DOU)** e checar se a revisão da norma iniciada
em 2025 foi concluída.

**Decisões de implementação:**
- Produto é "líquido" ou "sólido" conforme a unidade de `product_quantity_unit` (`ml` → líquido)
  _(sugestão)_.
- Usar `added-sugars_100g` quando existir; se não existir, não emitir alerta de açúcar
  adicionado (não inferir a partir de `sugars`) _(sugestão)_.
- Exemplo de validação: Coca-Cola 2 L, `added-sugars_100g ≈ 10,57` (líquido) → alerta de açúcar.

## 10. Riscos à saúde (tabela local)
Não foi encontrada API pública com riscos por produto. Será mantida uma **tabela local**
(`riscos.ts`) ligando alerta → risco informativo, cada item com **fonte** (OMS, Guia Alimentar
para a População Brasileira, ANVISA) e o aviso: "Informação educativa. Não substitui orientação
médica." Exemplos: açúcar alto → risco de diabetes e obesidade; sódio alto → risco de
hipertensão; gordura saturada alta → risco cardiovascular. Aditivos: lista pequena, só os de
fonte confiável _(sugestão)_.

## 11. Interface
Layout definido a partir do Google Stitch (prints serão adicionados em `design/` (fora do git)).
Telas: Busca/Home, Detalhes do produto, Comparação, Scanner, Favoritos, estados de erro.
- Mobile first; grid de cards 1 coluna (celular), 2 (tablet), 3–4 (desktop).
- Cores oficiais do Nutri-Score (A a E) só nos selos; verde como cor principal _(do prompt)_.
- Acessibilidade: contraste AA, alvos de toque grandes, `alt` nas imagens, navegação por teclado.

## 12. Arquitetura técnica
- **React + Vite + TypeScript** (template `react-ts`).
- **UI:** Tailwind CSS v4 via `@tailwindcss/vite` (decisão do autor; substitui o Bootstrap),
  com cores e tokens do design definidos no tema do Tailwind.
- **Bibliotecas (a avaliar por uso):** `react-router` (telas), `html5-qrcode` ou
  `@zxing/browser` (código de barras), `recharts` (gráficos de comparação, opcional).
- **Estado:** `useState`/`useEffect` e Context para favoritos e itens em comparação
  _(sugestão)_.

Estrutura sugerida de componentes _(sugestão)_:

```
App
├── Header
├── pages/  Home · ProductDetail · Compare · Scanner · Favorites
├── components/  SearchBar · ProductCard · NutriScoreBadge · NutrientRow
│                AlertBadge · LoadingItem · ErrorState · EmptyState
├── services/  openFoodFacts.ts (fetch, tipos, cache)
├── data/  anvisaLimits.ts · riscos.ts
└── Footer
```

Partes que o autor precisa dominar para explicar no desafio: **consulta** (busca/serviço da
API) e **comparação**.

## 13. Entrega
1. Aplicação publicada (Vercel ou Netlify).
2. Repositório no GitHub.
3. `README.md` com: nome, problemática, objetivo, tecnologias, API, funcionalidades, como
   executar, link publicado e seção **🤖 Uso de Inteligência Artificial** (prompts + objetivo).

**Uso de IA a registrar:** técnica de Spec-Driven Development, prompt de design para o Stitch,
prompts para montar a camada de consumo da API. Prompts finais serão gerados após a aprovação
desta spec.

## 14. Checklist do desafio
- [ ] React + Vite
- [ ] API pública consumida e dados na interface
- [ ] Componentes separados
- [ ] Interação com os dados
- [ ] Responsivo
- [ ] Repositório no GitHub
- [ ] Publicado
- [ ] README completo
- [ ] Uso de IA documentado
- [ ] Autor consegue explicar as decisões

## 15. Pendências em aberto
- Aprovar a divisão Fase 1 / Fase 2 (a alternativa saudável e o perfil de saúde estavam como
  obrigatórios; foram movidos para a fase 2 por causa do prazo).
- Escolher o nome do projeto.
- Conferir limites no Anexo XV da IN 75/2020.
- Validar CORS (chamada direto do navegador).
- Anexar os prints do Stitch.
