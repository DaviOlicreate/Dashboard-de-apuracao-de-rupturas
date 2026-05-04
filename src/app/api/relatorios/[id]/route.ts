import { NextRequest, NextResponse } from 'next/server';
import { getApuracao } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await getApuracao(id);
    if (!data) {
      return NextResponse.json({ error: 'Relatório não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching relatorio:', error);
    return NextResponse.json({ error: 'Erro ao buscar relatório.' }, { status: 500 });
  }
}
