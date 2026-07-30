/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Export Utilities (CSV & Exact A5 Layout PDF Export)
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import dayjs from 'dayjs';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { GatePass } from '../types';
import { A5PrintTemplate } from '../components/print/A5PrintTemplate';
import { SettingsProvider } from '../context/SettingsContext';

export const exportToCSV = (filename: string, rows: Record<string, any>[]) => {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const val = row[header] ?? '';
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${dayjs().format('YYYY-MM-DD_HHmm')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Renders an exact A5 Printed Voucher into a PDF document matching the physical print layout
 */
export const exportGatePassToA5PDF = async (pass: GatePass) => {
  let element = document.getElementById(`a5-voucher-${pass.id}`);
  let createdTempContainer: HTMLDivElement | null = null;

  if (!element) {
    createdTempContainer = document.createElement('div');
    createdTempContainer.style.position = 'fixed';
    createdTempContainer.style.left = '0';
    createdTempContainer.style.top = '0';
    createdTempContainer.style.width = '148mm';
    createdTempContainer.style.zIndex = '-99999';
    createdTempContainer.style.opacity = '0.01';
    createdTempContainer.style.pointerEvents = 'none';
    createdTempContainer.style.backgroundColor = '#ffffff';
    document.body.appendChild(createdTempContainer);

    const root = createRoot(createdTempContainer);
    root.render(
      <SettingsProvider>
        <A5PrintTemplate gatePass={pass} />
      </SettingsProvider>
    );

    // Give React time to complete render
    await new Promise((res) => setTimeout(res, 300));
    element = createdTempContainer.firstElementChild as HTMLElement;
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 148 mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 210 mm

  let success = false;

  if (element) {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      success = true;
    } catch (canvasErr) {
      console.warn('html2canvas rendering failed, using direct jsPDF layout fallback:', canvasErr);
    }
  }

  if (!success) {
    // Failsafe Direct jsPDF A5 Layout Generation
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('SALEEM DAAL FACTORY', 10, 15);

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('High Quality Pulses Processing & Grain Mill', 10, 20);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.rect(10, 24, 128, 8);
    pdf.text(`${pass.type === 'IGP' ? 'IN GATE PASS (IGP)' : 'OUT GATE PASS (OGP)'} - ${pass.gatePassNo}`, 12, 29);

    pdf.setFontSize(9);
    pdf.text(`Date & Time: ${pass.date} ${pass.time}`, 10, 38);
    pdf.text(`Vehicle No: ${pass.vehicleNumber}`, 80, 38);
    pdf.text(`Party Name: ${pass.partyName}`, 10, 44);
    pdf.text(`Transport Co: ${pass.transporterName || 'N/A'}`, 80, 44);
    pdf.text(`Driver: ${pass.driverName} (${pass.driverPhone})`, 10, 50);
    pdf.text(`CNIC: ${pass.driverCnic || 'N/A'}`, 80, 50);

    // Table Header
    pdf.rect(10, 55, 128, 6);
    pdf.setFont('helvetica', 'bold');
    pdf.text('#', 12, 59);
    pdf.text('Product Item', 20, 59);
    pdf.text('Packing', 70, 59);
    pdf.text('Bags', 95, 59);
    pdf.text('Total Wt (kg)', 115, 59);

    let y = 65;
    pass.items.forEach((item, idx) => {
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${idx + 1}`, 12, y);
      pdf.text(`${item.productName}`, 20, y);
      pdf.text(`${item.packingType}`, 70, y);
      pdf.text(`${item.numberOfBags}`, 95, y);
      pdf.text(`${item.grossWeightKg} kg`, 115, y);
      y += 6;
    });

    pdf.rect(10, y, 128, 6);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`TOTAL BAGS: ${pass.totalBags}`, 12, y + 4.5);
    pdf.text(`TOTAL WEIGHT: ${pass.totalItemWeightKg} kg`, 80, y + 4.5);

    y += 12;
    pdf.rect(10, y, 128, 16);
    pdf.text('WEIGHBRIDGE WEIGHTS', 12, y + 5);
    pdf.text(`1st Weight: ${pass.weighment?.firstWeightKg ? pass.weighment.firstWeightKg + ' kg' : '__________'}`, 12, y + 11);
    pdf.text(`2nd Weight: ${pass.weighment?.secondWeightKg ? pass.weighment.secondWeightKg + ' kg' : '__________'}`, 55, y + 11);
    pdf.text(`NET WEIGHT: ${pass.weighment?.netWeightKg ? pass.weighment.netWeightKg + ' kg' : '__________'}`, 95, y + 11);

    y += 24;
    pdf.line(10, y, 35, y);
    pdf.line(42, y, 67, y);
    pdf.line(74, y, 99, y);
    pdf.line(106, y, 131, y);
    pdf.setFontSize(7);
    pdf.text('Operator', 15, y + 3);
    pdf.text('Security', 48, y + 3);
    pdf.text('Driver', 81, y + 3);
    pdf.text('Manager', 112, y + 3);
  }

  pdf.save(`GatePass_${pass.gatePassNo}_${dayjs().format('YYYYMMDD_HHmm')}.pdf`);

  if (createdTempContainer) {
    try {
      document.body.removeChild(createdTempContainer);
    } catch (e) {
      // ignore cleanup if already detached
    }
  }
};

/**
 * Export multiple gate passes as a multi-page A5 PDF matching print vouchers
 */
export const exportGatePassesToPDF = async (passes: GatePass[], filename = 'Gate_Passes') => {
  if (!passes || passes.length === 0) return;

  if (passes.length === 1) {
    await exportGatePassToA5PDF(passes[0]);
    return;
  }

  // Create temporary off-screen container
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '148mm';
  document.body.appendChild(tempContainer);

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < passes.length; i++) {
    const pass = passes[i];

    // Render pass
    const passWrapper = document.createElement('div');
    tempContainer.appendChild(passWrapper);

    const root = createRoot(passWrapper);
    root.render(
      <SettingsProvider>
        <A5PrintTemplate gatePass={pass} />
      </SettingsProvider>
    );

    await new Promise((res) => setTimeout(res, 200));

    const elem = passWrapper.firstElementChild as HTMLElement;
    if (elem) {
      const canvas = await html2canvas(elem, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage('a5', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    tempContainer.removeChild(passWrapper);
  }

  document.body.removeChild(tempContainer);
  pdf.save(`${filename}_${dayjs().format('YYYYMMDD')}.pdf`);
};
