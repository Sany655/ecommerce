import React, { useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import aiRequest from '@/Services/aiRequest';
function ManageWithAi(props) {
    const [input, setInput] = useState('')
    const [jsonData, setJsonData] = useState({})

    const generate = async () => {
        const response = await aiRequest(input)
        if(typeof (JSON.parse(response)) === 'object'){
            console.log(JSON.parse(response));
            setJsonData(JSON.parse(response))
        }
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Settings</h2>}
        >
            <Head title="AI - Magic" />

            <div className="py-12 container mx-auto">
                <div className="grid grid-cols-2 gap-5 md:gap-10 justify-center">
                    <div className="border bg-white p-4">
                        <form className="flex flex-col gap-2">
                            <textarea type="text" className="border border-gray-200 p-2 bg-white" value={input} onChange={e => setInput(e.target.value)} />
                            <button className="bg-blue-300 py-1" type='button' onClick={generate}>Generate</button>
                            <button className="bg-green-500 py-1" type='submit'>Post</button>
                        </form>
                    </div>
                </div>
                {
                    typeof (jsonData === 'object') && (

                        jsonData?.categories?.map((cat, ind) => (
                            <div key={ind} className='my-3'>
                                <h2>{cat.name}</h2>
                                <hr className='mb-2'/>
                                <div className="grid grid-cols-4 grid-cols-md-1 grid-cols-lg-2 gap-2 md:gap-5">
                                    {
                                        (cat?.products||jsonData?.products.filter(x => x.category_id === cat.id)).map((prod,i) => (
                                            <div className="border bg-white p-4" key={i}>
                                                <h2>{prod.name}</h2>
                                                <p>{prod.price}</p>
                                                <p>{prod.stock}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
        </AuthenticatedLayout>
    )
}

export default ManageWithAi