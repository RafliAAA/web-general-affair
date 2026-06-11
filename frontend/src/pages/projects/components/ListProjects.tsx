import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Projects, ProjectStatus } from "@/types/inventory";
import { useState } from "react";

interface Props {
  projectList: Projects[];
  onStatusChange: (projectId: string, newStatus: ProjectStatus) => void;
}

const ListProjects = ({ projectList, onStatusChange }: Props) => {
  const [selectedProject, setSelectedProject] = useState<Projects | null>(null);

  return (
    <Card className="flex flex-col gap-6 p-6 w-full h-auto">
      {/* Header */}
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-bold text-2xl">Daftar Project</h1>
        <Button variant="default">
          <Plus className="h-4 w-4 mr-2" /> Tambah Project
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table className="p-6">
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectList.map((project) => (
              <TableRow key={project.id}>
                {/* Project */}
                <TableCell>
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {project.description}
                    </p>
                  </div>
                </TableCell>

                {/* Timeline */}
                <TableCell>
                  <div className="text-sm">
                    {project.startDate.toLocaleDateString()} -{" "}
                    {project.endDate.toLocaleDateString()}
                  </div>
                </TableCell>

                {/* Priority */}
                <TableCell>
                  <Badge
                    variant={
                      project.priority === "high"
                        ? "destructive"
                        : project.priority === "medium"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {project.priority}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge
                    variant={
                      project.status === "in-progress"
                        ? "secondary"
                        : project.status === "completed"
                          ? "success"
                          : project.status === "cancelled"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {project.status}
                  </Badge>
                </TableCell>

                {/* Aksi */}
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProject(project)}
                  >
                    Detail / Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {projectList.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Tidak ada project ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Edit */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-100">
            <h2 className="text-lg font-bold mb-4">
              Edit Project: {selectedProject.name}
            </h2>

            <label className="block mb-2 text-sm font-medium">Status</label>
            <select
              value={selectedProject.status}
              onChange={(e) =>
                onStatusChange(
                  selectedProject.id,
                  e.target.value as ProjectStatus,
                )
              }
              className="w-full h-10 rounded border border-gray-300 bg-white text-sm px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedProject(null)}
              >
                Batal
              </Button>
              <Button
                variant="default"
                onClick={() => setSelectedProject(null)}
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ListProjects;
