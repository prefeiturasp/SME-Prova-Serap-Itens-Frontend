import {
  converterListaParaCheckboxOption,
  validarCampoForm,
  validarCampoArrayStringForm,
  ruleCampoObrigatorioForm,
  ruleCampoArrayStringObrigatorioForm,
} from './funcoes';

describe('funcoes', () => {
  describe('converterListaParaCheckboxOption', () => {
    it('deve retornar lista vazia quando a lista for indefinida', () => {
      expect(converterListaParaCheckboxOption(undefined)).toEqual([]);
    });

    it('deve retornar lista vazia quando a lista estiver vazia', () => {
      expect(converterListaParaCheckboxOption([])).toEqual([]);
    });

    it('deve converter DefaultOptionType para CheckboxOptionType', () => {
      const lista = [
        { value: 1, label: 'Opção 1' },
        { value: 2, label: 'Opção 2' },
      ];
      const resultado = converterListaParaCheckboxOption(lista);
      expect(resultado).toEqual([
        { value: 1, label: 'Opção 1' },
        { value: 2, label: 'Opção 2' },
      ]);
    });
  });

  describe('validarCampoForm', () => {
    it('deve retornar true quando o valor for indefinido ou nulo', () => {
      expect(validarCampoForm(undefined)).toBe(true);
      expect(validarCampoForm(null)).toBe(true);
    });

    it('deve retornar false quando o valor for definido', () => {
      expect(validarCampoForm('abc')).toBe(false);
      expect(validarCampoForm(123)).toBe(false);
    });
  });

  describe('validarCampoArrayStringForm', () => {
    it('deve retornar true quando o valor for indefinido, nulo ou vazio', () => {
      expect(validarCampoArrayStringForm(undefined as any)).toBe(true);
      expect(validarCampoArrayStringForm(null as any)).toBe(true);
      expect(validarCampoArrayStringForm([])).toBe(true);
    });

    it('deve retornar false quando o array tiver valores', () => {
      expect(validarCampoArrayStringForm(['a'])).toBe(false);
    });
  });

  describe('ruleCampoObrigatorioForm', () => {
    it('deve retornar regra obrigatória quando o valor for indefinido', () => {
      const regras = ruleCampoObrigatorioForm(undefined);
      expect(regras).toHaveLength(1);
      expect(regras[0].required).toBe(true);
      expect(regras[0].message).toBe('Campo obrigatório');
    });

    it('deve retornar regra não obrigatória quando o valor for definido', () => {
      const regras = ruleCampoObrigatorioForm('abc');
      expect(regras[0].required).toBe(false);
    });
  });

  describe('ruleCampoArrayStringObrigatorioForm', () => {
    it('deve retornar obrigatório quando o array estiver vazio', () => {
      const regras = ruleCampoArrayStringObrigatorioForm([]);
      expect(regras[0].required).toBe(true);
      expect(regras[0].message).toBe('Campo obrigatório');
    });

    it('deve retornar não obrigatório quando o array tiver valores', () => {
      const regras = ruleCampoArrayStringObrigatorioForm(['x']);
      expect(regras[0].required).toBe(false);
    });
  });
});
