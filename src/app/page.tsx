"use client";

import { TrendingDown, PackageX, Store, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import consolidado from "@/data/consolidado.json";

export default function Home() {
  const data = consolidado;

  return (
    <div className="container">
      <div style={{ textAlign: "center", marginBottom: "2rem", marginTop: "2rem" }}>
        <h1 style={{ color: "var(--primary)", fontSize: "2.5rem" }}>Painel Executivo de Rupturas</h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
          Relatório consolidado das apurações nas filiais 101, 102, 104, 106, 107 e 401.
        </p>
      </div>

      <div className="card" style={{ marginBottom: "2rem", borderTop: "4px solid var(--danger)" }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
          <AlertTriangle size={24} /> Alerta Crítico Diretoria
        </h2>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li><strong>Loja 107 (Laticínios):</strong> Setor operando <strong>EXCLUSIVAMENTE</strong> com marca Capelinha para Mussarela. Marcas como Nativille, São Félix e Santa Maria totalmente zeradas. Linha Nestlé (Chamy, Chandelle, Chambinho) com ruptura generalizada.</li>
          <li><strong>Geral (Destilados):</strong> Ruptura crítica de Aguardente Pitú e Cachaça 51 em 4 das 6 filiais apuradas.</li>
          <li><strong>Geral (Mercearia):</strong> Marcas líderes de Arroz (Gringo/Pindorama) e Leite em Pó (Ninho) com quebras constantes de estoque.</li>
          <li><strong>BRF Congelados (Lojas 101 e 401):</strong> Falta extensa de mix (Lasanhota, Hambúrguer, Nuggets).</li>
        </ul>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <Store className="upload-icon" style={{ margin: "0 auto", color: "var(--foreground)" }} />
          <div className="stat-value" style={{ color: "var(--foreground)" }}>{data.totalLojas}</div>
          <div className="stat-label">Lojas Apuradas</div>
        </div>
        <div className="stat-card danger">
          <PackageX className="upload-icon" style={{ margin: "0 auto", color: "var(--danger)" }} />
          <div className="stat-value">{data.totalItensRuptura}</div>
          <div className="stat-label">Itens Apontados em Ruptura</div>
        </div>
        <div className="stat-card danger">
          <TrendingDown className="upload-icon" style={{ margin: "0 auto", color: "var(--danger)" }} />
          <div className="stat-value" style={{ fontSize: "2rem" }}>
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(data.valorEstimadoPerdido)}
          </div>
          <div className="stat-label">Valor Estimado Perdido / Risco R$</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
        <div className="card" style={{ padding: '1rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Top 10 Categorias / Marcas (Impacto R$)</h3>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProdutos} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="nome" 
                  type="category" 
                  width={140} 
                  fontSize={10} 
                  stroke="var(--foreground)"
                />
                <Tooltip 
                  formatter={(value: any) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value))}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
                <Bar dataKey="valor" fill="var(--danger)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '1rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Motivos da Ruptura (Raiz)</h3>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.topMotivos}
                  dataKey="quantidade"
                  nameKey="motivo"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {data.topMotivos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem', marginTop: '1rem' }}>
              {data.topMotivos.map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'][index % 4] }} />
                  <span>{entry.motivo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: '3rem' }}>Comparativo: Risco por Filial</h2>
      <div className="card" style={{ marginBottom: '2rem', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.detalhesPorLoja}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="loja" fontSize={11} stroke="var(--foreground)" />
            <YAxis fontSize={11} stroke="var(--foreground)" />
            <Tooltip 
              formatter={(value: any) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value))}
              contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            />
            <Bar dataKey="valor" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h2>Detalhamento por Loja</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Loja / Filial</th>
              <th>Total de Itens Apontados</th>
              <th>Valor de Risco Calculado</th>
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

      <h2 style={{ marginTop: '2rem' }}>Amostra de Produtos (Impacto Severo no Cliente)</h2>
      <p>Esses produtos são formadores de imagem e geram alto índice de reclamação e evasão quando faltam.</p>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Filial Afetada</th>
              <th>Linha / Produto</th>
              <th>Situação / Motivo</th>
            </tr>
          </thead>
          <tbody>
            {data.amostraProblemas.map((item, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 'bold' }}>{item.loja}</td>
                <td>{item.produto}</td>
                <td><span style={{ backgroundColor: "#fee2e2", color: "#991b1b", padding: "0.25rem 0.5rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 500 }}>{item.motivo}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
