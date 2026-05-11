import React, { useEffect, useMemo } from 'react'
import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react'

const PersonalinfoForm = ({ data = {}, onChange, removeBackground, setRemoveBackground }) => {

  const previewUrl = useMemo(() => {
    if (data.image && typeof data.image === 'object') {
      return URL.createObjectURL(data.image)
    }
    return null
  }, [data.image])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value })
  }

  const fields = [
    { key: "full_name", label: "Full Name", icon: User, type: "text", required: true },
    { key: "email", label: "Email Address", icon: Mail, type: "email", required: true },
    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
    { key: "location", label: "Location", icon: MapPin, type: "text" },
    { key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text" },
    { key: "linkedin", label: "LinkedIn Profile", icon: Linkedin, type: "url" },
    { key: "website", label: "Personal Website", icon: Globe, type: "url" },
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        Personal Information
      </h3>
      <p className="text-sm text-gray-600">
        Get Started with the personal information
      </p>

      <div className="flex items-center gap-4 mt-4">
        <label className="cursor-pointer">
          {previewUrl || (typeof data.image === 'string' && data.image) ? (
            <img
              src={previewUrl || data.image}
              alt="user-image"
              className="w-16 h-16 rounded-full object-cover mt-2 ring-slate-300 hover:opacity-80"
            />
          ) : (
            <div className="inline-flex items-center gap-2 mt-2 text-slate-600 hover:text-slate-700">
              <User className="w-10 h-10 p-2.5 border rounded-full" />
              Upload user image
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={(e) => handleChange("image", e.target.files[0])}
          />
        </label>

        {typeof data.image === 'object' && (
          <div className="flex flex-col gap-1 pl-4 text-sm">
            <p>Remove Background</p>
            <label className="relative inline-flex items-center cursor-pointer gap-3">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={removeBackground}
                onChange={() => setRemoveBackground(prev => !prev)}
              />
              <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-600 transition-colors duration-200" />
              <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-4" />
            </label>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-5">
        {fields.map(field => {
          const Icon = field.icon
          return (
            <div key={field.key} className="space-y-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <Icon className="w-4 h-4" />
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                value={data[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors"
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                required={field.required}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PersonalinfoForm
