'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Sankey,
  Layer,
  Rectangle,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Candidate = {
  id: number
  role: string | null
  candidateName: string | null
  location: string | null
  status: string | null
  [key: string]: unknown
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57']

const STATUS_COLORS: Record<string, string> = {
  'Screening': '#3b82f6',
  'Pre-screening': '#6366f1',
  'Submitted to HM': '#8b5cf6',
  '1st Technical Interview': '#a855f7',
  '2nd Technical Interview': '#d946ef',
  '3rd Technical Interview': '#ec4899',
  'Leadership Round': '#f43f5e',
  'Offer Negotiation': '#f97316',
  'Hired': '#22c55e',
  'Dropped': '#64748b',
  'Rejected': '#ef4444',
}

export function PipelineCharts({ candidates }: { candidates: Candidate[] }) {
  // Status distribution
  const statusData = candidates.reduce((acc, c) => {
    const status = c.status || 'Unknown'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statusChartData = Object.entries(statusData).map(([name, value]) => ({
    name,
    value,
    fill: STATUS_COLORS[name] || '#64748b',
  }))

  // Role distribution
  const roleData = candidates.reduce((acc, c) => {
    const role = c.role || 'Unknown'
    acc[role] = (acc[role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const roleChartData = Object.entries(roleData).map(([name, value]) => ({
    name: name.length > 20 ? name.substring(0, 20) + '...' : name,
    fullName: name,
    value,
  }))

  // Location distribution
  const locationData = candidates.reduce((acc, c) => {
    const location = c.location || 'Unknown'
    acc[location] = (acc[location] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const locationChartData = Object.entries(locationData).map(([name, value]) => ({
    name,
    value,
  }))

  // Pipeline funnel data
  const funnelStages = [
    { stage: 'Screening', count: 0 },
    { stage: 'Submitted to HM', count: 0 },
    { stage: '1st Interview', count: 0 },
    { stage: '2nd Interview', count: 0 },
    { stage: '3rd Interview', count: 0 },
    { stage: 'Leadership', count: 0 },
    { stage: 'Offer', count: 0 },
    { stage: 'Hired', count: 0 },
  ]

  candidates.forEach((c) => {
    const status = c.status || ''
    if (status.includes('Screening') || status.includes('Pre-screening')) funnelStages[0].count++
    if (status.includes('Submitted')) funnelStages[1].count++
    if (status.includes('1st')) funnelStages[2].count++
    if (status.includes('2nd')) funnelStages[3].count++
    if (status.includes('3rd')) funnelStages[4].count++
    if (status.includes('Leadership')) funnelStages[5].count++
    if (status.includes('Offer')) funnelStages[6].count++
    if (status === 'Hired') funnelStages[7].count++
  })

  // Hired vs Rejected vs Dropped
  const outcomeData = [
    { name: 'Hired', value: candidates.filter(c => c.status === 'Hired').length, fill: '#22c55e' },
    { name: 'Rejected', value: candidates.filter(c => c.status === 'Rejected').length, fill: '#ef4444' },
    { name: 'Dropped', value: candidates.filter(c => c.status === 'Dropped').length, fill: '#64748b' },
    { name: 'In Progress', value: candidates.filter(c => !['Hired', 'Rejected', 'Dropped'].includes(c.status || '')).length, fill: '#3b82f6' },
  ].filter(d => d.value > 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="charts-container">
      {/* Status Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pipeline Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Role Distribution Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Candidates by Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value, name, props) => [value, props.payload.fullName]} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Location Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Candidates by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={locationChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {locationChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pipeline Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelStages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Outcome Distribution */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Candidate Outcomes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
