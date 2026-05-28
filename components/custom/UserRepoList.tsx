import { USERREPOTYPE } from '@/types'
import { CheckCircle2, ListChecks, Sparkle, Sparkles, TrendingUp, XCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion'
import { Button } from '../ui/button'

const UserRepoList = ({ RepoList }: { RepoList: USERREPOTYPE[] }) => {
    const totalTests = 0
    const passedTests = 0
    const failedTests = 0
    const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0
    return (
        <div>
            <h1 className='text-xl font-semibold'>REPOSITORIES</h1>
            {RepoList.map((repo) => (
                <Accordion key={repo.id} type="single" collapsible defaultValue='item-1'>
                    <AccordionItem value={`item-${repo.id}`} className='px-5 rounded-xl border my-3'>
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
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                    <StatusCard
                                        title="Total Tests"
                                        value={totalTests}
                                        icon={<ListChecks className='size-6 rounded-full text-blue-500' />}
                                        bgColor='bg-blue-50'
                                    />
                                    <StatusCard
                                        title="Passed Tests"
                                        value={passedTests}
                                        icon={<CheckCircle2 className='size-6 rounded-full text-green-500' />}
                                        bgColor='bg-green-50'
                                    />
                                    <StatusCard
                                        title="Failed Tests"
                                        value={failedTests}
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
                            <div className='flex flex-col sm:flex-row items-center justify-between'>
                                <div>

                                    <h3 className='font-medium'>Generate AI Test Cases</h3>
                                    <p className='text-sm text-gray-500 mt-1'>
                                        Analyze the repository and generate AI test cases
                                    </p>
                                </div>
                                <Button className='gap-2'>
                                    <Sparkles className='size-5' /> Generate Test Cases
                                </Button>
                            </div>

                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            ))}
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