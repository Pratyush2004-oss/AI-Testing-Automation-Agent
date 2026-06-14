'use client'
import { TESTCASESTYPE, USERREPOTYPE } from '@/types'
import { Play, RefreshCcw, Settings } from 'lucide-react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { useState } from 'react'
import SettingsDialog from './SettingsDialog'
import TestExecutionModal from './TestExecutionModal'

const TestCaseListComp = ({ TestCaseList, handleRefresh, repository }: { TestCaseList: TESTCASESTYPE[], handleRefresh: (repoId: number) => Promise<void>, repository: USERREPOTYPE }) => {
    const [selectedTestCases, setselectedTestCases] = useState<TESTCASESTYPE[]>([]);
    const [isModalOpen, setisModalOpen] = useState(false);
    const handleSelectedTestCase = (check: boolean | string, testCase: TESTCASESTYPE) => {
        if (typeof check === 'boolean') {
            if (check) {
                setselectedTestCases([...selectedTestCases, testCase]);
            } else {
                setselectedTestCases(selectedTestCases.filter((item) => item.id !== testCase.id));
            }
        }
    }
    return (
        <div>
            <div className='flex items-center justify-between'>
                <h2 className='text-xl font-bold ml-3'>Test Cases</h2>
                <Button onClick={() => handleRefresh(TestCaseList[0].repoId)} variant={'outline'}><RefreshCcw className='size-4 mr-2' /> Refresh</Button>
            </div>
            <div className='border py-2 mt-1 rounded-md px-2'>
                {TestCaseList.map((item) => (
                    <div key={item.id} className='p-4 border-b flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <Checkbox
                                checked={selectedTestCases.some((testCase) => testCase.id === item.id)}
                                onCheckedChange={(check) => handleSelectedTestCase(check, item)} />
                            <div>
                                <h2 className='text-base font-bold'>{item.title}</h2>
                                <p className='text-xs text-gray-500'>{item.description}</p>
                            </div>
                        </div>
                        <div className='gap-4 flex'>
                            <Badge variant={'secondary'}>{item.type}</Badge>
                            <Badge variant={'secondary'}
                                className={`${item.status === 'failed' ? 'bg-red-600' :
                                    item.status === 'generated' || item.status === 'running' ? 'bg-yellow-600' :
                                        'bg-green-600'}`}>{item.status}</Badge>
                            <SettingsDialog TestCase={item} refreshList={() => handleRefresh(item.repoId)} />
                        </div>
                    </div>
                ))}
                <div className='p-4 items-center justify-between flex bg-gray-800 rounded-b-xl'>
                    <h2 className='font-bold'>Run Selected Test Cases</h2>
                    <Button disabled={selectedTestCases.length === 0} variant={'default'}
                        onClick={() => setisModalOpen(true)}>
                        <Play className='mr-2' size={16} /> Run Selected</Button>
                </div>
            </div>
            {isModalOpen &&
                <TestExecutionModal
                    isOpen={isModalOpen}
                    onClose={() => setisModalOpen(false)}
                    testCases={selectedTestCases}
                    repository={repository}
                    refresh= {() => handleRefresh(selectedTestCases[0].repoId)}
                />
            }
        </div>
    )
}

export default TestCaseListComp