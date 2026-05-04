export interface ApuracaoResult {
  id: string;
  createdAt: string;
  totalLojas: number;
  totalItensRuptura: number;
  valorEstimadoPerdido: number;
  detalhesPorLoja: {
    loja: string;
    itens: number;
    valor: number;
  }[];
  amostraProblemas: {
    produto: string;
    loja: string;
    motivo: string;
  }[];
}
