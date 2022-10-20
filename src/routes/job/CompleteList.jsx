
const jobs = [
    { id: 1,
      purchaseOrder: '20221014-1',
      customer: 'Jet Edge',
      requestDate: '09/29/2022 09:50 PM',
      tailNumber: 'N334JE',
       aircraftType: 'Hawker 850',
        airport: 'FLL',
        fbo: 'Jet Aviation',
        estimatedArrival: '09/29/2022 09:50 PM',
        estimatedDeparture: '09/29/2022 09:50 PM',
        completeBy: '09/29/2022 09:50 PM',
        services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
        retainerServices: [],
        status: 'C',
        price: '$1,215.00',
        requestedBy: 'Joel Martinez',
        photosCount: 15,
        commentsCount: 6
     },
     { id: 2,
        purchaseOrder: '20221014-1',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}],
          status: 'C',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 3,
        purchaseOrder: '20221014-1',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}],
          status: 'C',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 4,
        purchaseOrder: '20221014-1',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [],
          status: 'C',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 5,
        purchaseOrder: '20221014-1',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'C',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 6,
        purchaseOrder: '20221014-1',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'C',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 7,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [],
          status: 'C',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 8,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'C',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 9,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'C',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 10,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [],
          status: 'C',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 11,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 12,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 13,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 14,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 15,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 16,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 17,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 18,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 19,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 20,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 21,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 22,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 23,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
       { id: 24,
        purchaseOrder: 'PO-123',
        customer: 'Jet Edge',
        requestDate: '09/29/2022 09:50 PM',
        tailNumber: 'N334JE',
         aircraftType: 'Hawker 850',
          airport: 'FLL',
          fbo: 'Jet Aviation',
          estimatedArrival: '09/29/2022 09:50 PM',
          estimatedDeparture: '09/29/2022 09:50 PM',
          completeBy: '09/29/2022 09:50 PM',
          services: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          retainerServices: [{id: 1, name: 'Basic interior'}, {id: 2, name: 'Basic detailing'}, {id: 3, name: 'Basic exterior'}],
          status: 'I',
          price: '$1,215.00',
          requestedBy: 'Joel Martinez',
          photosCount: 15,
          commentsCount: 6
       },
  ]


const CompleteList = () => {

    return (
        <div className="-mt-8 text-sm overflow-x-hidden">
            <div>
                Title and Search header
            </div>
            <div>
                subheader
            </div>
            <div className="mt-2 flex flex-col pb-28">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                        <tr className="divide-x divide-gray-200">
                            <th scope="col" className="p-2 text-left text-xs  text-gray-600">
                            
                            </th>
                            <th scope="col" className="p-2 text-left text-xs  text-gray-600">
                            Purchase Order
                            </th>
                            <th scope="col" className="p-2 text-left text-xs text-gray-600">
                            Customer
                            </th>
                            <th scope="col" className="p-2 text-left text-xs text-gray-600">
                            Request Date
                            </th>
                            <th scope="col" className="p-2  text-left text-xs text-gray-600">
                            Tail Number
                            </th>
                            <th scope="col" className="p-2  text-left text-xs  text-gray-600">
                            Aircraft Type
                            </th>
                            <th scope="col" className="p-2  text-left text-xs  text-gray-600 ">
                            Airport
                            </th>
                            <th scope="col" className="p-2 text-left text-xs  text-gray-600 ">
                            FBO
                            </th>
                            <th scope="col" className="p-2 text-left text-xs  text-gray-600 ">
                            Arrival Date
                            </th>
                            <th scope="col" className="p-2 text-left text-xs  text-gray-600 ">
                            Departure Date
                            </th>
                            <th scope="col" className="p-2 text-left text-xs  text-gray-600 ">
                            Completed Date
                            </th>
                            <th scope="col" className="p-2 text-left text-xs text-gray-600 ">
                            Services
                            </th>
                            <th scope="col" className="p-2 text-left text-xs  text-gray-600 ">
                            Retainer Services
                            </th>
                            <th scope="col" className="p-2 text-left text-xs  text-gray-600 ">
                            Status
                            </th>
                            <th scope="col" className="p-2 text-left text-xs  text-gray-600 ">
                            Price
                            </th>
                            <th scope="col" className="p-2 text-left text-xs  text-gray-600 ">
                            Comments
                            </th>
                            <th scope="col" className="p-2 text-left text-xs  text-gray-600 ">
                            Photos
                            </th>
                            <th scope="col" className="p-2 text-left text-xs  text-gray-600 ">
                            
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {jobs.map((job, index) => (
                            <tr key={job.id} className="divide-x divide-gray-200">
                            <td className="whitespace-nowrap p-2 text-xs text-gray-700">
                                {index + 1}
                            </td>
                            <td className="whitespace-nowrap p-2 text-xs text-gray-700">
                                {job.purchaseOrder}
                            </td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500">{job.customer}</td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500">{job.requestDate}</td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">{job.tailNumber}</td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">{job.aircraftType}</td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">{job.airport}</td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">{job.fbo}</td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">{job.estimatedArrival}</td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">{job.estimatedDeparture}</td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">{job.completeBy}</td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">
                                {job.services.map((service) => (
                                    <div key={service.id} className="bg-gray-100 rounded-md pl-1" style={{ marginBottom: '3px' }}>{service.name}</div>
                                ))}
                            </td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">
                                {job.retainerServices.map((service) => (
                                    <div key={service.id} className="bg-gray-100 rounded-md pl-1" style={{ marginBottom: '3px' }}>{service.name}</div>
                                ))}
                            </td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">
                                <p className={`inline-flex text-xs text-white rounded-md py-1 px-2
                                                ${job.status === 'C' && 'bg-green-500 '}
                                                ${job.status === 'T' && 'bg-black '}
                                                ${job.status === 'I' && 'bg-blue-500 '}
                                                `}>
                                    {job.status === 'C' && 'Completed'}
                                    {job.status === 'T' && 'Cancelled'}
                                    {job.status === 'I' && 'Invoiced'}
                                </p>
                            </td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">{job.price}</td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">{job.commentsCount}</td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">{job.photosCount}</td>
                            <td className="whitespace-nowrap p-1 text-xs text-gray-500 sm:pr-6">
                                {job.status === 'C' && (
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded border
                                            border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium
                                            text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2
                                            focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Invoice
                                    </button>
                                )}
                                
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default CompleteList;