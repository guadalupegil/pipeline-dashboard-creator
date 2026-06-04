'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { candidates } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export type CandidateInput = {
  role: string
  candidateName: string
  location?: string
  status: string
  preScreeningDate?: string
  preScreeningStatus?: string
  submissionDate?: string
  feedbackReviewDate?: string
  feedbackReviewStatus?: string
  firstInterviewDate?: string
  firstInterviewer?: string
  firstRoundStatus?: string
  secondInterviewDate?: string
  secondInterviewer?: string
  secondRoundStatus?: string
  thirdInterviewDate?: string
  thirdInterviewer?: string
  thirdRoundStatus?: string
  leadershipRoundDate?: string
  leadershipRoundInterviewer?: string
  leadershipRoundStatus?: string
  leadershipRound2Date?: string
  leadershipRound2Interviewer?: string
  leadershipRound2Status?: string
  offerConfirmationDate?: string
  offerDate?: string
  timeToFill?: string
  joiningDate?: string
  threeMonthPeriod?: string
  currentCTC?: string
  expectedCTC?: string
  noticePeriod?: string
  remarks?: string
}

export async function getCandidates() {
  const userId = await getUserId()
  return db
    .select()
    .from(candidates)
    .where(eq(candidates.userId, userId))
    .orderBy(desc(candidates.createdAt))
}

export async function addCandidate(input: CandidateInput) {
  const userId = await getUserId()
  await db.insert(candidates).values({
    userId,
    role: input.role,
    candidateName: input.candidateName,
    location: input.location || null,
    status: input.status,
    preScreeningDate: input.preScreeningDate || null,
    preScreeningStatus: input.preScreeningStatus || null,
    submissionDate: input.submissionDate || null,
    feedbackReviewDate: input.feedbackReviewDate || null,
    feedbackReviewStatus: input.feedbackReviewStatus || null,
    firstInterviewDate: input.firstInterviewDate || null,
    firstInterviewer: input.firstInterviewer || null,
    firstRoundStatus: input.firstRoundStatus || null,
    secondInterviewDate: input.secondInterviewDate || null,
    secondInterviewer: input.secondInterviewer || null,
    secondRoundStatus: input.secondRoundStatus || null,
    thirdInterviewDate: input.thirdInterviewDate || null,
    thirdInterviewer: input.thirdInterviewer || null,
    thirdRoundStatus: input.thirdRoundStatus || null,
    leadershipRoundDate: input.leadershipRoundDate || null,
    leadershipRoundInterviewer: input.leadershipRoundInterviewer || null,
    leadershipRoundStatus: input.leadershipRoundStatus || null,
    leadershipRound2Date: input.leadershipRound2Date || null,
    leadershipRound2Interviewer: input.leadershipRound2Interviewer || null,
    leadershipRound2Status: input.leadershipRound2Status || null,
    offerConfirmationDate: input.offerConfirmationDate || null,
    offerDate: input.offerDate || null,
    timeToFill: input.timeToFill || null,
    joiningDate: input.joiningDate || null,
    threeMonthPeriod: input.threeMonthPeriod || null,
    currentCTC: input.currentCTC || null,
    expectedCTC: input.expectedCTC || null,
    noticePeriod: input.noticePeriod || null,
    remarks: input.remarks || null,
  })
  revalidatePath('/')
}

export async function updateCandidate(id: number, input: Partial<CandidateInput>) {
  const userId = await getUserId()
  await db
    .update(candidates)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(and(eq(candidates.id, id), eq(candidates.userId, userId)))
  revalidatePath('/')
}

export async function deleteCandidate(id: number) {
  const userId = await getUserId()
  await db.delete(candidates).where(and(eq(candidates.id, id), eq(candidates.userId, userId)))
  revalidatePath('/')
}

export async function importCandidatesFromCSV(
  candidatesData: CandidateInput[]
): Promise<{ success: number; errors: string[] }> {
  const userId = await getUserId()
  const errors: string[] = []
  let successCount = 0

  for (let i = 0; i < candidatesData.length; i++) {
    const input = candidatesData[i]
    try {
      if (!input.candidateName || !input.role) {
        errors.push(`Row ${i + 1}: Missing required fields (name or role)`)
        continue
      }

      await db.insert(candidates).values({
        userId,
        role: input.role,
        candidateName: input.candidateName,
        location: input.location || null,
        status: input.status || 'Screening',
        preScreeningDate: input.preScreeningDate || null,
        preScreeningStatus: input.preScreeningStatus || null,
        submissionDate: input.submissionDate || null,
        feedbackReviewDate: input.feedbackReviewDate || null,
        feedbackReviewStatus: input.feedbackReviewStatus || null,
        firstInterviewDate: input.firstInterviewDate || null,
        firstInterviewer: input.firstInterviewer || null,
        firstRoundStatus: input.firstRoundStatus || null,
        secondInterviewDate: input.secondInterviewDate || null,
        secondInterviewer: input.secondInterviewer || null,
        secondRoundStatus: input.secondRoundStatus || null,
        thirdInterviewDate: input.thirdInterviewDate || null,
        thirdInterviewer: input.thirdInterviewer || null,
        thirdRoundStatus: input.thirdRoundStatus || null,
        leadershipRoundDate: input.leadershipRoundDate || null,
        leadershipRoundInterviewer: input.leadershipRoundInterviewer || null,
        leadershipRoundStatus: input.leadershipRoundStatus || null,
        leadershipRound2Date: input.leadershipRound2Date || null,
        leadershipRound2Interviewer: input.leadershipRound2Interviewer || null,
        leadershipRound2Status: input.leadershipRound2Status || null,
        offerConfirmationDate: input.offerConfirmationDate || null,
        offerDate: input.offerDate || null,
        timeToFill: input.timeToFill || null,
        joiningDate: input.joiningDate || null,
        threeMonthPeriod: input.threeMonthPeriod || null,
        currentCTC: input.currentCTC || null,
        expectedCTC: input.expectedCTC || null,
        noticePeriod: input.noticePeriod || null,
        remarks: input.remarks || null,
      })
      successCount++
    } catch (error) {
      errors.push(`Row ${i + 1} (${input.candidateName}): ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  revalidatePath('/')
  return { success: successCount, errors }
}
