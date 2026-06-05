import React, { useContext, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Settings2 } from 'lucide-react'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { USERREPOTYPE } from '@/types';
import axios, { AxiosError } from 'axios';
import { UserDetailContext } from '@/context/UserDetailContext';
import { toast } from 'sonner';
const RepoSettings = ({ repo, handleRefresh }: { repo: USERREPOTYPE, handleRefresh: () => Promise<void> }) => {
    const [isOpen, setisOpen] = useState(false);
    const [loading, setloading] = useState(false);
    const [repoConfigData, setrepoConfigData] = useState({
        targetDomain: repo.targetDomain,
        globalInstructions: repo.globalInstructions || ''
    })
    const { userDetail } = useContext(UserDetailContext)

    const handleChange = (name: string, value: string) => {
        setrepoConfigData(prev => ({ ...prev, [name]: value }));
    }

    const updateRepoConfig = async () => {
        try {
            setloading(true)
            await axios.post('/api/user-repo/setting', {
                ...repoConfigData,
                repoId: repo.repoId,
                userId: userDetail?.id
            }).then((res) => {
                if (res.status === 400) throw new Error(res.data.error);
                if (res.data) {
                    toast.success('Repository updated successfully');
                    handleRefresh();
                    setisOpen(false);
                }
            })
        } catch (error: any) {
            if (error instanceof AxiosError) toast.error(error.response?.data.error)
            else toast.error("Error updating repo config")
        }
        finally {
            setloading(false)
        }

    }
    return (
        <Dialog open={isOpen} onOpenChange={setisOpen}>
            <DialogTrigger className='bg-green-500 gap-1 text-white items-center font-bold hover:text-black px-2 py-1.5 cursor-pointer flex hover:bg-gray-200 rounded-md'><Settings2 className='size-4' /> Project config
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'><Settings2 className='size-4' /> Project Config</DialogTitle>
                    <DialogDescription>
                        Configure project-level defaults used during script generation and execution
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-4 '>
                    <div>
                        <Label>APP URL/Default Domain</Label>
                        <Input
                            value={repoConfigData.targetDomain}
                            onChange={(e) => handleChange('targetDomain', e.target.value)}
                            className='mt-2'
                            placeholder='https://example.com' />
                        <p className='text-xs text-yellow-200 mt-1'>The target address where automated headless browsers will connect and run test cases.</p>
                    </div>
                    <div>
                        <Label>Global Test Instruction</Label>
                        <Textarea
                            value={repoConfigData.globalInstructions}
                            onChange={(e) => handleChange('globalInstructions', e.target.value)}
                            className='mt-2'
                            placeholder='Instructions' />
                        <p className='text-xs text-yellow-200 mt-1'>Include any authentication credentials, cookies, setup or teardown instructions. <br /> These are automatically appended to the AI-Agents</p>
                    </div>  
                </div>
                <DialogFooter>
                    <DialogClose className='bg-red-400 py-1.5 rounded-lg px-3 text-white hover:bg-red-500'>
                        Cancel
                    </DialogClose>
                    <Button disabled={loading} onClick={updateRepoConfig} className='bg-green-400 text-white hover:text-black'>{
                        loading ? "Updating..." : "Config"
                    }</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default RepoSettings