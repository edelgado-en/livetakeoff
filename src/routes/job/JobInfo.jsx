
const fields = [
    { name: 'Status', value: 'Assigned' },
    { name: 'Customer', value: 'Jet Edge' },
    { name: 'Tail Number', value: 'N334JE' },
    { name: 'Aircraft Type', value: 'Lear 35' },
    { name: 'FBO', value: 'Jet Aviation' },
    { name: 'Airport', value: 'FLL' },
    { name: 'Request Date', value: 'Sept 14 9:07 AM' },
    { name: 'Complete by', value: 'Sept 16 9:07 AM' },
    { name: 'Estimated ETA', value: 'Sept 15 9:07 AM' },
    { name: 'Estimated ETD', value: 'Sept 16 9:07 AM' },
]

const services = [
    { id: 1, name: 'Leather shampoo' },
    { id: 2, name: 'Exterior detailing (Full wet or dry wash)' },
    { id: 3, name: 'Exterior Takeoff Ready (Quick Turn)' },
    { id: 4, name: 'Interior detailing' },
]

const assignees = [
    { id: 1, name: 'Wilson Lizarazo'},
    { id: 2, name: 'Belkis Grinan'},
]

const JobInfo = () => {
    return (
        <div>
            <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="mt-8 mb-8">
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                    >
                    Accept Job
                </button>
                </div>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                {fields.map((field) => (
                    <div key={field.id} className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">{field.name}</dt>
                    <dd className="mt-1 text-sm text-gray-900">{field.value}</dd>
                    </div>
                ))}
                <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Special Instructions</dt>
                    <dd
                    className="mt-1 max-w-prose space-y-5 text-sm text-gray-900"
                    
                    >
                    Must leave the WU certificate of completion before leaving the airplane
                    </dd>
                </div>
                </dl>
                <div className="mx-auto mt-8 max-w-5xl pb-12">
                    <h2 className="text-sm font-medium text-gray-500">Services</h2>
                    <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {services.map((service) => (
                        <div
                            key={service.id}
                            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-pink-500 focus-within:ring-offset-2 hover:border-gray-400"
                        >
                            <div className="min-w-0 flex-1">
                            <div className="focus:outline-none">
                                <span className="absolute inset-0" aria-hidden="true" />
                                <p className="text-sm font-medium text-gray-900">{service.name}</p>
                            </div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobInfo;