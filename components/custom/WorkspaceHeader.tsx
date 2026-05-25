'use client'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'


const WorkspaceHeader = () => {
    const ListItems = [
        {
            name: 'Workspace',
            icon: '',
        },
        {
            name: 'Pricing',
            icon: '',
        },
        {
            name: 'Support',
            icon: '',
        },
    ]
    return (
        <div className='flex items-center justify-between w-full p-4 border-b-2'>
            {/* Logo */}
            <Image src="/logo-1.png" alt="logo" width={100} height={100}
                className='rounded-full'
            />
            {/* Menu Options */}
            <ul className='flex gap-5 text-xl'>
                {ListItems.map((item, idx) => (
                    <li key={idx} className='hover:text-blue-400'>{item.name}</li>
                ))}
            </ul>
            {/* User Button */}
            <UserButton />
        </div>
    )
}

export default WorkspaceHeader