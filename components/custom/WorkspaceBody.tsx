'use client'
import { UserDetailContext } from '@/context/UserDetailContext'
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import EmptyWorkspace from './EmptyWorkspace';
import axios from 'axios';
import RepoDialog from './RepoDialog';
import { REPOTYPE, USERREPOTYPE } from '@/types';
import LoadingSection from './LoadingSection';
import UserRepoList from './UserRepoList';

const WorkspaceBody = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [token, setToken] = useState<string | null>();
    const [isLoading, setisLoading] = useState(false)
    const [userRepoList, setuserRepoList] = useState<USERREPOTYPE[]>([])

    useEffect(() => {
        getGitHubUserToken();
    }, [])

    useEffect(() => {
        userDetail && getUserRepoList();
    }, [userDetail])
    // get user cookie token
    const getGitHubUserToken = async () => {
        try {
            setisLoading(true)
            const result = await axios.get("/api/github/token");
            setToken(result.data.token);
        } catch (error) {
        }
        finally {
            setisLoading(false)
        }
    }
    // add repo controller
    const onAddRepo = async () => {
        window.location.href = "/api/github";
    }

    // get user repo
    const getUserRepoList = async () => {
        try {
            setisLoading(true)
            const result = await axios.get(`/api/user-repo?userId=${userDetail?.id}`);
            setuserRepoList(result.data)
        } catch (error) {
        }
        finally {
            setisLoading(false)
        }
    };

    const handleRefreshPage = (refresh: boolean) => {
        if (refresh) {
            getUserRepoList();
        }
    };
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
            {
                userRepoList.length > 0 ?
                    <UserRepoList RepoList={userRepoList} /> :
                    <Card>
                        <CardContent>
                            {isLoading ? <LoadingSection /> :
                                <EmptyWorkspace />}
                        </CardContent>
                    </Card>
            }
        </div>
    )
}

export default WorkspaceBody