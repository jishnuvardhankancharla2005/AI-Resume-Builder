import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  DownloadIcon,
  EyeIcon,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share2Icon,
  Sparkle,
  User,
  Target,
  LoaderCircleIcon,
  XIcon
} from 'lucide-react'

import toast from 'react-hot-toast'
import api from '../configs/api'

import PersonalinfoForm from '../components/PersonalinfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelcetor from '../components/TemplateSelcetor'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'

const ResumeBuilder = () => {
  const { resumeId } = useParams()

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: '',
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: 'classic',
    accent_color: '#3B82F6',
    public: false,
  })

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [loadingAts, setLoadingAts] = useState(false)
  const [atsResult, setAtsResult] = useState(null)
  const [showJobDescriptionModal, setShowJobDescriptionModal] = useState(false)
  const [jobDescription, setJobDescription] = useState('')

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Summary', icon: FileText },
    { id: 'experience', name: 'Experience', icon: Briefcase },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'projects', name: 'Projects', icon: FolderIcon },
    { id: 'skills', name: 'Skills', icon: Sparkle },
  ]

  const activeSection = sections[activeSectionIndex]

  // -------------------------
  // LOAD RESUME
  // -------------------------
  const loadResume = async () => {
    try {
      if (resumeId.startsWith('dummy-')) {
        const resume = dummyResumeData.find(r => r._id === resumeId)
        if (resume) setResumeData(resume)
      } else {
        const { data } = await api.get(`/api/resumes/${resumeId}`)
        if (data?.resume) {
          setResumeData({
            _id: data.resume._id || '',
            title: data.resume.title || '',
            personal_info: data.resume.personal_info || {},
            professional_summary: data.resume.professional_summary || '',
            experience: data.resume.experience || [],
            education: data.resume.education || [],
            project: data.resume.project || [],
            skills: data.resume.skills || [],
            template: data.resume.template || 'classic',
            accent_color: data.resume.accent_color || '#3B82F6',
            public: data.resume.public || false,
          })
        }
      }
    } catch {
      toast.error('Failed to load resume')
    }
  }

  useEffect(() => {
    if (!resumeId) {
      toast.error('Resume ID is missing')
      return
    }
    loadResume()
  }, [resumeId])

  useEffect(() => {
    if (resumeData.title) {
      document.title = resumeData.title
    }
  }, [resumeData.title])

  // -------------------------
  // VISIBILITY
  // -------------------------
  const changeResumeVisibility = async () => {
    const updated = !resumeData.public
    setResumeData(prev => ({ ...prev, public: updated }))

    if (resumeData._id.toString().startsWith('dummy-')) {
      toast.success('Visibility updated locally (dummy mode)')
      return;
    }

    try {
      const formData = new FormData()
      formData.append('resumeData', JSON.stringify({ public: updated }))
      await api.put(`/api/resumes/${resumeData._id}`, formData)
    } catch {
      toast.error('Failed to update visibility')
    }
  }

  // -------------------------
  // SHARE
  // -------------------------
  const handleShare = () => {
    if (!resumeData.public) {
      toast.error('Make your resume public before sharing.')
      return
    }

    const resumeUrl = `${window.location.origin}/view/${resumeData._id}`

    if (navigator.share) {
      navigator.share({
        title: 'My Resume',
        text: 'Check out my resume',
        url: resumeUrl
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(resumeUrl)
      toast.success('Link copied to clipboard!')
    }
  }

  const downloadResume = () => window.print()

  const saveChanges = async () => {
    if (!resumeData._id) {
      toast.error('Cannot save: Invalid Resume ID')
      return
    }
    if (resumeData._id.toString().startsWith('dummy-')) {
      toast.success('Resume saved locally (dummy mode)')
      return;
    }

    setLoadingSave(true)

    try {
      const formData = new FormData()
      formData.append('resumeData', JSON.stringify(resumeData))
      formData.append('removeBackground', removeBackground)

      if (resumeData.personal_info?.image instanceof File) {
        formData.append('image', resumeData.personal_info.image)
      }

      await api.put(`/api/resumes/${resumeData._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('Resume saved successfully!')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save resume')
    } finally {
      setLoadingSave(false)
    }
  }

  // -------------------------
  // ATS SCORE
  // -------------------------
  const checkAtsScore = async () => {
    setLoadingAts(true)
    try {
      const response = await api.post('/api/resumes/ats-score', { resumeData, jobDescription })
      setAtsResult(response.data)
      setShowJobDescriptionModal(false)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to analyze ATS score')
    } finally {
      setLoadingAts(false)
    }
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Panel */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
              {/* Progress Bar */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-200"
                style={{
                  width: `${(activeSectionIndex * 100) / (sections.length - 1)}%`,
                }}
              />

              {/* Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <TemplateSelcetor
                  selectedTemplate={resumeData.template}
                  onChange={(template) =>
                    setResumeData(prev => ({ ...prev, template }))
                  }
                />

                <ColorPicker
                  selectedColor={resumeData.accent_color}
                  onChange={(color) =>
                    setResumeData(prev => ({ ...prev, accent_color: color }))
                  }
                />

                <div className="flex items-center">
                  {activeSectionIndex > 0 && (
                    <button
                      onClick={() =>
                        setActiveSectionIndex(i => Math.max(i - 1, 0))
                      }
                      className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </button>
                  )}

                  <button
                    onClick={() =>
                      setActiveSectionIndex(i =>
                        Math.min(i + 1, sections.length - 1)
                      )
                    }
                    disabled={activeSectionIndex === sections.length - 1}
                    className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${
                      activeSectionIndex === sections.length - 1
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Section Content */}
              <div className="space-y-6">
                {activeSection.id === 'personal' && (
                  <PersonalinfoForm
                    data={resumeData.personal_info}
                    onChange={data =>
                      setResumeData(prev => ({
                        ...prev,
                        personal_info: data,
                      }))
                    }
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
                {activeSection.id === 'summary' && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, professional_summary: data }))
                    }
                  />
                )}
                {activeSection.id === 'experience' && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, experience: data }))
                    }
                  />
                )}
                {activeSection.id === 'education' && (
                  <EducationForm
                    data={resumeData.education}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, education: data }))
                    }
                  />
                )}
                {activeSection.id === 'projects' && (
                  <ProjectForm
                    data={resumeData.project}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, project: data }))
                    }
                  />
                )}
                {activeSection.id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills}
                    onChange={(data) =>
                      setResumeData(prev => ({ ...prev, skills: data }))
                    }
                  />
                )}
              </div>

              <button
                onClick={saveChanges}
                className='bg-gradient-to-br from-green-100 to-green-200 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm flex items-center gap-2'
                disabled={loadingSave}
              >
                {loadingSave && <span className="animate-spin border-2 border-green-500 w-4 h-4 rounded-full" />}
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2 flex-wrap z-10 px-4">
                
                <button
                  onClick={() => setShowJobDescriptionModal(true)}
                  disabled={loadingAts}
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                  bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700
                  rounded-lg ring-1 ring-amber-300 hover:ring-2 transition-colors disabled:opacity-50"
                >
                  {loadingAts ? <LoaderCircleIcon className="size-4 animate-spin" /> : <Target className="size-4" />}
                  {loadingAts ? "Analyzing..." : "ATS Check"}
                </button>
                {resumeData.public && (
                  <button
                    onClick={handleShare}
                    type="button"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                    bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600
                    rounded-lg ring-1 ring-blue-300 hover:ring-2 transition-colors"
                  >
                    <Share2Icon className="size-4" />
                    Share
                  </button>
                )}

                <button
                  onClick={changeResumeVisibility}
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                  bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600
                  rounded-lg ring-1 ring-purple-300 hover:ring-2 transition-colors"
                >
                  {resumeData.public ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
                  {resumeData.public ? "Public" : "Private"}
                </button>

                <button
                  onClick={downloadResume}
                  type="button"
                  className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium
                  bg-gradient-to-br from-green-100 to-green-200 text-green-600
                  rounded-lg ring-1 ring-green-300 hover:ring-2 transition-colors"
                >
                  <DownloadIcon className="size-4" />
                  Download
                </button>
              </div>
            </div>
            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
            />
          </div>
        </div>
      </div>

      {/* Job Description Modal */}
      {showJobDescriptionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowJobDescriptionModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XIcon className="size-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="text-amber-500" /> Target Job Description
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Paste the job description here to get a more accurate ATS score. If left blank, a general ATS evaluation will be performed.
            </p>
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none mb-4"
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowJobDescriptionModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={checkAtsScore}
                disabled={loadingAts}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
              >
                {loadingAts ? <LoaderCircleIcon className="size-4 animate-spin" /> : null}
                {loadingAts ? "Analyzing..." : "Check Score"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ATS Modal */}
      {atsResult && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setAtsResult(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XIcon className="size-6" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Target className="text-amber-500" /> ATS Resume Analysis
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-8 mb-8 items-center border-b pb-6">
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-slate-50 border-8"
                   style={{ borderColor: atsResult.score >= 80 ? '#22c55e' : atsResult.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                <span className="text-3xl font-bold">{atsResult.score}%</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-600 mb-2">
                  Your resume scored <strong>{atsResult.score} out of 100</strong>.
                  {atsResult.score >= 80 ? ' Great job! Your resume is highly optimized.' :
                   atsResult.score >= 60 ? ' Good start, but there is room for improvement to pass ATS filters.' :
                   ' Your resume needs significant improvements to pass ATS systems.'}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">Strengths</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {atsResult.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-red-500 mb-2">Areas for Improvement</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {atsResult.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-amber-600 mb-2">Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {atsResult.missing_keywords?.map((k, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeBuilder
