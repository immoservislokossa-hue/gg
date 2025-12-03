import React, { useState } from "react";

// Composant qui reçoit un CSV depuis le frontend
// et le transforme en JSON sans rien faire d'autre.

const CsvToJsonOnly: React.FC = () => {
  const [jsonData, setJsonData] = useState<any[] | null>(null);

  // Fonction simple pour parser un CSV → JSON
  function parseCSV(csv: string) {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim());

    const rows = lines.slice(1).map(line => {
      // Regex pour gérer les champs avec guillemets
      const values = line.match(/(".*?"|[^",]+)(?=,|$)/g)?.map(v => v.replace(/^"|"$/g, "").trim()) || [];
      const obj: Record<string, string> = {};

      headers.forEach((h, i) => {
        obj[h] = values[i] ?? "";
      });

      return obj;
    });

    return rows;
  }

  // Gestion du fichier envoyé
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed = parseCSV(text);
    setJsonData(parsed);
  }

  return (
    <div style={{ padding: 20 }}>
      <input type="file" accept=".csv" onChange={handleFile} />

      {jsonData && (
        <pre style={{
          marginTop: 20,
          background: "#1a1a1a",
          color: "#0f0",
          padding: 20,
          borderRadius: 8,
          maxHeight: 400,
          overflow: "auto",
        }}>
          {JSON.stringify(jsonData, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default CsvToJsonOnly;
