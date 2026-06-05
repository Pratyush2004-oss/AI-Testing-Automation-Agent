'use client'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { TESTCASESTYPE } from '@/types';
import { Button } from '../ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';
const SettingsDialog = ({ TestCase, refreshList }: { TestCase: TESTCASESTYPE, refreshList: (repoId: number) => Promise<void> }) => {
    const [formTestCase, setformTestCase] = useState<TESTCASESTYPE>(TestCase);
    const [loading, setloading] = useState(false);
    const [isOpen, setisOpen] = useState(false)
    const handleChange = (name: string, value: string) => {
        setformTestCase(prev => ({ ...prev, [name]: value }));
    }

    const updateTestCase = async () => {
        try {
            setloading(true);
            await axios.post(`/api/test-cases/test-case-setting`, {
                ...formTestCase,
                repoId: TestCase.repoId,
                testCaseId: TestCase.id
            }).then((res) => {
                if (res.status === 400) throw new Error(res.data.error);
                if (res.data) {
                    toast.success("Test case updated successfully");
                    // reolad the list also
                    refreshList(formTestCase.repoId);
                    setisOpen(false);
                }
            });
        } catch (error: any) {
            if (error instanceof AxiosError) toast.error(error.response?.data.error);
            else toast.error("Error updating test case");
        }
        finally {
            setloading(false);
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setisOpen}>
            <DialogTrigger className='border rounded-lg p-1 '>
                <Settings className='sixe-3' />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Testing requirements</DialogTitle>
                    <DialogDescription>
                        Modify these parameters automatically clears pre-generated cases
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className='my-5 flex flex-col gap-1'>
                        <Label>Title</Label>
                        <Input
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder='Test Title' className='w-full mt-1' value={formTestCase.title} />
                    </div>
                    <div className='my-5 flex flex-col gap-1'>
                        <Label>Desctription / Action</Label>
                        <Textarea
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder='Descrtiption' className='w-full mt-1' value={formTestCase.description} />
                    </div>
                    <div className='my-5 flex flex-col gap-1'>
                        <Label>Target Route / Path</Label>
                        <Input
                            onChange={(e) => handleChange('targetRoute', e.target.value)}
                            placeholder='Target Route' className='w-full mt-1' value={formTestCase.targetRoute} />
                    </div>
                    <div className='my-5 flex flex-col gap-1'>
                        <Label>Expected Result</Label>
                        <Textarea
                            onChange={(e) => handleChange('expectedResult', e.target.value)}
                            placeholder='Expected Result' className='w-full mt-1' value={formTestCase.expectedResult} />
                    </div>
                </div>
                <DialogFooter className='flex items-center gap-3'>
                    <DialogClose className='bg-red-400 py-1.5 rounded-lg px-3 text-white hover:bg-red-500'>
                        Cancel
                    </DialogClose>
                    <Button disabled={loading} onClick={updateTestCase} className='bg-green-400 text-white hover:text-black'>{
                        loading ? "Updating..." : "Update"
                    }</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default SettingsDialog