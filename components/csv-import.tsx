'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { importCandidatesFromCSV } from '@/app/actions/candidates'
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'

export function CSVImport({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: number; errors: string[] } | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length < 2) return []

    // Parse header row
    const headers = parseCSVLine(lines[0])
    
    // Parse data rows
    const data: Record<string, string>[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      const row: Record<string, string> = {}
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || ''
      })
      data.push(row)
    }
    return data
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    result.push(current)
    return result
  }

  const mapCSVToCandidate = (row: Record<string, string>) => {
    return {
      role: row['Roles'] || '',
      candidateName: row["Candidate's Name"] || '',
      location: row['Location']?.trim() || '',
      status: row[' Status']?.trim() || row['Status']?.trim() || '',
      preScreeningDate: formatDate(row['Pre-screening date']),
      preScreeningStatus: row['Pre-screening status'] || '',
      submissionDate: formatDate(row['Submission Date']),
      feedbackReviewDate: formatDate(row['Feedback/review Date']),
      feedbackReviewStatus: row['Feedback/review Status'] || '',
      firstInterviewDate: formatDate(row['1st interview date']),
      firstInterviewer: row['1st interviewer'] || '',
      firstRoundStatus: row['1st round status'] || '',
      secondInterviewDate: formatDate(row['2nd interview date']),
      secondInterviewer: row['2nd interviewer'] || '',
      secondRoundStatus: row['2nd round status'] || '',
      thirdInterviewDate: formatDate(row['3rd interview date']),
      thirdInterviewer: row['3rd interviewer'] || '',
      thirdRoundStatus: row['3rd round status'] || '',
      leadershipRoundDate: formatDate(row['Leadership Round Interview Date']),
      leadershipRoundInterviewer: row['Leadership Round Interviewer'] || '',
      leadershipRoundStatus: row['Leadership Round Interview Status'] || '',
      leadershipRound2Date: formatDate(row['Leadership Round Interview Date 2']),
      leadershipRound2Interviewer: row['Leadership Round 2 Interviewer '] || '',
      leadershipRound2Status: row['Leadership Round 2 Interview Status'] || '',
      offerConfirmationDate: formatDate(row['Update/confirmation of offer - Date']),
      offerDate: formatDate(row['Offer Date']),
      timeToFill: row['Time to Fill'] || '',
      joiningDate: formatDate(row['Joining Date']),
      threeMonthPeriod: row['3 month Period'] || '',
      currentCTC: row['Current CTC'] || '',
      expectedCTC: row['Expected CTC'] || '',
      noticePeriod: row['Notice Period'] || '',
      remarks: row['Remarks'] || '',
    }
  }

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr || dateStr.trim() === '') return ''
    
    // Try to parse MM/DD/YYYY format
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      const month = parts[0].padStart(2, '0')
      const day = parts[1].padStart(2, '0')
      const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2]
      return `${year}-${month}-${day}`
    }
    return dateStr
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setLoading(true)
    setResult(null)

    try {
      const text = await file.text()
      const rows = parseCSV(text)
      
      const candidates = rows
        .map(mapCSVToCandidate)
        .filter(c => c.candidateName && c.role) // Filter out empty rows

      if (candidates.length === 0) {
        setResult({ success: 0, errors: ['No valid candidates found in CSV'] })
        setLoading(false)
        return
      }

      const importResult = await importCandidatesFromCSV(candidates)
      setResult(importResult)
      
      if (importResult.success > 0) {
        onSuccess()
      }
    } catch (error) {
      setResult({ 
        success: 0, 
        errors: [error instanceof Error ? error.message : 'Failed to parse CSV'] 
      })
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleReset = () => {
    setResult(null)
    setFileName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) handleReset()
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Candidates from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with your candidate data. The file should match the WTI Database format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!result ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="rounded-full bg-muted p-4">
                <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {fileName ? `Selected: ${fileName}` : 'Select a CSV file to import'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Expected columns: Roles, Candidate&apos;s Name, Location, Status, etc.
                </p>
              </div>

              <label className="cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
                <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2">
                  {loading ? 'Importing...' : 'Choose File'}
                </div>
              </label>
            </div>
          ) : (
            <div className="py-4">
              {result.success > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Successfully imported {result.success} candidate{result.success !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              )}

              {result.errors.length > 0 && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800 dark:text-red-200 mb-1">
                      {result.errors.length} error{result.errors.length !== 1 ? 's' : ''}
                    </p>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                      {result.errors.slice(0, 5).map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                      {result.errors.length > 5 && (
                        <li>...and {result.errors.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleReset}>
                  Import Another
                </Button>
                <Button onClick={() => setOpen(false)}>
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
