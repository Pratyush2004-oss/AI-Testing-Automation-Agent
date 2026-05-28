'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Dialog, DialogTrigger, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from '@/components/ui/dialog'
import { Button } from '../ui/button'
import axios, { AxiosError } from 'axios'
import { Input } from '../ui/input'
import { REPOTYPE } from '@/types'
import { UserDetailContext } from '@/context/UserDetailContext'
import { toast } from 'sonner'

const RepoDialog = ({ setRefreshPage }: { setRefreshPage: (refresh: boolean) => void }) => {
    const { userDetail } = useContext(UserDetailContext);
    const [repoList, setrepoList] = useState<REPOTYPE[]>([])
    const [search, setsearch] = useState("");
    const [loading, setloading] = useState(false);
    const [isOpen, setisOpen] = useState(false);
    useEffect(() => {
        repoList.length === 0 && getAllRepositories()
    }, [])
    const [selectedRepo, setselectedRepo] = useState<REPOTYPE | null>(null);
    const getAllRepositories = async () => {
        const result = await axios.get('/api/github/repos')
        setrepoList(result.data)
    }
    // filter repo list by search input
    const filteredRepoList = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return repoList;
        return repoList.filter(repo => repo.name.toLowerCase().includes(q));
    }, [repoList, search])

    // handle save repo to database
    const handleSaveRepo = async () => {
        try {
            if (!selectedRepo) return;
            setloading(true);
            await axios.post('/api/user-repo', {
                id: selectedRepo.id,
                isPrivate: selectedRepo.isPrivate,
                name: selectedRepo.name,
                full_name: selectedRepo.full_name,
                html_url: selectedRepo.html_url,
                description: selectedRepo.description,
                language: selectedRepo.language,
                default_branch: selectedRepo.default_branch,
                owner: selectedRepo.owner,
                updated_at: selectedRepo.updated_at,
                userId: userDetail?.id
            }).then((res) => {
                if (res.status === 400) throw new Error(res.data.error);
                if (res.data) {
                    toast.success('Repository added successfully');
                    setRefreshPage(true);
                    setisOpen(false);
                    setloading(false);
                }
            });
        } catch (error: any) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.error);
            } else
                toast.error(error.message);
        }
        finally {
            setloading(false);
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setisOpen}>
            <DialogTrigger className='bg-blue-400 cursor-pointer text-white px-4 py-1.5 rounded-xl'>
                + Add
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Repository</DialogTitle>
                    <DialogDescription>
                        Search and select oneof your github repositories.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {/* Search input */}
                    <Input placeholder='Search Repository' className='w-full mb-5' value={search} onChange={(e) => setsearch(e.target.value)} />
                    {/* Repo list */}
                    <ul className='max-h-60 overflow-y-auto border rounded-xl'>
                        {filteredRepoList.map((repo, idx) => (
                            <li
                                key={idx}
                                onClick={() => setselectedRepo(repo)}
                                className={`p-4 border-b hover:bg-gray-800 cursor-pointer ${selectedRepo?.id === repo.id ? 'bg-gray-800' : ''}`}
                            >
                                {repo.full_name}
                            </li>
                        ))}
                    </ul>
                </div>
                <DialogFooter className='flex items-center justify-end gap-5'>
                    <DialogClose>Cancel</DialogClose>
                    <Button disabled={loading || !selectedRepo} onClick={handleSaveRepo}>{
                        loading ? 'Saving...' : 'Save'
                    }</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RepoDialog