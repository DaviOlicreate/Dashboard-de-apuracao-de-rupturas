import fs from 'fs/promises';
import path from 'path';

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

const dbPath = path.join(process.cwd(), 'data', 'db.json');

export async function initDb() {
  try {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    try {
      await fs.access(dbPath);
    } catch {
      await fs.writeFile(dbPath, JSON.stringify([]));
    }
  } catch (error) {
    console.error('Error initializing DB', error);
  }
}

export async function saveApuracao(data: ApuracaoResult) {
  await initDb();
  const fileContent = await fs.readFile(dbPath, 'utf-8');
  const records: ApuracaoResult[] = JSON.parse(fileContent);
  records.push(data);
  await fs.writeFile(dbPath, JSON.stringify(records, null, 2));
}

export async function getApuracao(id: string): Promise<ApuracaoResult | null> {
  await initDb();
  const fileContent = await fs.readFile(dbPath, 'utf-8');
  const records: ApuracaoResult[] = JSON.parse(fileContent);
  return records.find(r => r.id === id) || null;
}
