import { GraduationCap, Plus, Trash2 } from 'lucide-react'
import React from 'react'

const EducationForm = ({ data = [], onChange }) => {

  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: ""
    }
    onChange([...data, newEducation])
  }

  const removeEducation = (index) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateEducation = (index, field, value) => {
    const updated = data.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    )
    onChange(updated)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Education</h3>
          <p className="text-sm text-gray-500">Add your education details</p>
        </div>

        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
        >
          <Plus className="size-4" />
          Add Education
        </button>
      </div>

      {/* Empty State */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No education added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((education, index) => (
            <div
              key={education._id || index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-center">
                <h4>Education #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <input
                  value={education.institution ?? ""}
                  onChange={(e) =>
                    updateEducation(index, "institution", e.target.value)
                  }
                  placeholder="Institute name"
                  className="px-3 py-2 text-sm rounded-lg"
                />

                <input
                  value={education.degree ?? ""}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  placeholder="Degree"
                  className="px-3 py-2 text-sm rounded-lg"
                />

                <input
                  value={education.field ?? ""}
                  onChange={(e) =>
                    updateEducation(index, "field", e.target.value)
                  }
                  placeholder="Field of study"
                  className="px-3 py-2 text-sm rounded-lg"
                />

                <input
                  type="month"
                  value={education.graduation_date ?? ""}
                  onChange={(e) =>
                    updateEducation(index, "graduation_date", e.target.value)
                  }
                  className="px-3 py-2 text-sm rounded-lg"
                />
              </div>

              <input
                value={education.gpa ?? ""}
                onChange={(e) =>
                  updateEducation(index, "gpa", e.target.value)
                }
                placeholder="GPA (optional)"
                className="px-3 py-2 text-sm rounded-lg w-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EducationForm