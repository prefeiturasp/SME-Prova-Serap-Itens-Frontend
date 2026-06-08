import DOMPurify from 'dompurify';

export const htmlSeguro = (conteudo?: string | null): { __html: string } => {
  return {
    __html: DOMPurify.sanitize(conteudo ?? '', {
      USE_PROFILES: { html: true },
    }),
  };
};
