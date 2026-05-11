import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import ResumePreview from '../components/ResumePreview'
import Loader from '../components/Loader'
import { ArrowLeftIcon } from 'lucide-react'

const Preview = () => {
  const { resumeId } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  const [resumeData, setResumeData] = useState(null)

  useEffect(() => {
    const loadResume = () => {
      const foundResume = dummyResumeData.find(
        resume => resume._id === resumeId
      )

      setResumeData(foundResume || null)
      setIsLoading(false)
    }

    loadResume()
  }, [resumeId])

  if (isLoading) {
    return <Loader />
  }

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
        <p className="text-center text-3xl text-slate-500 font-medium">
          Resume not found
        </p>

        <Link
          to="/"
          className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors"
        >
          <ArrowLeftIcon className="mr-2 size-4" />
          Go to home page
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          className="py-4 bg-white"
        />
      </div>
    </div>
  )
}

export default Preview
