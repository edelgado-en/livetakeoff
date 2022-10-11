
import { useState } from "react";

import AnimatedPage from "../../components/animatedPage/AnimatedPage";

const notificationMethods = [
  { id: 'email', title: 'No' },
  { id: 'sms', title: 'Yes' },
]

const comments = [
    {
      id: 1,
      name: 'Robeidy Ortiz',
      initials: 'SL',
      date: '4d ago',
      body: 'Ducimus quas delectus ad maxime totam doloribus reiciendis ex. Tempore dolorem maiores. Similique voluptatibus tempore non ut.',
    },
    {
      id: 2,
      name: 'Yoandi Perez',
      initials: 'GA',
      date: '4d ago',
      body: 'Et ut autem. Voluptatem eum dolores sint necessitatibus quos. Quis eum qui dolorem accusantium voluptas voluptatem ipsum. Quo facere iusto quia accusamus veniam id explicabo et aut.',
    },
    {
      id: 3,
      name: 'Enrique Delgado',
      initials: 'ED',
      date: '4d ago',
      body: 'Expedita consequatur sit ea voluptas quo ipsam recusandae. Ab sint et voluptatem repudiandae voluptatem et eveniet. Nihil quas consequatur autem. Perferendis rerum et.',
    },
    {
        id: 4,
        name: 'Mila Delgado',
        initials: 'TW',
        date: '4d ago',
        body: 'Expedita consequatur sit ea voluptas quo ipsam recusandae. Ab sint et voluptatem repudiandae voluptatem et eveniet. Nihil quas consequatur autem. Perferendis rerum et.',
      },
      {
        id: 5,
        name: 'John Smith',
        initials: 'DV',
        date: '4d ago',
        body: 'Expedita consequatur sit ea voluptas quo ipsam recusandae. Ab sint et voluptatem repudiandae voluptatem et eveniet. Nihil quas consequatur autem. Perferendis rerum et.',
      },
  ]

const JobComments = () => {
    const [comment, setComment] = useState('')  

    const handleStatusChange = (status) => {
        console.log(status)
    }

    const handleCommentChange = (event) => [
        setComment(event.target.value)
    ]

    return (
      <AnimatedPage>
        <div className="mt-8">
                <div className="flex flex-row">
                    <div className="flex-1">
                        <div className="leading-6 font-medium text-gray-600">Comments</div>
                    </div>
                </div>
                <div className="my-4">
                    <div className="mt-8 flex flex-col pr-1" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                    <ul className="space-y-8">
                        {comments.map((comment) => (
                          <li key={comment.id}>
                            <div className="flex space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-12 text-center">
                                    <div className="w-10" style={{ lineHeight: '36px', borderRadius: '50%',
                                                                fontSize: '15px', background: '#959aa1', color: '#fff' }}>
                                        {comment.initials}
                                    </div>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm">
                                  <div className="font-medium text-gray-700">
                                    {comment.name}
                                  </div>
                                </div>
                                <div className="mt-1 text-sm text-gray-700">
                                  <p>{comment.body}</p>
                                </div>
                                <div className="mt-2 space-x-2 text-sm">
                                  <span className="font-medium text-gray-500">{comment.date}</span>{' '}
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gray-50 px-2 py-6 xs:px-2">
                      <div className="flex space-x-3">
                        <div className="min-w-0 flex-1">
                            <div className="flex">
                              <textarea
                                id="comment"
                                name="comment"
                                rows={2}
                                value={comment}
                                onChange={handleCommentChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm
                                          focus:border-blue-400 focus:ring-sky-400 sm:text-sm max-h-20"
                                placeholder="Add a comment..."
                              />
                            </div>

                            { comment.length > 0 && (
                              <div className="mt-3 flex items-center justify-between">
                              <div className="pr-8 flex">
                                <div className="text-sm mb-1 mr-4 relative" style={{top: '1px' }}>Customer Visible:</div>
                                <div className="flex items-center space-y-0 space-x-5">
                                  {notificationMethods.map((notificationMethod) => (
                                    <div key={notificationMethod.id} className="flex items-center">
                                      <input
                                        id={notificationMethod.id}
                                        name="notification-method"
                                        type="radio"
                                        defaultChecked={notificationMethod.id === 'email'}
                                        className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-500"
                                      />
                                      <label htmlFor={notificationMethod.id} className="ml-3 block text-sm text-gray-600">
                                        {notificationMethod.title}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-md
                                          border border-transparent bg-red-600 px-2 py-1 text-sm
                                          text-white shadow-sm hover:bg-red-700 focus:outline-none
                                          focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                              >
                                Post
                              </button>
                            </div>
                            ) }
                            
                        </div>
                      </div>
                    </div>
                </div>
            </div>
      </AnimatedPage>
    )
}

export default JobComments;