type ItemAtualVideoAudio = {
  videoTemp?: unknown;
  audioTemp?: unknown;
  videoSalvo?: unknown;
  audioSalvo?: unknown;
};

type ItemAtualElaboracao = {
  alternativaA?: string;
  justificativaA?: string;
  alternativaB?: string;
  justificativaB?: string;
  alternativaC?: string;
  justificativaC?: string;
  alternativaD?: string;
  justificativaD?: string;
};

export type ItemAtual = {
  videoAudio?: ItemAtualVideoAudio;
  elaboracao?: ItemAtualElaboracao;
  [key: string]: unknown;
};

const ITEM_ATUAL_KEY = 'itemAtual';

export const lerItemAtual = (): ItemAtual | null => {
  try {
    const item = localStorage.getItem(ITEM_ATUAL_KEY);
    if (!item) return null;
    return JSON.parse(item) as ItemAtual;
  } catch {
    return null;
  }
};

export const salvarItemAtual = (item: ItemAtual): void => {
  localStorage.setItem(ITEM_ATUAL_KEY, JSON.stringify(item));
};

export const atualizarItemAtual = (updater: (item: ItemAtual) => ItemAtual): ItemAtual | null => {
  const itemAtual = lerItemAtual();
  if (!itemAtual) return null;
  const itemAtualizado = updater(itemAtual);
  salvarItemAtual(itemAtualizado);
  return itemAtualizado;
};
