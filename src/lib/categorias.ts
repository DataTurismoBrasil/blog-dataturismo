export const CATEGORIAS = {
  'plano-diretor-de-turismo': {
    nome: 'Plano Diretor de Turismo',
    descricao: 'Elaboração, revisão e execução do Plano Diretor de Turismo (PDTur) municipal.',
  },
  'observatorio-e-dados': {
    nome: 'Observatório e Dados',
    descricao: 'Observatórios de turismo, indicadores e uso de dados na gestão pública do turismo.',
  },
  'icms-turistico': {
    nome: 'ICMS Turístico',
    descricao: 'Critérios, pontuação e estratégias para o ICMS Turístico dos municípios.',
  },
  'legislacao-do-turismo': {
    nome: 'Legislação do Turismo',
    descricao:
      'Lei 14.133/2021, LC 1.261/2015, Lei 11.771/2008 e demais normas aplicadas à gestão pública do turismo.',
  },
  'mapa-do-turismo': {
    nome: 'Mapa do Turismo',
    descricao: 'Mapa do Turismo Brasileiro: categorização, requisitos e permanência dos municípios.',
  },
} as const;

export type Categoria = keyof typeof CATEGORIAS;

export function nomeCategoria(slug: string): string {
  return CATEGORIAS[slug as Categoria]?.nome ?? slug;
}
