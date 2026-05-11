import React, { useState } from 'react'
import { Plus, Trash2, FolderKanban, Sparkles, LoaderCircleIcon } from 'lucide-react'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ProjectForm = ({ data = [], onChange }) => {
  const [loadingIndex, setLoadingIndex] = useState(null)

  const handleAiEnhance = async (index, description) => {
    if (!description?.trim()) {
      toast.error('Please write a basic project description first for the AI to enhance.');
      return;
    }

    setLoadingIndex(index);
    try {
      const response = await api.post('/api/resumes/ai-enhance', { text: description, section: 'project' });
      if (response.data.text) {
        updateProject(index, "description", response.data.text);
        toast.success('Project description enhanced successfully!');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to enhance project description');
    } finally {
      setLoadingIndex(null);
    }
  }

  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: ""
    }
    onChange([...data, newProject])
  }

  const removeProject = (index) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateProject = (index, field, value) => {
    const updated = [...data]
    updated[index] = {
      ...updated[index],
      [field]: value
    }
    onChange(updated)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Projects</h3>
          <p className="text-sm text-gray-500">Add your projects</p>
        </div>

        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
        >
          <Plus className="size-4" />
          Add Project
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FolderKanban className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No projects added yet.</p>
        </div>
      )}

      {/* Project List */}
      <div className="space-y-4 mt-6">
        {data.map((project, index) => (
          <div
            key={project._id ?? index}
            className="p-4 border border-gray-200 rounded-lg space-y-3"
          >
            <div className="flex justify-between items-center">
              <h4>Project #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="grid gap-3">
              <input
                value={project.name || ""}
                onChange={(e) =>
                  updateProject(index, "name", e.target.value)
                }
                placeholder="Project name"
                className="px-3 py-2 text-sm rounded-lg border"
              />

              <input
                value={project.type || ""}
                onChange={(e) =>
                  updateProject(index, "type", e.target.value)
                }
                placeholder="Project type"
                className="px-3 py-2 text-sm rounded-lg border"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Project Description
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAiEnhance(index, project.description)}
                    disabled={loadingIndex === index}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
                  >
                    {loadingIndex === index ? <LoaderCircleIcon className="animate-spin w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    {loadingIndex === index ? 'Enhancing...' : 'Enhance with AI'}
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={project.description || ""}
                  onChange={(e) =>
                    updateProject(index, "description", e.target.value)
                  }
                  placeholder="Describe your project"
                  className="w-full px-3 py-2 text-sm rounded-lg resize-none border"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ProjectForm
