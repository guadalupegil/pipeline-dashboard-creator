'use client'

import { Button } from '@/components/ui/button'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'

type Candidate = {
  id: number
  role: string | null
  candidateName: string | null
  location: string | null
  status: string | null
  [key: string]: unknown
}

export function ExportPdfButton({ candidates }: { candidates: Candidate[] }) {
  const exportToPdf = async () => {
    const pdf = new jsPDF('landscape', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    
    // Title
    pdf.setFontSize(20)
    pdf.setTextColor(0, 0, 0)
    pdf.text('HR Pipeline Report', pageWidth / 2, 15, { align: 'center' })
    
    // Date
    pdf.setFontSize(10)
    pdf.setTextColor(100, 100, 100)
    pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, pageWidth / 2, 22, { align: 'center' })

    // Summary Statistics
    pdf.setFontSize(14)
    pdf.setTextColor(0, 0, 0)
    pdf.text('Summary Statistics', 14, 35)

    const totalCandidates = candidates.length
    const hired = candidates.filter(c => c.status === 'Hired').length
    const rejected = candidates.filter(c => c.status === 'Rejected').length
    const dropped = candidates.filter(c => c.status === 'Dropped').length
    const inProgress = totalCandidates - hired - rejected - dropped

    const summaryData = [
      ['Total Candidates', totalCandidates.toString()],
      ['Hired', hired.toString()],
      ['Rejected', rejected.toString()],
      ['Dropped', dropped.toString()],
      ['In Progress', inProgress.toString()],
    ]

    autoTable(pdf, {
      startY: 40,
      head: [['Metric', 'Count']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14 },
      tableWidth: 80,
    })

    // By Role breakdown
    const roleData = candidates.reduce((acc, c) => {
      const role = c.role || 'Unknown'
      acc[role] = (acc[role] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const roleTableData = Object.entries(roleData).map(([role, count]) => [role, count.toString()])

    autoTable(pdf, {
      startY: 40,
      head: [['Role', 'Count']],
      body: roleTableData,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] },
      margin: { left: 110 },
      tableWidth: 'auto',
    })

    // By Status breakdown
    const statusData = candidates.reduce((acc, c) => {
      const status = c.status || 'Unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const statusTableData = Object.entries(statusData).map(([status, count]) => [status, count.toString()])

    autoTable(pdf, {
      startY: 40,
      head: [['Status', 'Count']],
      body: statusTableData,
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 200 },
      tableWidth: 'auto',
    })

    // Add a new page for charts
    pdf.addPage()
    pdf.setFontSize(14)
    pdf.text('Pipeline Charts', 14, 15)

    // Capture charts as image
    const chartsContainer = document.getElementById('charts-container')
    if (chartsContainer) {
      try {
        const canvas = await html2canvas(chartsContainer, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        })
        const imgData = canvas.toDataURL('image/png')
        const imgWidth = pageWidth - 28
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        pdf.addImage(imgData, 'PNG', 14, 25, imgWidth, Math.min(imgHeight, 170))
      } catch (error) {
        console.error('Failed to capture charts:', error)
      }
    }

    // Add a new page for candidate list
    pdf.addPage()
    pdf.setFontSize(14)
    pdf.text('Candidate List', 14, 15)

    const tableData = candidates.map(c => [
      c.candidateName || '-',
      (c.role || '-').substring(0, 30),
      c.location || '-',
      c.status || '-',
    ])

    autoTable(pdf, {
      startY: 25,
      head: [['Candidate', 'Role', 'Location', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 80 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
      },
    })

    pdf.save('hr-pipeline-report.pdf')
  }

  return (
    <Button onClick={exportToPdf} variant="outline">
      Export to PDF
    </Button>
  )
}
