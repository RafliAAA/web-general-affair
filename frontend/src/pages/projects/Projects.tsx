import DashboardLayout from '@/components/layout/DashboardLayout'
import { StatCard } from '@/components/dashboard/StatCard'
import { projects as initialProjects } from '@/data/mockData'
import { Package } from 'lucide-react'
import ListProjects from './components/ListProjects'
import { useState } from 'react'
import type { Projects, ProjectStatus } from '@/types/inventory'

function Projects() {
  const [projectList, setProjectList] = useState<Projects[]>(initialProjects)

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    setProjectList(
      projectList.map((p) =>
        p.id === projectId ? { ...p, status: newStatus } : p
      )
    )
  }

  return (
    <DashboardLayout title="Projects">
      {/* Stat Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Project"
          value={projectList.length}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="In Progress"
          value={projectList.filter(p => p.status === 'in-progress').length}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="Completed"
          value={projectList.filter(p => p.status === 'completed').length}
          icon={Package}
          variant="primary"
        />
        <StatCard
          title="Cancelled"
          value={projectList.filter(p => p.status === 'cancelled').length}
          icon={Package}
          variant="primary"
        />
      </div>

      {/* Table */}
      <ListProjects
        projectList={projectList}
        onStatusChange={handleStatusChange}
      />
    </DashboardLayout>
  )
}

export default Projects
