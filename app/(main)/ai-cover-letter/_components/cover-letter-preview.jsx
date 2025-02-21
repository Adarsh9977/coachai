'use client';
import { Button } from '@/components/ui/button';
import MDEditor from '@uiw/react-md-editor'
import React, { useState } from 'react'

const CoverLetterPreview = ({ content }) => {
    const [preview, setPreview] = useState('preview')
  return (
    <div className='py-4 space-y-2'>
        <Button variant='outline' onClick={()=> preview === 'edit' ? setPreview('preview') : setPreview('edit')} >
            { preview === 'edit' ? "Show" : "Edit"}
        </Button>
        <MDEditor value={content} preview={preview} height={700}/>
    </div>
  )
}

export default CoverLetterPreview;
