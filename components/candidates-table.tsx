'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteCandidate } from '@/app/actions/candidates'
import { useState } from 'react'

type Candidate = {
  id: number
  role: string | null
  candidateName: string | null
  location: string | null
  status: string | null
  preScreeningDate: string | null
  firstInterviewDate: string | null
  secondInterviewDate: string | null
  offerDate: string | null
  joiningDate: string | null
  remarks: string | null
  [key: string]: unknown
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  'Hired': 'default',
  'Rejected': 'destructive',
  'Dropped': 'secondary',
  'Screening': 'outline',
  'Pre-screening': 'outline',
}

export function CandidatesTable({ candidates }: { candidates: Candidate[] }) {
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      setDeletingId(id)
      await deleteCandidate(id)
      setDeletingId(null)
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusVariant = (status: string | null): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (!status) return 'outline'
    return STATUS_VARIANTS[status] || 'outline'
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pre-Screening</TableHead>
            <TableHead>1st Interview</TableHead>
            <TableHead>2nd Interview</TableHead>
            <TableHead>Offer Date</TableHead>
            <TableHead>Joining Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                No candidates yet. Add your first candidate to get started.
              </TableCell>
            </TableRow>
          ) : (
            candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell className="font-medium">{candidate.candidateName || '-'}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={candidate.role || ''}>
                  {candidate.role || '-'}
                </TableCell>
                <TableCell>{candidate.location || '-'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(candidate.status)}>
                    {candidate.status || 'Unknown'}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(candidate.preScreeningDate)}</TableCell>
                <TableCell>{formatDate(candidate.firstInterviewDate)}</TableCell>
                <TableCell>{formatDate(candidate.secondInterviewDate)}</TableCell>
                <TableCell>{formatDate(candidate.offerDate)}</TableCell>
                <TableCell>{formatDate(candidate.joiningDate)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(candidate.id)}
                    disabled={deletingId === candidate.id}
                  >
                    {deletingId === candidate.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
