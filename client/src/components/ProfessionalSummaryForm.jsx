import { Sparkles, LoaderCircleIcon } from 'lucide-react'
import React, { useState } from 'react'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
  const [loading, setLoading] = useState(false)

  const handleAiEnhance = async () => {
    if (!data?.trim()) {
      toast.error('Please write a basic summary first for the AI to enhance.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post('/api/resumes/ai-enhance', { text: data, section: 'summary' });
      if (response.data.text) {
        onChange(response.data.text);
        toast.success('Summary enhanced successfully!');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to enhance summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='text-lg font-semibold'>
          <h3>Professional Summary</h3>
          <p className='text-sm text-gray-500'>
            Add summary for your resume here
          </p>
        </div>

        <button 
          onClick={handleAiEnhance}
          disabled={loading}
          className='flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'
        >
          {loading ? <LoaderCircleIcon className='animate-spin size-4' /> : <Sparkles className='size-4' />}
          {loading ? 'Enhancing...' : 'AI Enhance'}
        </button>
      </div>

      <div className='mt-6'>
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className='w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline transition-colors resize-none'
          placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'
        />
        <p className='text-xs text-gray-500 max-w-4/5 mx-auto text-center'>
          Tip: keep it concise (3-4 sentences) and focus on your most relevant achievements and skills.
        </p>
      </div>
    </div>
  )
}

export default ProfessionalSummaryForm
