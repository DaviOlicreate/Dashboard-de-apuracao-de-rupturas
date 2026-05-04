"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ApuracaoResult } from "@/lib/types";
import { Copy, Check, TrendingDown, PackageX, Store, ArrowLeft } from "lucide-react";
import Link from "next/link";
import LZString from "lz-string";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function RelatorioContent() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  
  const [data, setData] = useState<ApuracaoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!dataParam) {
      setError("Nenhum dado encontrado no link.");
      return;
    }
    
    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(dataParam);
      if (!decompressed) throw new Error("Link inválido ou corrompido.");
      
      const parsedData: ApuracaoResult = JSON.parse(decompressed);
      setData(parsedData);
    } catch (err: any) {
      setError("Erro ao carregar o relatório: " + err.message);
    }
  }, [dataParam]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error || (!data && dataParam)) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2 style={{ color: "var(--danger)" }}>{error || "Processando..."}</h2>
        <Link href="/" className="btn" style={{ marginTop: "1rem" }}>
          Voltar para Home
        </Link>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <Link href="/" style={{ color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <ArrowLeft size={20} /> Nova Apuração
        </Link>
        <div style={{ fontSize: "0.875rem", color: "#64748b" }}>
          Data: {new Date(data.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <div className="card" style={{ marginBottom: "2rem" }}>
        <h1>Visão Geral: Impacto Comercial</h1>
        <p>Resumo consolidado das planilhas processadas, mostrando o impacto na operação e nos resultados.</p>

        <div className="stats-grid">
          <div className="stat-card">
            <Store className="upload-icon" style={{ margin: "0 auto", color: "var(--foreground)" }} />
            <div className="stat-value" style={{ color: "var(--foreground)" }}>{data.totalLojas}</div>
            <div className="stat-label">Lojas Afetadas</div>
          </div>
          <div className="stat-card danger">
            <PackageX className="upload-icon" style={{ margin: "0 auto", color: "var(--danger)" }} />
            <div className="stat-value">{data.totalItensRuptura}</div>
            <div className="stat-label">Itens em Ruptura</div>
          </div>
          <div className="stat-card danger">
            <TrendingDown className="upload-icon" style={{ margin: "0 auto", color: "var(--danger)" }} />
            <div className="stat-value" style={{ fontSize: "2rem" }}>
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(data.valorEstimadoPerdido)}
            </div>
            <div className="stat-label">Valor Estimado (Risco)</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Top 10 Produtos (Impacto R$)</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topProdutos} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="nome" 
                    type="category" 
                    width={100} 
                    fontSize={10} 
                    stroke="var(--foreground)"
                  />
                  <Tooltip 
                    formatter={(value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                  <Bar dataKey="valor" fill="var(--danger)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Motivos da Ruptura</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.topMotivos}
                    dataKey="quantidade"
                    nameKey="motivo"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {data.topMotivos.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                {data.topMotivos.map((entry, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][index % 5] }} />
                    <span>{entry.motivo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: '3rem' }}>Compartilhar Apuração</h3>
        <p>Envie este link para a diretoria ou para o Alissandro analisar os resultados diretamente pelo celular.</p>
        <div className="share-box">
          <input
            type="text"
            className="share-input"
            readOnly
            value={typeof window !== "undefined" ? window.location.href : ""}
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <button className="btn" onClick={copyLink} style={{ display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
            {copied ? <><Check size={20} /> Copiado</> : <><Copy size={20} /> Copiar</>}
          </button>
        </div>
      </div>

      {data.totalLojas > 1 && (
        <>
          <h2>Comparativo por Loja</h2>
          <div className="card" style={{ marginBottom: '2rem', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.detalhesPorLoja.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="loja" fontSize={10} stroke="var(--foreground)" />
                <YAxis fontSize={10} stroke="var(--foreground)" />
                <Tooltip 
                  formatter={(value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
                <Bar dataKey="valor" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <h2>Detalhamento por Loja</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Loja / Filial</th>
              <th>Total de Itens</th>
              <th>Valor Impactado</th>
            </tr>
          </thead>
          <tbody>
            {data.detalhesPorLoja.map((loja, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500 }}>{loja.loja}</td>
                <td>{loja.itens} itens indisponíveis</td>
                <td style={{ color: "var(--danger)", fontWeight: 600 }}>
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(loja.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.amostraProblemas.length > 0 && (
        <>
          <h2>Amostra de Produtos (Impacto no Cliente)</h2>
          <p>Exemplos de produtos em falta (da cesta básica/mix) gerando insatisfação e desgaste.</p>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Loja</th>
                  <th>Produto</th>
                  <th>Situação/Motivo</th>
                </tr>
              </thead>
              <tbody>
                {data.amostraProblemas.map((item, i) => (
                  <tr key={i}>
                    <td>{item.loja}</td>
                    <td>{item.produto}</td>
                    <td><span style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "0.25rem 0.5rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 500 }}>{item.motivo}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default function Relatorio() {
  return (
    <Suspense fallback={<div className="container" style={{ textAlign: "center", marginTop: "4rem" }}><h2 className="animate-pulse">Carregando apuração...</h2></div>}>
      <RelatorioContent />
    </Suspense>
  );
}
