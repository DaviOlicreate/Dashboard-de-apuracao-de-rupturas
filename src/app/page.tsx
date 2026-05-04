"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, FileSpreadsheet } from "lucide-react";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      setError(null);
    }
  };

  const processFile = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao processar o arquivo.");
      }

      router.push(`/relatorio/${data.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1>Apuração de Rupturas</h1>
        <p>
          Faça upload de uma ou mais planilhas para gerar automaticamente o painel de impacto consolidado.
        </p>

        <div
          className={`upload-zone ${files.length > 0 ? "has-file" : ""}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {files.length > 0 ? (
            <>
              <FileSpreadsheet className="upload-icon" />
              <h2>{files.length} arquivo(s) selecionado(s)</h2>
              <p>
                {files.map(f => f.name).slice(0, 3).join(", ")}
                {files.length > 3 ? ` e mais ${files.length - 3}...` : ""}
              </p>
            </>
          ) : (
            <>
              <UploadCloud className="upload-icon" />
              <h2>Toque ou arraste os arquivos aqui</h2>
              <p>Suporta .xlsx ou .csv</p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            style={{ display: "none" }}
            multiple
          />
        </div>

        {error && <p style={{ color: "var(--danger)", marginTop: "1rem" }}>{error}</p>}

        <button
          className="btn"
          style={{ marginTop: "2rem", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}
          onClick={processFile}
          disabled={files.length === 0 || loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Processando...
            </>
          ) : (
            "Gerar Apuração Consolidada"
          )}
        </button>
      </div>
    </div>
  );
}
