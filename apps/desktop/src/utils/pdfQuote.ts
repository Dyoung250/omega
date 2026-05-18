import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { QuoteResult } from "./quoteEngine";

export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  vat: string;
}

const DEFAULT_COMPANY: CompanyInfo = {
  name: "Officina Ferro Battuto - FORGIA",
  address: "Via dell'Artigianato, 42",
  city: "55045 - Pietrasanta (LU)",
  phone: "+39 0584 123456",
  email: "info@forgia-officina.it",
  vat: "P.IVA 01234567890",
};

export function generateQuotePDF(
  quote: QuoteResult,
  company: CompanyInfo = DEFAULT_COMPANY
): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 15;

  // ─── Branding colors ───
  const brandDark = [10, 10, 11] as [number, number, number];
  const brandAccent = [212, 175, 55] as [number, number, number];
  const textDark = [40, 40, 45] as [number, number, number];
  const textLight = [200, 200, 205] as [number, number, number];
  const textGray = [120, 120, 125] as [number, number, number];

  // ─── Header bar ───
  doc.setFillColor(...brandDark);
  doc.rect(0, 0, pageW, 32, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...brandAccent);
  doc.text("FORGIA", margin, 14);

  doc.setFontSize(8);
  doc.setTextColor(...textLight);
  doc.text("OFFICINA FERRO BATTUTO", margin, 19);

  doc.setFontSize(7);
  doc.setTextColor(...textGray);
  doc.text(`${company.address} — ${company.city}`, margin, 24);
  doc.text(`${company.phone}  |  ${company.email}`, margin, 28);

  // ─── Quote title ───
  doc.setFontSize(22);
  doc.setTextColor(...textDark);
  doc.setFont("helvetica", "bold");
  doc.text("PREVENTIVO", pageW - margin, 14, { align: "right" });

  doc.setFontSize(8);
  doc.setTextColor(...textGray);
  doc.text(`N. ${Date.now().toString().slice(-8)}`, pageW - margin, 19, { align: "right" });
  doc.text(new Date().toLocaleDateString("it-IT"), pageW - margin, 24, { align: "right" });

  // ─── Separator ───
  doc.setDrawColor(...brandAccent);
  doc.setLineWidth(0.5);
  doc.line(margin, 35, pageW - margin, 35);

  let y = 42;

  // ─── Scene summary box ───
  doc.setFillColor(248, 248, 250);
  doc.roundedRect(margin, y, pageW - margin * 2, 14, 2, 2, "F");
  doc.setFontSize(9);
  doc.setTextColor(...textDark);
  doc.setFont("helvetica", "bold");
  doc.text("Peso totale scena:", margin + 3, y + 6);
  doc.setFont("helvetica", "normal");
  doc.text(`${quote.totalWeightKg} kg`, margin + 3, y + 11);

  doc.setFont("helvetica", "bold");
  doc.text("Elementi:", margin + 55, y + 6);
  doc.setFont("helvetica", "normal");
  doc.text(`${quote.items.length}`, margin + 55, y + 11);

  y += 20;

  // ─── Items table ───
  const body = quote.items.map((item) => [
    item.name,
    item.materialName,
    `${item.weightKg} kg`,
    `€${item.unitPrice.toFixed(2)}`,
    `€${item.total.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Elemento", "Materiale", "Peso", "Prezzo unit.", "Totale"]],
    body,
    theme: "grid",
    headStyles: {
      fillColor: brandDark,
      textColor: brandAccent,
      fontStyle: "bold",
      fontSize: 8,
      halign: "left",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: textDark,
      halign: "left",
    },
    columnStyles: {
      0: { cellWidth: 55 },
      1: { cellWidth: 40 },
      2: { cellWidth: 25, halign: "right" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
    },
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [248, 248, 250],
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY ?? y + 10;

  // ─── Totals box ───
  const boxW = 70;
  const boxX = pageW - margin - boxW;
  const boxY = finalY + 6;
  const rowH = 6;

  doc.setFillColor(248, 248, 250);
  doc.roundedRect(boxX, boxY, boxW, rowH * 7 + 4, 2, 2, "F");

  const totals = [
    ["Materiale", quote.subtotalMaterial],
    ["Verniciatura", quote.subtotalPaint],
    ["Montaggio", quote.subtotalAssembly],
    ["Trasporto", quote.transportCost],
    ["Subtotale", quote.subtotal],
    [`Margine (${(quote.marginPercent * 100).toFixed(0)}%)`, quote.marginAmount],
    ["TOTALE", quote.total],
  ];

  doc.setFontSize(8);
  totals.forEach(([label, val], i) => {
    const isBold = i === totals.length - 1;
    const isSub = i === 4;
    const yy = boxY + 5 + i * rowH;

    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setTextColor(...(isBold ? brandDark : textGray));
    doc.text(String(label), boxX + 4, yy);

    doc.setTextColor(...(isBold ? brandAccent : textDark));
    doc.text(`€${Number(val).toFixed(2)}`, boxX + boxW - 4, yy, { align: "right" });

    if (isSub) {
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.2);
      doc.line(boxX + 4, yy + 2, boxX + boxW - 4, yy + 2);
    }
  });

  // ─── Footer ───
  doc.setFontSize(7);
  doc.setTextColor(...textGray);
  doc.setFont("helvetica", "italic");
  doc.text(
    "Preventivo valido 30 giorni. I prezzi sono indicativi e soggetti a verifica in sede.",
    margin,
    pageH - 10
  );
  doc.text(company.vat, pageW - margin, pageH - 10, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(180, 180, 180);
  doc.text("Generato con FORGIA", pageW / 2, pageH - 6, { align: "center" });

  return doc;
}

export function downloadQuotePDF(quote: QuoteResult, company?: CompanyInfo) {
  const doc = generateQuotePDF(quote, company);
  const date = new Date().toISOString().slice(0, 10);
  doc.save(`preventivo-forgia-${date}.pdf`);
}
