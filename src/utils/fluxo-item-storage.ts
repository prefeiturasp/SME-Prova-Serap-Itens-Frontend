export const STORAGE_KEYS = {
  itemAtual: 'itemAtual',
  itemNovo: 'itemNovo',
  editandoItem: 'editandoItem',
  voltandoParaPrimeiraTela: 'voltandoParaPrimeiraTela',
  persistSerapItem: 'persist:SERAP-ITEM-PERSIST',
  itemFiltro: 'itemFiltro',
} as const;

export const limparStorageFluxoCadastro = (): void => {
  localStorage.removeItem(STORAGE_KEYS.itemAtual);
  localStorage.removeItem(STORAGE_KEYS.itemNovo);
  localStorage.removeItem(STORAGE_KEYS.editandoItem);
  localStorage.removeItem(STORAGE_KEYS.voltandoParaPrimeiraTela);
  localStorage.removeItem(STORAGE_KEYS.persistSerapItem);
};

export const limparStorageFiltroListagem = (): void => {
  localStorage.removeItem(STORAGE_KEYS.itemFiltro);
};
