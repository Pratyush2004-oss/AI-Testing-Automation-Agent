import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'lucide-react'

const EmptyWorkspace = () => {
    return (
        <div className='flex items-center justify-center gap-4 flex-col mt-10'>
            <Image src="/folder.png" alt="empty workspace" width={70} height={70} className='rounded-full' />
            <h2 className='font-medium text-2xl'>No repositories connected</h2>
            <p className='text-center mx-10'>Connect your github accounts and add a repository to generate and run test cases</p>
            <Button variant={"link"} className='mt-5 bg-white text-black'>
                <Link className='mr-2 size-5'/> Connect to Github
            </Button>
        </div>
    )
}

export default EmptyWorkspace