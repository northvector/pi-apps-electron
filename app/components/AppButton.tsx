"use client"
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BiCheckCircle } from 'react-icons/bi';


interface AppButtonProps {
    appname: string;
    category?: string;
}

const AppButton: React.FC<AppButtonProps> = ({ appname, category }) => {
    const [content, setContent] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await window.electronAPI.readFile(`data/status/${appname}`);
                setContent(data);
            } catch (error) {
                console.error("Error reading file:", error);
            }
        };

        fetchData();
    }, [appname]);

    return (
        <Link href={`/view/${appname}`} className='p-1 !rounded-lg bg-zinc-800 hover:bg-zinc-950 transition-all flex items-center gap-1'>
            <img src={`local:///apps/${appname}/icon-64.png`} className='min-w-12 size-12 mx-auto rounded-lg bg-neutral-700' />
            <div className='flex flex-col gap-2 p-1 w-full text-left'>
                <div className='font-bold'>{appname}</div>
                <div className='text-sm opacity-50 empty:hidden'>{category}</div>
            </div>
            <div className='flex flex-col gap-2 p-1 text-right'>
                {content?.trim() == "installed" && <div className='text-sm text-green-500 opacity-50'><BiCheckCircle size={33} /></div>}
            </div>
        </Link>
    )
}
export default AppButton;