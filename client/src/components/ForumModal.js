import { useState } from "react";




export default function ForumModal({ addForum }) {


    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');

    const createForum = (e) => {
        e.preventDefault();
        var d = new Date();
        addForum({
            title:title,
            content:content,
            sender: "Dummy User",
            time: d.getTime(),
            status: "open",
            comments: []
        })
    }

    return (
        <div className="flex flex-col gap-y-2 overflow-y-auto">

            <form onSubmit={(e) => createForum(e)} method="POST">
                <div class="shadow overflow-hidden w-full sm:rounded-md">
                    <div class="px-4 py-5 bg-white sm:p-6">
                        <div class="grid grid-cols-6 gap-6">
                            <div class="col-span-6 sm:col-span-4">
                                <label
                                    htmlFor="title"
                                    class="block text-sm font-medium text-gray-700"
                                >
                                    Title
                              </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={title}
                                    onChange={(e) => { setTitle(e.target.value) }}
                                    autoComplete="title"
                                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <div class="col-span-6 sm:col-span-4">
                                <label
                                    htmlFor="content"
                                    class="block text-sm font-medium text-gray-700"
                                >
                                    Message/Content
                              </label>
                                <textarea
                                    type="text"
                                    name="content"
                                    id="content"
                                    value={content}
                                    onChange={(e) => { setContent(e.target.value) }}
                                    autoComplete="content"
                                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                            type="submit"
                            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </form>




        </div>
    );
}
