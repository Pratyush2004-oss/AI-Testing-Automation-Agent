import { TESTCASESTYPE, USERREPOTYPE } from '@/types'
import { CheckCircle2, Globe2Icon, ListChecks, Loader, Settings2, Sparkle, Sparkles, TrendingUp, XCircle } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Button } from '../ui/button'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { UserDetailContext } from '@/context/UserDetailContext'
import LoadingSection from './LoadingSection'
import TestCaseList from './TestCaseList'
import RepoSettings from './RepoSettings'

const UserRepoList = ({ RepoList, handleRefresh }: { RepoList: USERREPOTYPE[], handleRefresh: () => Promise<void> }) => {
    const [testData, settestData] = useState({
        totalTests: 0,
        passedTests: 0,
        failedTests: 0
    })
    let passRate = testData.totalTests > 0 ? Math.round((testData.passedTests / testData.totalTests) * 100) : 0
    const { userDetail } = useContext(UserDetailContext)
    const [isLoading, setisLoading] = useState(false);
    const [isFetching, setsFetching] = useState<number | null>(null);
    const [TestCasesList, setTestCasesList] = useState<TESTCASESTYPE[]>([]);
    // generate test cases
    const handleGenerateTestCases = async (repo: USERREPOTYPE) => {
        setisLoading(true);
        console.log(repo)
        await axios.post(`/api/generate-test-cases`, {
            repoId: repo.repoId,
            userId: repo.userId,
            owner: repo.owner,
            repo: repo.name,
            branch: repo.default_branch
        }).then((res) => {
            if (res.status === 400) throw new Error(res.data.error);
            if (res.data) {
                // setTestCasesList(res.data);
                console.log(res.data)
                toast.success('Test cases generated successfully');
            }
        }).catch((error: any) => {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.error);
            } else {
                toast.error(error.message);
            }
        }).finally(() => {
            setisLoading(false);
        })


    }
    // fetch test cases
    const fetchRepoTestCases = async (repoId: number) => {
        setsFetching(repoId);
        await axios.get(`/api/test-cases?repoId=${repoId}&userId=${userDetail?.id}`)
            .then((res) => {
                if (res.status === 400) throw new Error(res.data.error);
                if (res.data) {
                    setTestCasesList(res.data);
                    let totalTests = res.data.length
                    let passedTests = res.data.filter((testcase: TESTCASESTYPE) => testcase.status === 'passed').length
                    let failedTests = res.data.filter((testcase: TESTCASESTYPE) => testcase.status === 'failed').length
                    settestData({
                        totalTests: totalTests,
                        passedTests: passedTests,
                        failedTests: failedTests
                    })
                }
            }).catch((error: any) => {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data.error);
                } else {
                    toast.error(error.message);
                }
            }).finally(() => {
                setsFetching(null);
            })
    }
    return (
        <div>
            <h1 className='text-xl font-semibold'>REPOSITORIES</h1>
            <Accordion type="single" collapsible
                onValueChange={(value) => fetchRepoTestCases(Number(value))}>
                {RepoList.map((repo) => (
                    <AccordionItem key={repo.id} value={`${repo.repoId}`} className='px-5 rounded-xl border my-3'>
                        <AccordionTrigger>
                            <div className='flex items-center gap-3'>
                                <Image src="/github.png" alt="github" width={25} height={25} className='rounded-full' />
                                <div className='flex flex-col items-start gap-1'>
                                    <h2 className='text-xl font-semibold'>{repo.name}</h2>
                                    <p className='text-xs'>{repo.default_branch} · {repo.language} · {repo.updatedAt.split('T')[0]}</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className='p-4 space-y-5'>
                                <div className='bg-gray-800 p-3 border rounded-xl flex items-center justify-between'>
                                    <div className='flex gap-2 items-center'>
                                        <Globe2Icon />
                                        <h2>Target Domain</h2>
                                        <h2 className='border p-1 border-gray-50/50 rounded-lg'>{repo.targetDomain}</h2>
                                    </div>
                                    <RepoSettings repo={repo} handleRefresh={handleRefresh}/>
                                </div>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                    <StatusCard
                                        title="Total Tests"
                                        value={testData.totalTests}
                                        icon={<ListChecks className='size-6 rounded-full text-blue-500' />}
                                        bgColor='bg-blue-50'
                                    />
                                    <StatusCard
                                        title="Passed Tests"
                                        value={testData.passedTests}
                                        icon={<CheckCircle2 className='size-6 rounded-full text-green-500' />}
                                        bgColor='bg-green-50'
                                    />
                                    <StatusCard
                                        title="Failed Tests"
                                        value={testData.failedTests}
                                        icon={<XCircle className='size-6 rounded-full text-red-500' />}
                                        bgColor='bg-red-50'
                                    />
                                    <StatusCard
                                        title="Test Rate"
                                        value={passRate}
                                        icon={<TrendingUp className='size-6 rounded-full text-purple-500' />}
                                        bgColor='bg-purple-50'
                                    />
                                </div>
                            </div>
                            {
                                isFetching === repo.repoId ? (
                                    <LoadingSection />
                                ) : TestCasesList.length > 0 ? (
                                    <TestCaseList TestCaseList={TestCasesList} handleRefresh={(repoId) => fetchRepoTestCases(repoId)} />
                                ) : (
                                    <div className='flex flex-col sm:flex-row items-center justify-between'>
                                        <div>
                                            <h3 className='font-medium'>Generate AI Test Cases</h3>
                                            <p className='text-sm text-gray-500 mt-1'>
                                                Analyze the repository and generate AI test cases
                                            </p>
                                        </div>
                                        <Button className='gap-2' onClick={() => handleGenerateTestCases(repo)} disabled={isLoading}>
                                            {
                                                isLoading ?
                                                    <>
                                                        <Loader className='size-5 animate-spin' /> Generating ...
                                                    </> :
                                                    <>
                                                        <Sparkles className='size-5' /> Generate Test Cases
                                                    </>
                                            }
                                        </Button>
                                    </div>
                                )
                            }

                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default UserRepoList

interface STATUSCARDPROPS {
    title: string
    value: string | number
    icon: React.ReactNode
    bgColor: string
}
const StatusCard = ({ bgColor, icon, title, value }: STATUSCARDPROPS) => {
    return (
        <div className='border rounded-xl p-4 flex items-center justify-between'>
            <div>
                <p className='text-sm text-gray-500 font-semibold'>{title}</p>
                <h2 className='text-2xl font-semibold mt-1'>{value}</h2>
            </div>
            <div className={`size-10 rounded-full flex items-center justify-center ${bgColor}`}>{icon}</div>
        </div>
    )
}