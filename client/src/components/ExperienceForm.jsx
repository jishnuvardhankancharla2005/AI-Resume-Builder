import { Briefcase, Plus, Sparkles, Trash2, LoaderCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ExperienceForm = ({ data = [], onChange }) => {
  const [loadingIndex, setLoadingIndex] = useState(null)

  const handleAiEnhance = async (index, description) => {
    if (!description?.trim()) {
      toast.error('Please write a basic job description first for the AI to enhance.');
      return;
    }

    setLoadingIndex(index);
    try {
      const response = await api.post('/api/resumes/ai-enhance', { text: description, section: 'experience' });
      if (response.data.text) {
        updateExperience(index, "description", response.data.text);
        toast.success('Job description enhanced successfully!');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to enhance job description');
    } finally {
      setLoadingIndex(null);
    }
  }

  const addExperience = () => {
    onChange([
      ...data,
      {
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: "",
        is_current: false
      }
    ])
  }

  const removeExperience = (index) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateExperience = (index, field, value) => {
    const updated = data.map((item, i) => {
      if (i !== index) return item

      // if current job → clear end_date
      if (field === "is_current" && value === true) {
        return { ...item, is_current: true, end_date: "" }
      }

      return { ...item, [field]: value }
    })

    onChange(updated)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Professional Experience</h3>
          <p className="text-sm text-gray-500">Add your job experience</p>
        </div>

        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
        >
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((experience, index) => (
            <div
              key={experience._id || index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Experience #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={experience.company ?? ""}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  placeholder="Company name"
                  className="px-3 py-2 text-sm rounded-lg border"
                />

                <input
                  value={experience.position ?? ""}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                  placeholder="Job title"
                  className="px-3 py-2 text-sm rounded-lg border"
                />

                <input
                  type="month"
                  value={experience.start_date ?? ""}
                  onChange={(e) =>
                    updateExperience(index, "start_date", e.target.value)
                  }
                  className="px-3 py-2 text-sm rounded-lg border"
                />

                <input
                  type="month"
                  value={experience.end_date ?? ""}
                  disabled={experience.is_current}
                  onChange={(e) =>
                    updateExperience(index, "end_date", e.target.value)
                  }
                  className="px-3 py-2 text-sm rounded-lg border disabled:bg-gray-100"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={experience.is_current || false}
                  onChange={(e) =>
                    updateExperience(index, "is_current", e.target.checked)
                  }
                />
                <span className="text-sm text-gray-700">
                  Currently working here
                </span>
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Job Description
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAiEnhance(index, experience.description)}
                    disabled={loadingIndex === index}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 disabled:opacity-50"
                  >
                    {loadingIndex === index ? <LoaderCircleIcon className="animate-spin w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    {loadingIndex === index ? 'Enhancing...' : 'Enhance with AI'}
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={experience.description ?? ""}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  className="w-full text-sm px-3 py-2 rounded-lg border resize-none"
                  placeholder="Describe your responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExperienceForm
