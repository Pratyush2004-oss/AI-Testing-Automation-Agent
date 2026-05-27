'use client'
import { UserDetailContext } from '@/context/UserDetailContext'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Provider = ({ children }: { children: React.ReactNode }) => {
    const [userDetail, setUserDetail] = useState<any>();
    useEffect(() => {
        createNewUser()
    }, [])
    const createNewUser = async () => {
        const result = await axios.post(`/api/users`, {})
        setUserDetail(result.data.user)
    }
    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <div>{children}</div>
        </UserDetailContext.Provider>
    )
}

export default Provider