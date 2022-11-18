
import ReactTimeAgo from 'react-time-ago'

const JobComments = ({ comments }) => {

    return (
        <div className="">
            <div className="flex flex-row">
                <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-gray-600 relative top-1">Comments</h1>
                </div>
            </div>
            <div className="my-4">
                <div className="mt-8 flex flex-col pr-1 pb-8" style={{ maxHeight: '450px', overflowY: 'auto' }}>
                    <ul className="space-y-8">
                    {comments.map((comment) => (
                        <li key={comment.id} className="hover:bg-gray-50 pt-1">
                            <div className="flex space-x-3">
                                <div className="flex">
                                    <div className="w-12 text-center">
                                        {comment.author.profile.avatar ? 
                                        <img className="h-10 w-10 rounded-full" src={comment.author.profile.avatar } alt="" />
                                            :
                                            <div className="w-10" style={{ lineHeight: '36px', borderRadius: '50%',
                                                                    fontSize: '15px', background: '#959aa1', color: '#fff' }}>
                                            {comment.author.username.slice(0,2).toUpperCase()}
                                        </div>
                                        }
                                    </div>
                                </div>
                                <div className="w-full pr-4">
                                    <div className="text-sm flex justify-between">
                                        <div className="font-medium text-gray-700">
                                        {comment.author.first_name} {' '} {comment.author.last_name}
                                        </div>
                                        
                                    </div>
                                    <div className="mt-1 text-sm text-gray-700">
                                        <p>{comment.comment}</p>
                                    </div>
                                    <div className="mt-2 space-x-2 text-sm">
                                        <span className="font-medium text-gray-500">
                                        <ReactTimeAgo date={new Date(comment.created)} locale="en-US" timeStyle="twitter" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default JobComments;