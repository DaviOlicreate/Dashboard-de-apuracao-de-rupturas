"use client";

import { useState } from "react";
import { TrendingDown, PackageX, Store, AlertOctagon, Filter, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import consolidado from "@/data/consolidado.json";

export default function Home() {
  const [filtroLoja, setFiltroLoja] = useState<string>("Todas");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  const lojasUnicas = ["Todas", ...consolidado.lojasAvaliadas];

  // Filtros Globais
  const dadosFiltrados = consolidado.detalhesPorLoja.filter(
    (loja) => filtroLoja === "Todas" || loja.loja.includes(filtroLoja)
  );

  const amostraFiltrada = consolidado.amostraProblemas.filter(
    (item) => filtroLoja === "Todas" || item.loja.includes(filtroLoja)
  );

  // Totais Recalculados
  const totalItens = dadosFiltrados.reduce((acc, curr) => acc + curr.itens, 0);
  const totalValor = dadosFiltrados.reduce((acc, curr) => acc + curr.valor, 0);

  // Paginação
  const totalPaginas = Math.ceil(amostraFiltrada.length / itensPorPagina);
  const inicioAmostra = (paginaAtual - 1) * itensPorPagina;
  const amostraPaginada = amostraFiltrada.slice(inicioAmostra, inicioAmostra + itensPorPagina);

  return (
    <>
      <header className="app-header">
        <div className="brand-title">
          <ShoppingCart size={28} />
          <span>São Luiz <span style={{ color: "var(--foreground)", fontWeight: 300 }}>Dashboard</span></span>
        </div>
        <div className="global-filters">
          <Filter size={18} style={{ color: "var(--primary)" }} />
          <select 
            className="filter-select" 
            value={filtroLoja} 
            onChange={(e) => {
              setFiltroLoja(e.target.value);
              setPaginaAtual(1); // Reseta a paginação ao filtrar
            }}
          >
            {lojasUnicas.map(loja => (
              <option key={loja} value={loja}>{loja === "Todas" ? "Todas as Lojas" : `Loja ${loja}`}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="container">
        
        {/* Notificação Crítica */}
        <div className="alert-card">
          <AlertOctagon size={32} className="alert-icon" />
          <div className="alert-content">
            <h2>Alerta Estratégico: Rupturas Críticas</h2>
            <p>
              Análise imediata das 6 lojas apuradas indica desgaste operacional nas categorias formadoras de fluxo (Curva A). 
              A <strong>Loja 107</strong> opera os Frios apenas com a marca Capelinha e está totalmente zerada na linha Nestlé Laticínios.
              As categorias de <strong>Destilados (Pitu/51)</strong> e <strong>Arroz (Gringo/Pindorama)</strong> apresentam quebras em mais de 60% da rede.
            </p>
            <div className="alert-tags">
              <span className="badge badge-danger">Laticínios Críticos</span>
              <span className="badge badge-warning">Ruptura de Fornecimento</span>
              <span className="badge badge-primary">Impacto Alto no Cliente</span>
            </div>
          </div>
        </div>

        {/* KPIs Dinâmicos */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon-wrapper"><Store size={24} /></div>
            </div>
            <div className="stat-value">{filtroLoja === "Todas" ? consolidado.totalLojas : 1}</div>
            <div className="stat-label">Lojas Apuradas</div>
          </div>

          <div className="stat-card danger">
            <div className="stat-header">
              <div className="stat-icon-wrapper"><PackageX size={24} /></div>
              {filtroLoja === "Todas" && <span className="trend-badge trend-down">Crítico</span>}
            </div>
            <div className="stat-value">{totalItens}</div>
            <div className="stat-label">Itens em Ruptura</div>
          </div>

          <div className="stat-card danger">
            <div className="stat-header">
              <div className="stat-icon-wrapper"><TrendingDown size={24} /></div>
            </div>
            <div className="stat-value" style={{ fontSize: "2rem" }}>
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(totalValor)}
            </div>
            <div className="stat-label">Risco Financeiro Estimado</div>
          </div>
        </div>

        {/* Gráficos */}
        {filtroLoja === "Todas" && (
          <div className="dashboard-grid">
            <div className="card">
              <h3>Top Categorias e Marcas (R$)</h3>
              <div style={{ height: '300px', width: '100%', marginTop: '1.5rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={consolidado.topProdutos} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="nome" type="category" width={120} fontSize={10} stroke="var(--foreground)" />
                    <Tooltip 
                      formatter={(value: any) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value))}
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)', borderRadius: '8px' }}
                      cursor={{fill: 'rgba(249, 115, 22, 0.05)'}}
                    />
                    <Bar dataKey="valor" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3>Motivos Raiz (Rede Geral)</h3>
              <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={consolidado.topMotivos}
                      dataKey="quantidade"
                      nameKey="motivo"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                    >
                      {consolidado.topMotivos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#f97316', '#eab308', '#ef4444', '#10b981'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tabela Paginada */}
        <div className="table-container">
          <div className="table-header-row">
            <div>
              <h3>Amostra: Impacto no Cliente</h3>
              <p style={{ fontSize: "0.875rem", marginBottom: 0 }}>Produtos curva A que geram insatisfação quando faltam.</p>
            </div>
            <div className="badge badge-primary">{amostraFiltrada.length} Registros</div>
          </div>
          
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Filial</th>
                  <th>Linha / Produto</th>
                  <th>Situação / Motivo</th>
                </tr>
              </thead>
              <tbody>
                {amostraPaginada.length > 0 ? (
                  amostraPaginada.map((item, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{item.loja}</td>
                      <td>{item.produto}</td>
                      <td>
                        <span className={`badge ${item.motivo.includes('Crítica') || item.motivo.includes('Zerado') ? 'badge-danger' : 'badge-warning'}`}>
                          {item.motivo}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", padding: "2rem" }}>Nenhuma ocorrência grave para esta filial no filtro atual.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Controles de Paginação */}
          {totalPaginas > 1 && (
            <div className="pagination">
              <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                Página <strong>{paginaAtual}</strong> de {totalPaginas}
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button 
                  className="page-btn" 
                  disabled={paginaAtual === 1}
                  onClick={() => setPaginaAtual(p => p - 1)}
                >
                  <ChevronLeft size={18} />
                </button>
                <button 
                  className="page-btn" 
                  disabled={paginaAtual === totalPaginas}
                  onClick={() => setPaginaAtual(p => p + 1)}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

      </main>
    </>
  );
}
