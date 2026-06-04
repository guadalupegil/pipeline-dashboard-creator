import { pgTable, text, timestamp, boolean, serial, date } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables: HR Pipeline Candidates ------------------------------------

export const candidates = pgTable('candidates', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  role: text('role').notNull(),
  candidateName: text('candidateName').notNull(),
  location: text('location'),
  status: text('status').notNull(),
  preScreeningDate: date('preScreeningDate'),
  preScreeningStatus: text('preScreeningStatus'),
  submissionDate: date('submissionDate'),
  feedbackReviewDate: date('feedbackReviewDate'),
  feedbackReviewStatus: text('feedbackReviewStatus'),
  firstInterviewDate: date('firstInterviewDate'),
  firstInterviewer: text('firstInterviewer'),
  firstRoundStatus: text('firstRoundStatus'),
  secondInterviewDate: date('secondInterviewDate'),
  secondInterviewer: text('secondInterviewer'),
  secondRoundStatus: text('secondRoundStatus'),
  thirdInterviewDate: date('thirdInterviewDate'),
  thirdInterviewer: text('thirdInterviewer'),
  thirdRoundStatus: text('thirdRoundStatus'),
  leadershipRoundDate: date('leadershipRoundDate'),
  leadershipRoundInterviewer: text('leadershipRoundInterviewer'),
  leadershipRoundStatus: text('leadershipRoundStatus'),
  leadershipRound2Date: date('leadershipRound2Date'),
  leadershipRound2Interviewer: text('leadershipRound2Interviewer'),
  leadershipRound2Status: text('leadershipRound2Status'),
  offerConfirmationDate: date('offerConfirmationDate'),
  offerDate: date('offerDate'),
  timeToFill: text('timeToFill'),
  joiningDate: date('joiningDate'),
  threeMonthPeriod: text('threeMonthPeriod'),
  currentCTC: text('currentCTC'),
  expectedCTC: text('expectedCTC'),
  noticePeriod: text('noticePeriod'),
  remarks: text('remarks'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
