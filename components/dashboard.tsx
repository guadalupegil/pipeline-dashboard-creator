'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CandidateForm } from '@/components/candidate-form'
import { CandidatesTable } from '@/components/candidates-table'
import { PipelineCharts } from '@/components/pipeline-charts'
import { ExportPdfButton } from '@/components/export-pdf-button'
import { CSVImport } from '@/components/csv-import'

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

export function Dashboard({
  candidates,
  userName,
}: {
  candidates: Candidate[]
  userName: string
}) {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  // Calculate stats
  const totalCandidates = candidates.length
  const hired = candidates.filter((c) => c.status === 'Hired').length
  const rejected = candidates.filter((c) => c.status === 'Rejected').length
  const inProgress = candidates.filter(
    (c) => !['Hired', 'Rejected', 'Dropped'].includes(c.status || '')
  ).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              HR Pipeline Tracker
            </h1>
            <p className="text-sm text-muted-foreground">Welcome, {userName}</p>
          </div>
          <div className="flex items-center gap-3">
            <ExportPdfButton candidates={candidates} />
            <CSVImport onSuccess={() => router.refresh()} />
            <CandidateForm onSuccess={() => router.refresh()} />
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {totalCandidates}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{inProgress}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hired
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{hired}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rejected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">{rejected}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Charts and Table */}
        <Tabs defaultValue="charts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="charts">Charts & Analytics</TabsTrigger>
            <TabsTrigger value="candidates">Candidates List</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-4">
            {candidates.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No data to display. Add candidates to see pipeline analytics.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <PipelineCharts candidates={candidates} />
            )}
          </TabsContent>

          <TabsContent value="candidates">
            <CandidatesTable candidates={candidates} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
