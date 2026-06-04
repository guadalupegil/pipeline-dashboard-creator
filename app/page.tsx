import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getCandidates } from '@/app/actions/candidates'
import { Dashboard } from '@/components/dashboard'

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  const candidates = await getCandidates()

  return (
    <Dashboard
      candidates={candidates}
      userName={session.user.name || session.user.email}
    />
  )
}
