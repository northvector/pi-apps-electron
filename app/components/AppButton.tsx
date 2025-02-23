import Link from 'next/link'
import React from 'react'

interface AppButtonProps {
    appname: string;
    category?: string;
}

const AppButton: React.FC<AppButtonProps> = ({ appname, category }) => {
    return (
        <Link href={`/view/${appname}`} className='p-3 bg-zinc-800 hover:bg-zinc-950 transition-all flex items-center gap-2'>
            <img src={`https://github.com/Botspot/pi-apps/blob/master/apps/${appname}/icon-64.png?raw=true`} loading="lazy" className='size-12 mx-auto' />
            <div className='flex flex-col gap-2 p-3 w-full text-left'>
                <div className=''>{appname}</div>
                <div className='text-sm opacity-50'>{category}</div>
            </div>
        </Link>
    )
}
export default AppButton;