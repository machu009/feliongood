"use client";

function toCsv(rows) {
  const headers = [
    "parent_name",
    "player_name",
    "player_age",
    "email",
    "phone",
    "notes",
    "created_at",
  ];

  const escape = (val) => {
    const str = val === null || val === undefined ? "" : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  });
  return lines.join("\n");
}

export default function ExportCsvButton({ signups, filename }) {
  function handleExport() {
    const csv = toCsv(signups);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      disabled={!signups || signups.length === 0}
      className="border-2 border-ink px-4 py-2 font-mono text-xs uppercase tracking-wide hover:bg-ink hover:text-chalk disabled:opacity-40"
    >
      Export CSV
    </button>
  );
}
