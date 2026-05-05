"use client";

import { useState } from "react";
import { AlertCircle, MapPin, Package, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import consolidado from "@/data/consolidado.json";

export default function Home() {
  const [filtroLoja, setFiltroLoja] = useState<string>("Todas as Lojas");
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("Esta Semana");

  const lojasUnicas = ["Todas as Lojas", ...consolidado.lojasAvaliadas];

  // Filtros Globais
  const dadosFiltrados = consolidado.detalhesPorLoja.filter(
    (loja) => filtroLoja === "Todas as Lojas" || loja.loja.includes(filtroLoja)
  );

  const amostraFiltrada = consolidado.amostraProblemas.filter(
    (item) => filtroLoja === "Todas as Lojas" || item.loja.includes(filtroLoja)
  );

  const totalItens = dadosFiltrados.reduce((acc, curr) => acc + curr.itens, 0);
  const totalValor = dadosFiltrados.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <>
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo">SL</div>
          <div className="brand-text">
            <span className="brand-title">Painel de Rupturas</span>
            <span className="brand-subtitle">Supermercados São Luiz</span>
          </div>
        </div>
        <div className="global-filters">
          <select 
            className="filter-select" 
            value={filtroLoja} 
            onChange={(e) => setFiltroLoja(e.target.value)}
          >
            {lojasUnicas.map(loja => (
              <option key={loja} value={loja}>{loja}</option>
            ))}
          </select>
          <select 
            className="filter-select" 
            value={filtroPeriodo} 
            onChange={(e) => setFiltroPeriodo(e.target.value)}
          >
            <option value="Esta Semana">Esta Semana</option>
            <option value="Semana Passada">Semana Passada</option>
            <option value="Este Mês">Este Mês</option>
          </select>
        </div>
      </header>

      <main className="container">
        
        {/* Alerta Crítico */}
        <div className="alert-box">
          <div className="alert-header">
            <AlertCircle size={20} strokeWidth={2.5} />
            <span>Alerta Crítico - Ação Imediata Requerida</span>
          </div>
          <div className="alert-body">
            <p><strong>Loja 107 (Laticínios):</strong> Operando EXCLUSIVAMENTE com marca Capelinha para Mussarela. Marcas Nativille, São Félix e Santa Maria zeradas. Linha Nestlé com ruptura generalizada.</p>
            <p><strong>Destilados (Geral):</strong> Ruptura crítica de Aguardente Pitú e Cachaça 51 em 4 das 6 filiais.</p>
            <p><strong>BRF Congelados:</strong> Falta extensa de mix em Lojas 101 e 401.</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon-container">
              <MapPin size={20} />
            </div>
            <div className="stat-trend">+0%</div>
            <div className="stat-label">Lojas Apuradas</div>
            <div className="stat-value">{filtroLoja === "Todas as Lojas" ? consolidado.totalLojas : 1}</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-container">
              <Package size={20} />
            </div>
            <div className="stat-trend">+8%</div>
            <div className="stat-label">Itens em Ruptura</div>
            <div className="stat-value">{totalItens}</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-container">
              <DollarSign size={20} />
            </div>
            <div className="stat-trend">+12%</div>
            <div className="stat-label">Valor em Risco</div>
            <div className="stat-value">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(totalValor)}
            </div>
          </div>
        </div>

        {/* Gráficos */}
        {filtroLoja === "Todas as Lojas" && (
          <div className="charts-grid">
            <div className="card">
              <h3 className="card-title">Top 10 Categorias / Marcas</h3>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={consolidado.topProdutos} margin={{ left: 0, right: 0, top: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis 
                      dataKey="nome" 
                      fontSize={10} 
                      stroke="#94a3b8" 
                      angle={-45} 
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis fontSize={10} stroke="#94a3b8" width={60} />
                    <RechartsTooltip 
                      formatter={(value: any) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value))}
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                      cursor={{fill: 'rgba(249, 115, 22, 0.05)'}}
                    />
                    <Bar dataKey="valor" fill="#f97316" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Motivos da Ruptura</h3>
              <div style={{ height: '300px', width: '100%', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={consolidado.topMotivos}
                      dataKey="quantidade"
                      nameKey="motivo"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }: any) => {
                        const RADIAN = Math.PI / 180;
                        const radius = 25 + (innerRadius || 0) + ((outerRadius || 100) - (innerRadius || 0));
                        const x = (cx || 0) + radius * Math.cos(-(midAngle || 0) * RADIAN);
                        const y = (cy || 0) + radius * Math.sin(-(midAngle || 0) * RADIAN);
                        
                        // Extract a shorter label text
                        let labelText = consolidado.topMotivos[index].motivo.split(' (')[0];
                        
                        return (
                          <text x={x} y={y} fill="#ea580c" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                            {`${labelText}: ${Math.round(value / 3.12)}%`}
                          </text>
                        );
                      }}
                    >
                      {consolidado.topMotivos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#ea580c', '#f59e0b', '#f97316', '#fb923c'][index % 4]} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#fff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tabelas */}
        <div className="card table-card">
          <h3 className="card-title">Comparativo: Risco por Filial</h3>
          <table>
            <thead>
              <tr>
                <th>Loja / Filial</th>
                <th style={{ textAlign: "center" }}>Itens em Ruptura</th>
                <th style={{ textAlign: "right" }}>Valor de Risco</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((loja, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500 }}>{loja.loja}</td>
                  <td style={{ textAlign: "center" }}>
                    <span className="number-pill">{loja.itens}</span>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(loja.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card table-card">
          <h3 className="card-title">Amostra de Produtos (Impacto Severo)</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Esses produtos são formadores de imagem e geram alto índice de reclamação quando faltam.
          </p>
          <table>
            <thead>
              <tr>
                <th>Filial Afetada</th>
                <th>Linha / Produto</th>
                <th>Situação / Motivo</th>
              </tr>
            </thead>
            <tbody>
              {amostraFiltrada.map((item, i) => {
                const isCritica = item.motivo.includes("Crítica") || item.motivo.includes("Zerado");
                let shortMotivo = item.motivo;
                if(item.motivo.includes("Falta de Fornecimento")) shortMotivo = "Falta de Fornecimento";
                if(item.motivo.includes("Estoque Zerado")) shortMotivo = "Estoque Zerado";
                if(item.motivo.includes("Ruptura Comercial Crítica")) shortMotivo = "Ruptura Crítica";
                if(item.motivo.includes("Falta Extensa de Mix")) shortMotivo = "Falta de Mix";
                if(item.motivo.includes("Baixo Estoque")) shortMotivo = "Baixo Estoque";
                if(item.motivo === "Ruptura Comercial") shortMotivo = "Ruptura Comercial";
                if(item.motivo.includes("Alta Demanda")) shortMotivo = "Alta Demanda";

                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{item.loja}</td>
                    <td>{item.produto}</td>
                    <td>
                      <span className={`status-badge ${isCritica ? 'status-danger' : 'status-warning'}`}>
                        {shortMotivo}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </main>

      <footer className="footer">
        © 2026 Supermercados São Luiz | Dashboard de Apuração de Rupturas
      </footer>
    </>
  );
}
