'use client';

import { useState } from 'react';
import * as XLSX from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import styles from './ReportExport.module.css';
import { useToast } from './ToastProvider';

interface ReportExportProps {
  tipo: 'rentas' | 'vehiculos' | 'clientes' | 'ingresos';
}

export default function ReportExport({ tipo }: ReportExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [formato, setFormato] = useState<'excel' | 'pdf'>('excel');
  const { showToast } = useToast();

  const exportarExcel = async (data: any[], filename: string) => {
    const workbook = new XLSX.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // Configurar encabezados
    if (tipo === 'rentas') {
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Cliente', key: 'cliente', width: 25 },
        { header: 'Vehículo', key: 'vehiculo', width: 25 },
        { header: 'Fecha Inicio', key: 'fechaInicio', width: 15 },
        { header: 'Fecha Fin', key: 'fechaFin', width: 15 },
        { header: 'Precio Total', key: 'precioTotal', width: 15 },
        { header: 'Estado', key: 'estado', width: 12 },
      ];
    } else if (tipo === 'vehiculos') {
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Marca', key: 'marca', width: 15 },
        { header: 'Modelo', key: 'modelo', width: 20 },
        { header: 'Año', key: 'anio', width: 10 },
        { header: 'Precio/Día', key: 'precio', width: 12 },
        { header: 'Disponible', key: 'disponible', width: 12 },
        { header: 'Veces Rentado', key: 'vecesRentado', width: 15 },
      ];
    }

    // Agregar datos
    data.forEach(row => worksheet.addRow(row));

    // Estilizar encabezados
    worksheet.getRow(1).font = { bold: true, size: 12 };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF3B82F6' },
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // Generar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const exportarPDF = (data: any[], filename: string) => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Reporte de ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`, 14, 22);

    // Fecha
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha de Generación: ${new Date().toLocaleDateString('es-ES')}`, 14, 30);

    // Tabla
    let columns: string[] = [];
    let rows: any[][] = [];

    if (tipo === 'rentas') {
      columns = ['ID', 'Cliente', 'Vehículo', 'Inicio', 'Fin', 'Total', 'Estado'];
      rows = data.map(r => [
        r.id.substring(0, 8),
        r.cliente,
        r.vehiculo,
        new Date(r.fechaInicio).toLocaleDateString('es-ES'),
        new Date(r.fechaFin).toLocaleDateString('es-ES'),
        `$${r.precioTotal}`,
        r.estado,
      ]);
    } else if (tipo === 'vehiculos') {
      columns = ['ID', 'Marca', 'Modelo', 'Año', 'Precio', 'Disponible', 'Rentas'];
      rows = data.map(v => [
        v.id.substring(0, 8),
        v.marca,
        v.modelo,
        v.anio,
        `$${v.precio}`,
        v.disponible ? 'Sí' : 'No',
        v.vecesRentado || 0,
      ]);
    }

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 35,
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        fontStyle: 'bold',
        halign: 'center',
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    doc.save(`${filename}.pdf`);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Obtener datos de la API
      let endpoint = '';
      if (tipo === 'rentas') endpoint = '/api/rentas';
      else if (tipo === 'vehiculos') endpoint = '/api/vehiculos';
      else if (tipo === 'clientes') endpoint = '/api/clientes';

      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Error al obtener datos');

      let data = await response.json();

      // Transformar datos según el tipo
      if (tipo === 'rentas') {
        data = data.map((r: any) => ({
          id: r.id,
          cliente: `${r.cliente.nombre} ${r.cliente.apellido}`,
          vehiculo: `${r.vehiculo.marca} ${r.vehiculo.modelo}`,
          fechaInicio: r.fechaInicio,
          fechaFin: r.fechaFin,
          precioTotal: r.precioTotal,
          estado: r.estado,
        }));
      } else if (tipo === 'vehiculos') {
        data = data.map((v: any) => ({
          id: v.id,
          marca: v.marca,
          modelo: v.modelo,
          anio: v.anio,
          precio: v.precioDia,
          disponible: v.disponible,
          vecesRentado: v.vecesRentado || 0,
        }));
      }

      const filename = `reporte_${tipo}_${new Date().toISOString().split('T')[0]}`;

      if (formato === 'excel') {
        await exportarExcel(data, filename);
      } else {
        exportarPDF(data, filename);
      }

      showToast('Reporte exportado exitosamente', 'success');
    } catch (error) {
      showToast('Error al exportar reporte', 'error');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Exportar Reporte de {tipo}</h3>
      
      <div className={styles.formatSelector}>
        <button
          className={`${styles.formatButton} ${formato === 'excel' ? styles.active : ''}`}
          onClick={() => setFormato('excel')}
        >
          📊 Excel
        </button>
        <button
          className={`${styles.formatButton} ${formato === 'pdf' ? styles.active : ''}`}
          onClick={() => setFormato('pdf')}
        >
          📄 PDF
        </button>
      </div>

      <button
        onClick={handleExport}
        disabled={isExporting}
        className={styles.exportButton}
      >
        {isExporting ? 'Exportando...' : `Exportar como ${formato.toUpperCase()}`}
      </button>
    </div>
  );
}
