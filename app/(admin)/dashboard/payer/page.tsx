"use client"

import React, { useState } from "react";
import { createClient } from '@supabase/supabase-js';

const REQUIRED_FIELDS = [
  "id_valide",
  "type_identifiant",
  "identifiant_partie",
  "montant",
  "devise",
];

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const PageEditableJsonTable: React.FC = () => {
  const [jsonData, setJsonData] = useState<any[] | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed = parseCSV(text);
    setJsonData(parsed);
  };

  const parseCSV = (csv: string) => {
    const lines = csv.trim().split("\n");
    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map(line => {
      const values = line.match(/(".*?"|[^",]+)(?=,|$)/g)?.map(v => v.replace(/^"|"$/g, "").trim()) || [];
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => { obj[h] = values[i] ?? ""; });
      return obj;
    });
  };

  const updateCell = (rowIndex: number, key: string, value: string) => {
    if (!jsonData) return;
    const newData = [...jsonData];
    newData[rowIndex][key] = value;
    setJsonData(newData);
  };

  const verifyRows = async () => {
    if (!jsonData) return;

    const newData = await Promise.all(jsonData.map(async (row: any) => {
      const { data: validId } = await supabase.from('ids_valides').select('id').eq('id', row.id_valide).single();
      if (!validId) return { ...row, status: 'black' };

      const { data: existing } = await supabase.from('retraites').select('id_valide').eq('id_valide', row.id_valide).single();
      if (existing) return { ...row, status: 'red' };

      return { ...row, status: 'green' };
    }));

    setJsonData(newData);
  };

  const validateAndInsert = async () => {
    if (!jsonData) return;

    const validRows = jsonData.filter(row => row.status === 'green');
    if (validRows.length === 0) return;

    const formattedRows = validRows.map(row => ({
      id_valide: row.id_valide,
      type_identifiant: row.type_identifiant,
      identifiant_partie: row.identifiant_partie,
      montant: parseFloat(row.montant),
      devise: row.devise,
      Valide: true
    }));

    const { data, error } = await supabase.from('retraites').insert(formattedRows);

    if (error) {
      console.error('Erreur lors de l\'insertion :', error);
      alert('Erreur lors de l\'insertion. Vérifiez la console.');
    } else {
      console.log('Insertion réussie :', data);
      // Rafraîchir uniquement le tableau après insertion
      const updatedData = jsonData.map(row => row.status === 'green' ? { ...row, status: 'inserted' } : row);
      setJsonData(updatedData);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>Import CSV → JSON Editable Table</h1>
      <input type="file" accept=".csv" onChange={handleFile} />
      <button onClick={verifyRows} style={{ margin: '10px 5px', padding: '5px 10px' }}>Vérifier</button>
      <button onClick={validateAndInsert} style={{ margin: '10px 5px', padding: '5px 10px' }}>Valider & Insérer</button>

      {jsonData && (
        <table style={{ marginTop: 20, borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {REQUIRED_FIELDS.map(field => (
                <th key={field} style={{ border: "1px solid #ccc", padding: 8 }}>{field}</th>
              ))}
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {jsonData.map((row, i) => (
              <tr key={i}>
                {REQUIRED_FIELDS.map(field => (
                  <td key={field} style={{ border: "1px solid #ccc", padding: 5 }}>
                    <input
                      value={row[field] || ""}
                      onChange={e => updateCell(i, field, e.target.value)}
                      style={{
                        width: "100%",
                        border: row[field] ? "1px solid #ccc" : "2px solid red",
                        background: row[field] ? "white" : "#ffd6d6",
                        padding: 4,
                      }}
                    />
                  </td>
                ))}
                <td style={{ padding: 5 }}>
                  <span style={{
                    display: 'inline-block',
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: row.status === 'green' ? 'green' : row.status === 'red' ? 'red' : row.status === 'black' ? 'black' : row.status === 'inserted' ? '#00a000' : '#ddd'
                  }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PageEditableJsonTable;
