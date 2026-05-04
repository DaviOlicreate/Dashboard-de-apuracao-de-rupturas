"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Loader2, FileSpreadsheet } from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const processFile = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

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
          Faça upload da planilha enviada para gerar automaticamente o painel de impacto comercial.
        </p>

        <div
          className={`upload-zone ${file ? "has-file" : ""}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {file ? (
            <>
              <FileSpreadsheet className="upload-icon" />
              <h2>{file.name}</h2>
              <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </>
          ) : (
            <>
              <UploadCloud className="upload-icon" />
              <h2>Toque ou arraste o arquivo aqui</h2>
              <p>Suporta .xlsx ou .csv</p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            style={{ display: "none" }}
          />
        </div>

        {error && <p style={{ color: "var(--danger)", marginTop: "1rem" }}>{error}</p>}

        <button
          className="btn"
          style={{ marginTop: "2rem", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}
          onClick={processFile}
          disabled={!file || loading}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Processando...
            </>
          ) : (
            "Gerar Apuração"
          )}
        </button>
      </div>
    </div>
  );
}
