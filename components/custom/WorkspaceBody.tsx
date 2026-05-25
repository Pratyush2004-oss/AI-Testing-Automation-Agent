'use client'
import { UserDetailContext } from '@/context/userDetailContext'
import Image from 'next/image';
import React, { useContext } from 'react'
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import EmptyWorkspace from './EmptyWorkspace';

const WorkspaceBody = () => {
    const { userDetail } = useContext(UserDetailContext);
    return (
        <div>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold'>Workspace</h2>
                <h2 className='text-blue-700 font-semibold bg-blue-200 px-2 rounded-xl'>Remining Credits: {userDetail?.credits}</h2>
            </div>
            <Card className='my-5 border rounded-xl p-3 flex items-center justify-between'>
                <div className='flex items-center gap-10'>

                    <Image
                        src={"/github.png"}
                        height={50}
                        width={50}
                        alt="workspace"
                        className='rounded-full'
                    />
                    <h2 className='text-xl font-semibold'>Connect Github and Add Repo</h2>
                </div>
                <Button variant={"outline"} className='bg-blue-400 cursor-pointer'>Install</Button>
                <Button variant={"outline"} className='bg-blue-400 cursor-pointer'>+ Add</Button>
            </Card>
            <Card>
                <CardContent>
                    <EmptyWorkspace />
                </CardContent>
            </Card>
        </div>
    )
}

export default WorkspaceBody