"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Set the worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function PdfViewer({ url, filename }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function handlePrevPage() {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }

  function handleNextPage() {
    setPageNumber((prev) => Math.min(prev + 1, numPages || 1));
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={pageNumber === 1}
            className="border-2 border-ink/20 px-3 py-2 font-mono text-xs uppercase tracking-wide hover:bg-ink/5 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="font-mono text-xs text-ink/60">
            Page {pageNumber} of {numPages || "—"}
          </span>
          <button
            onClick={handleNextPage}
            disabled={pageNumber === numPages}
            className="border-2 border-ink/20 px-3 py-2 font-mono text-xs uppercase tracking-wide hover:bg-ink/5 disabled:opacity-40"
          >
            Next →
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))}
            className="border-2 border-ink/20 px-3 py-2 font-mono text-xs uppercase tracking-wide hover:bg-ink/5"
          >
            −
          </button>
          <span className="font-mono text-xs text-ink/60 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(s + 0.2, 2))}
            className="border-2 border-ink/20 px-3 py-2 font-mono text-xs uppercase tracking-wide hover:bg-ink/5"
          >
            +
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex justify-center overflow-auto bg-chalk p-4">
        <Document url={url} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} scale={scale} />
        </Document>
      </div>

      {/* Footer */}
      <p className="font-mono text-xs text-ink/50">
        Viewing: {filename || "Rule Book"}
      </p>
    </div>
  );
}
