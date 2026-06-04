'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { addCandidate, type CandidateInput } from '@/app/actions/candidates'

const ROLES = [
  'Senior Telephony Engineer AVAYA',
  'CISCO Solutions Architect',
  'CISCO Service Engineer Tier3',
  'Senior Tech Support Engineer Service Desk',
  'Associate Service Supervisor',
]

const LOCATIONS = ['PHL', 'PK', 'IN', 'UAE']

const STATUSES = [
  'Screening',
  'Pre-screening',
  'Submitted to HM',
  '1st Technical Interview',
  '2nd Technical Interview',
  '3rd Technical Interview',
  'Leadership Round',
  'Offer Negotiation',
  'Hired',
  'Dropped',
  'Rejected',
]

export function CandidateForm({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const input: CandidateInput = {
      role: formData.get('role') as string,
      candidateName: formData.get('candidateName') as string,
      location: formData.get('location') as string,
      status: formData.get('status') as string,
      preScreeningDate: formData.get('preScreeningDate') as string || undefined,
      preScreeningStatus: formData.get('preScreeningStatus') as string || undefined,
      submissionDate: formData.get('submissionDate') as string || undefined,
      feedbackReviewDate: formData.get('feedbackReviewDate') as string || undefined,
      feedbackReviewStatus: formData.get('feedbackReviewStatus') as string || undefined,
      firstInterviewDate: formData.get('firstInterviewDate') as string || undefined,
      firstInterviewer: formData.get('firstInterviewer') as string || undefined,
      firstRoundStatus: formData.get('firstRoundStatus') as string || undefined,
      secondInterviewDate: formData.get('secondInterviewDate') as string || undefined,
      secondInterviewer: formData.get('secondInterviewer') as string || undefined,
      secondRoundStatus: formData.get('secondRoundStatus') as string || undefined,
      thirdInterviewDate: formData.get('thirdInterviewDate') as string || undefined,
      thirdInterviewer: formData.get('thirdInterviewer') as string || undefined,
      thirdRoundStatus: formData.get('thirdRoundStatus') as string || undefined,
      leadershipRoundDate: formData.get('leadershipRoundDate') as string || undefined,
      leadershipRoundInterviewer: formData.get('leadershipRoundInterviewer') as string || undefined,
      leadershipRoundStatus: formData.get('leadershipRoundStatus') as string || undefined,
      offerDate: formData.get('offerDate') as string || undefined,
      joiningDate: formData.get('joiningDate') as string || undefined,
      currentCTC: formData.get('currentCTC') as string || undefined,
      expectedCTC: formData.get('expectedCTC') as string || undefined,
      noticePeriod: formData.get('noticePeriod') as string || undefined,
      remarks: formData.get('remarks') as string || undefined,
    }

    await addCandidate(input)
    setLoading(false)
    setOpen(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Candidate</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Candidate</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-100px)] pr-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="candidateName">Candidate Name *</Label>
                <Input id="candidateName" name="candidateName" required />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Role *</Label>
                <Select name="role" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location</Label>
                <Select name="location">
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATIONS.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select name="status" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Pre-Screening */}
            <h3 className="font-medium text-sm text-muted-foreground mt-2">Pre-Screening</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="preScreeningDate">Pre-Screening Date</Label>
                <Input id="preScreeningDate" name="preScreeningDate" type="date" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="preScreeningStatus">Pre-Screening Status</Label>
                <Input id="preScreeningStatus" name="preScreeningStatus" placeholder="e.g., Cleared, Pending" />
              </div>
            </div>

            {/* Submission */}
            <h3 className="font-medium text-sm text-muted-foreground mt-2">Submission</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="submissionDate">Submission Date</Label>
                <Input id="submissionDate" name="submissionDate" type="date" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="feedbackReviewDate">Feedback Review Date</Label>
                <Input id="feedbackReviewDate" name="feedbackReviewDate" type="date" />
              </div>
            </div>

            {/* First Interview */}
            <h3 className="font-medium text-sm text-muted-foreground mt-2">1st Technical Interview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstInterviewDate">Date</Label>
                <Input id="firstInterviewDate" name="firstInterviewDate" type="date" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstInterviewer">Interviewer</Label>
                <Input id="firstInterviewer" name="firstInterviewer" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="firstRoundStatus">Status</Label>
                <Input id="firstRoundStatus" name="firstRoundStatus" placeholder="e.g., Passed, Failed" />
              </div>
            </div>

            {/* Second Interview */}
            <h3 className="font-medium text-sm text-muted-foreground mt-2">2nd Technical Interview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="secondInterviewDate">Date</Label>
                <Input id="secondInterviewDate" name="secondInterviewDate" type="date" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="secondInterviewer">Interviewer</Label>
                <Input id="secondInterviewer" name="secondInterviewer" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="secondRoundStatus">Status</Label>
                <Input id="secondRoundStatus" name="secondRoundStatus" placeholder="e.g., Passed, Failed" />
              </div>
            </div>

            {/* Third Interview */}
            <h3 className="font-medium text-sm text-muted-foreground mt-2">3rd Technical Interview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="thirdInterviewDate">Date</Label>
                <Input id="thirdInterviewDate" name="thirdInterviewDate" type="date" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="thirdInterviewer">Interviewer</Label>
                <Input id="thirdInterviewer" name="thirdInterviewer" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="thirdRoundStatus">Status</Label>
                <Input id="thirdRoundStatus" name="thirdRoundStatus" placeholder="e.g., Passed, Failed" />
              </div>
            </div>

            {/* Leadership Round */}
            <h3 className="font-medium text-sm text-muted-foreground mt-2">Leadership Round</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="leadershipRoundDate">Date</Label>
                <Input id="leadershipRoundDate" name="leadershipRoundDate" type="date" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="leadershipRoundInterviewer">Interviewer</Label>
                <Input id="leadershipRoundInterviewer" name="leadershipRoundInterviewer" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="leadershipRoundStatus">Status</Label>
                <Input id="leadershipRoundStatus" name="leadershipRoundStatus" placeholder="e.g., Passed, Failed" />
              </div>
            </div>

            {/* Offer Details */}
            <h3 className="font-medium text-sm text-muted-foreground mt-2">Offer Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="offerDate">Offer Date</Label>
                <Input id="offerDate" name="offerDate" type="date" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input id="joiningDate" name="joiningDate" type="date" />
              </div>
            </div>

            {/* Compensation */}
            <h3 className="font-medium text-sm text-muted-foreground mt-2">Compensation</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="currentCTC">Current CTC</Label>
                <Input id="currentCTC" name="currentCTC" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="expectedCTC">Expected CTC</Label>
                <Input id="expectedCTC" name="expectedCTC" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="noticePeriod">Notice Period</Label>
                <Input id="noticePeriod" name="noticePeriod" />
              </div>
            </div>

            {/* Remarks */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea id="remarks" name="remarks" rows={3} />
            </div>

            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? 'Adding...' : 'Add Candidate'}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
