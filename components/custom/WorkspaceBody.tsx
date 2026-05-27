'use client'
import { UserDetailContext } from '@/context/UserDetailContext'
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import EmptyWorkspace from './EmptyWorkspace';
import axios from 'axios';
import RepoDialog from './RepoDialog';

const WorkspaceBody = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [token, setToken] = useState<string | null>();

    useEffect(() => {
        getGitHubUserToken()
    }, [])
    // get user cookie token
    const getGitHubUserToken = async () => {
        const result = await axios.get("/api/github/token");
        setToken(result.data.token);
    }
    // add repo controller
    const onAddRepo = async () => {
        window.location.href = "/api/github";
    }

    const handleRefreshPage = (refresh: boolean) => { };
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
                {
                    !token ?
                        <Button variant={"outline"} onClick={onAddRepo} className='bg-blue-400 cursor-pointer'>Setup</Button>
                        :
                        <RepoDialog setRefreshPage={handleRefreshPage} />
                }
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