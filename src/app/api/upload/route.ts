import { NextRequest, NextResponse } from 'next/server';
import { processFile } from '@/lib/processor';
import { saveApuracao } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process file
    const apuracao = await processFile(buffer);
    
    // Save to DB
    await saveApuracao(apuracao);

    return NextResponse.json({ success: true, id: apuracao.id });
  } catch (error: any) {
    console.error('Error in upload route:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar arquivo.' }, { status: 500 });
  }
}
