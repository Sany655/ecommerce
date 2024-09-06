import AppLayout from '@/Layouts/AppLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

function Index() {
    return (
        <AppLayout>
            <Head title='home'/>
            <p>hello world</p>
        </AppLayout>
    )
}

export default Index
