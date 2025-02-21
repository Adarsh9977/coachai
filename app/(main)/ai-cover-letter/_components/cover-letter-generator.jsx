'use client';
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { coverLetterSchema } from '@/app/lib/schema';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { generateCoverLetter } from '@/actions/cover-letter';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
  

const CoverLetterGenerator = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState : { errors },
        reset,
    } = useForm({
        resolver: zodResolver(coverLetterSchema)
    });

    const {
        loading: generating,
        fn: generateLetterFn,
        data: generatedLetter,
    } = useFetch(generateCoverLetter);

    useEffect(() => {
        if(generatedLetter && !generating){
            toast.success("Cover letter generated successfully!")
            router.push(`/ai-cover-letter/${generatedLetter.id}`)
            reset();
        }
    }, [generatedLetter]);
    
    const onSubmit = async (data) =>{
        try {
            await generateLetterFn(data);
        } catch (error) {
            toast.error(error.message || "Failed to generate cover letter")
        }
    }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Provide information about the position you're applying for</CardDescription>
        </CardHeader>
        <CardContent>
            <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                        <Label  htmlFor='companyName'>
                            Company Name
                        </Label>
                        <Input
                            id='companyName'
                            placeholder='Enter company name'
                            {...register('companyName')}
                        />
                        {errors.companyName && (
                            <p className='text-sm text-red-500'>
                                {errors.companyName.message}
                            </p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label  htmlFor='jobTitle'>
                            Job Title
                        </Label>
                        <Input
                            id='jobTitle'
                            placeholder='Enter job title'
                            {...register('jobTitle')}
                        />
                        {errors.jobTitle && (
                            <p className='text-sm text-red-500'>
                                {errors.jobTitle.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className='space-y-2'>
                    <Label  htmlFor='jobDescription'>
                        Job Description
                    </Label>
                    <Textarea
                        id='jobDescription'
                        placeholder='Paste the job description here'
                        className="h-32"
                        {...register('jobDescription')}
                    />
                    {errors.jobDescription && (
                        <p className='text-sm text-red-500'>
                            {errors.jobDescription.message}
                        </p>
                    )}
                </div>

                <div className='flex justify-end'>
                    <Button type='submit' disabled={generating}>
                        { generating ? (
                            <>
                                <Loader2 className='h-4 w-4 animate-spin mr-2'/>
                                Generating...
                            </>
                        ): (
                            "Generate Cover Letter"
                        )}
                    </Button>
                </div>
            </form>
        </CardContent>
    </Card>

    </div>
  )
}

export default CoverLetterGenerator
