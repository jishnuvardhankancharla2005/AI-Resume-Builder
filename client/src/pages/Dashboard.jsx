import React, { useState, useEffect } from 'react'
import {
  FilePenLine,
  LoaderCircleIcon,
  Pencil,
  PlusIcon,
  Trash,
  UploadCloudIcon,
  XIcon
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api'

const Dashboard = () => {
  const { user, token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const colors = ['#9333ea', '#d97706', '#dc2626', '#0284c7', '#16a34a']

  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')

  // Loading states
  const [loadingCreate, setLoadingCreate] = useState(false)
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(false)
  const [loadingDeleteId, setLoadingDeleteId] = useState('')

  // Fetch all resumes on load
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const { data } = await api.get('/api/users/resumes', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setAllResumes(data.resumes)
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
      }
    }

    if (token) fetchResumes()
  }, [token])

  // Create new resume
  const createResume = async (e) => {
    e.preventDefault()
    if (!title.trim()) return toast.error('Title cannot be empty')
    setLoadingCreate(true)
    try {
      const { data } = await api.post(
        '/api/resumes',
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      toast.success('Resume created successfully!')
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoadingCreate(false)
    }
  }

  // Edit resume title
  const editTitle = async (e) => {
    e.preventDefault()
    if (!title.trim()) return toast.error('Title cannot be empty')
    setLoadingEdit(true)
    try {
      const { data } = await api.put(
        `/api/resumes/${editResumeId}`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAllResumes((prev) =>
        prev.map((r) => (r._id === editResumeId ? { ...r, title: data.resume.title } : r))
      )
      setEditResumeId('')
      setTitle('')
      toast.success('Resume updated successfully!')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoadingEdit(false)
    }
  }

  // Delete a resume
  const deleteResume = async (resumeId) => {
    const confirm = window.confirm('Are you sure you want to delete this resume?')
    if (!confirm) return
    setLoadingDeleteId(resumeId)
    try {
      await api.delete(`/api/resumes/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setAllResumes((prev) => prev.filter((r) => r._id !== resumeId))
      toast.success('Resume deleted successfully!')
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoadingDeleteId('')
    }
  }

  // Upload an existing resume file
  const uploadResume = async (e) => {
    e.preventDefault()
    if (!title.trim() || !resumeFile) return toast.error('Title and file are required')
    setLoadingUpload(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('file', resumeFile)

      const { data } = await api.post('/api/resumes/upload', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      })

      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setResumeFile(null)
      setShowUploadResume(false)
      toast.success('Resume uploaded successfully!')
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setLoadingUpload(false)
    }
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <p className='text-2xl font-medium mb-6'>
        Welcome, {user?.name || 'User'}
      </p>

      {/* Create / Upload Buttons */}
      <div className='flex gap-4'>
        <button
          onClick={() => setShowCreateResume(true)}
          className='w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border-dashed border border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer'
        >
          {loadingCreate ? (
            <LoaderCircleIcon className='animate-spin size-11 p-2.5 text-white' />
          ) : (
            <PlusIcon className='size-11 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full' />
          )}
          <p className='text-sm group-hover:text-indigo-600 transition-all'>
            Create Resume
          </p>
        </button>

        <button
          onClick={() => setShowUploadResume(true)}
          className='w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border-dashed border border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer'
        >
          {loadingUpload ? (
            <LoaderCircleIcon className='animate-spin size-11 p-2.5 text-white' />
          ) : (
            <UploadCloudIcon className='size-11 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full' />
          )}
          <p className='text-sm group-hover:text-purple-600 transition-all'>
            Upload Existing
          </p>
        </button>
      </div>

      <hr className='border-slate-300 my-6 sm:w-[305px]' />

      {/* Resume Cards */}
      <div className='grid grid-cols-2 sm:flex flex-wrap gap-4'>
        {allResumes.map((resume, index) => {
          const baseColor = colors[index % colors.length]
          return (
            <div
              key={resume._id}
              className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group cursor-pointer'
              style={{
                background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                borderColor: baseColor + '40'
              }}
              onClick={() => navigate(`/app/builder/${resume._id}`)}
            >
              <FilePenLine className='size-7' style={{ color: baseColor }} />
              <p className='text-sm px-2 text-center' style={{ color: baseColor }}>
                {resume.title}
              </p>
              <p
                className='absolute bottom-1 text-[11px] px-2 text-center'
                style={{ color: baseColor + '90' }}
              >
                Updated on {new Date(resume.updatedAt).toLocaleDateString()}
              </p>

              {/* Edit/Delete buttons */}
              <div
                onClick={(e) => e.stopPropagation()}
                className='absolute top-1 right-1 hidden group-hover:flex items-center gap-1'
              >
                {loadingDeleteId === resume._id ? (
                  <LoaderCircleIcon className='animate-spin size-7 p-1.5 text-slate-700' />
                ) : (
                  <Trash
                    onClick={() => deleteResume(resume._id)}
                    className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors'
                  />
                )}
                <Pencil
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditResumeId(resume._id)
                    setTitle(resume.title)
                  }}
                  className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors'
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Resume Modal */}
      {showCreateResume && (
        <form
          onSubmit={createResume}
          onClick={() => setShowCreateResume(false)}
          className='fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center'
        >
          <div onClick={(e) => e.stopPropagation()} className='bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
            <h2 className='text-xl font-bold mb-4'>Create a Resume</h2>
            <input
              type='text'
              placeholder='Enter resume title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600'
              required
            />
            <button
              className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2'
              disabled={loadingCreate}
            >
              {loadingCreate && <LoaderCircleIcon className='animate-spin size-5' />}
              Create Resume
            </button>
            <XIcon
              className='absolute top-4 right-4 cursor-pointer'
              onClick={() => {
                setShowCreateResume(false)
                setTitle('')
              }}
            />
          </div>
        </form>
      )}

      {/* Upload Resume Modal */}
      {showUploadResume && (
        <form
          onSubmit={uploadResume}
          onClick={() => setShowUploadResume(false)}
          className='fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center'
        >
          <div onClick={(e) => e.stopPropagation()} className='bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
            <h2 className='text-xl font-bold mb-4'>Upload Resume</h2>
            <input
              type='text'
              placeholder='Enter resume title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600'
              required
            />
            <input
              id='resume-input'
              type='file'
              className='hidden'
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
            <label htmlFor='resume-input' className='block text-sm text-slate-700'>
              Select resume file
              <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors'>
                {resumeFile ? <p className='text-green-700'>{resumeFile.name}</p> : (
                  <>
                    <UploadCloudIcon className='size-14 stroke-1' />
                    <p>Upload resume</p>
                  </>
                )}
              </div>
            </label>
            <button
              className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2'
              disabled={loadingUpload}
            >
              {loadingUpload && <LoaderCircleIcon className='animate-spin size-5' />}
              Upload Resume
            </button>
            <XIcon
              className='absolute top-4 right-4 cursor-pointer'
              onClick={() => {
                setShowUploadResume(false)
                setTitle('')
                setResumeFile(null)
              }}
            />
          </div>
        </form>
      )}

      {/* Edit Resume Modal */}
      {editResumeId && (
        <form
          onSubmit={editTitle}
          onClick={() => setEditResumeId('')}
          className='fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center'
        >
          <div onClick={(e) => e.stopPropagation()} className='bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
            <h2 className='text-xl font-bold mb-4'>Edit Resume Title</h2>
            <input
              type='text'
              placeholder='Enter resume title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600'
              required
            />
            <button
              className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2'
              disabled={loadingEdit}
            >
              {loadingEdit && <LoaderCircleIcon className='animate-spin size-5' />}
              Update
            </button>
            <XIcon
              className='absolute top-4 right-4 cursor-pointer'
              onClick={() => {
                setEditResumeId('')
                setTitle('')
              }}
            />
          </div>
        </form>
      )}
    </div>
  )
}

export default Dashboard
