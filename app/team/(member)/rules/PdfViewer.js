"use client";

export default function PdfViewer({ url, filename }) {
  return (
    <div className="mt-6 space-y-4">
      <iframe
        src={url}
        className="w-full border-2 border-ink/10"
        style={{ height: "700px" }}
        title={filename}
      />
      <p className="font-mono text-xs text-ink/50">
        Viewing: {filename || "Rule Book"}
      </p>
    </div>
  );
}
