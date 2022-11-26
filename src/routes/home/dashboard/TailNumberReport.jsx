import { useEffect, useState } from "react"

import * as api from './apiService'

const TailNumberReport = () => {
    const [loading, setLoading] = useState()
    const [tailStats, setTailStats] = useState([])

    useEffect(() => {
        searchTailStats()

    }, [])

    const searchTailStats = async () => {
        setLoading(true)

        const request = {
            'searchText': '',
            'sortDirection': 'desc'
        }

        try {
            const { data } = await api.searchTailStats(request, 1)

            console.log(data);

            const response = await api.getTailStatsDetails(data.results[0].tailNumber)

            console.log(response.data);

            setLoading(false)

        } catch (error) {
            setLoading(false)
        }
    }

    return (
        <div></div>
    )
}

export default TailNumberReport