import { SITE } from './site';

/**
 * Dados da autora — fonte única para /sobre/, a caixa "Sobre a autora" dos artigos e o JSON-LD.
 * Tudo aqui vem da bio aprovada pela autora; não acrescentar informações sem confirmação dela.
 */

/** Bio completa (página /sobre/), dividida em parágrafos. */
export const BIO = [
  'Ana Raquel de Almeida Dias estuda turismo desde o século passado: começou pelo curso técnico em Turismo em 1997 e seguiu para o bacharelado na área. É pós-graduada em Meio Ambiente e Responsabilidade Social pelo Senac São Paulo, tem MBA em Marketing pela USP e cursa o mestrado em Inovação Tecnológica na Unifesp (PPG-PIT).',
  'Foram 15 anos de atuação no Sistema S, entre Sesc e Senac, antes de fundar a DataTurismo Brasil, consultoria de planejamento e inteligência de dados para a gestão pública do turismo. É consultora credenciada do Sebrae-SP e criadora da plataforma PDTur Digital.',
];

/** Versão resumida (caixa no fim dos artigos). */
export const BIO_RESUMIDA =
  'Bacharel em Turismo, com MBA em Marketing pela USP e mestrado em andamento em Inovação Tecnológica na Unifesp (PPG-PIT). Após 15 anos no Sistema S, entre Sesc e Senac, fundou a DataTurismo Brasil. É consultora credenciada do Sebrae-SP e criadora da plataforma PDTur Digital.';

export const FORMACAO = [
  'Curso técnico em Turismo (1997)',
  'Bacharelado em Turismo',
  'Pós-graduação em Meio Ambiente e Responsabilidade Social — Senac São Paulo',
  'MBA em Marketing — USP',
  'Mestrado em Inovação Tecnológica — Unifesp (PPG-PIT), em andamento',
];

export const ATUACAO = [
  '15 anos no Sistema S, entre Sesc e Senac',
  'Fundadora da DataTurismo Brasil',
  'Consultora credenciada do Sebrae-SP',
  'Criadora da plataforma PDTur Digital',
];

const SENAC_SP = { '@type': 'EducationalOrganization', name: 'Senac São Paulo' };
const USP = { '@type': 'CollegeOrUniversity', name: 'Universidade de São Paulo (USP)' };

const credencial = (name: string, credentialCategory: string, recognizedBy?: object) => ({
  '@type': 'EducationalOccupationalCredential',
  name,
  credentialCategory,
  ...(recognizedBy && { recognizedBy }),
});

/** Schema.org `Person` da autora. Mestrado em andamento fica fora de alumniOf/credenciais (ainda não concluído). */
export function pessoaJsonLd() {
  return {
    '@type': 'Person',
    name: SITE.autora.nome,
    url: SITE.autora.url,
    description: BIO.join(' '),
    jobTitle: 'Fundadora da DataTurismo Brasil',
    worksFor: { '@type': 'Organization', name: SITE.organizacao.nome, url: SITE.organizacao.url },
    alumniOf: [SENAC_SP, USP],
    hasCredential: [
      credencial('Técnico em Turismo', 'certificate'),
      credencial('Bacharelado em Turismo', 'degree'),
      credencial('Pós-graduação em Meio Ambiente e Responsabilidade Social', 'degree', SENAC_SP),
      credencial('MBA em Marketing', 'degree', USP),
    ],
    sameAs: [SITE.instagram, SITE.siteInstitucional],
  };
}
