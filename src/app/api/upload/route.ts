import { NextRequest, NextResponse } from 'next/server';
import { processFile } from '@/lib/processor';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    const buffers: Buffer[] = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      buffers.push(Buffer.from(arrayBuffer));
    }

    // Process file
    const apuracao = await processFile(buffers);
    
    return NextResponse.json({ success: true, data: apuracao });
  } catch (error: any) {
    console.error('Error in upload route:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar arquivo.' }, { status: 500 });
  }
}
