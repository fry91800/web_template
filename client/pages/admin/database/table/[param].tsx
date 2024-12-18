import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DataTable from '../../../../components/DataTable/DataTable'

const AdminParamPage = () => {
    const { query } = useRouter();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        console.log('query.param:', query.param);  // Check if param is available
        if (query.param) {
            fetch(`http://localhost:3001/database/read/${query.param}`)
                .then((res) => {
                    console.log('Response status:', res.status);  // Check HTTP status
                    console.log(typeof res);
                    return res.json();
                })
                .then(result => {
                    console.log('Fetched data:', result);  // Check fetched data
                    setData(result.data)
                })
                .catch((err) => {
                    console.error('Fetch error:', err);
                });
        }
    }, [query.param]);

    useEffect(() => {
        console.log('Updated data:', typeof data); // Logs data after state update
        setData(data)
    }, [data]);

    return (
        <div>
            <h1>Parameter: {query.param}</h1>
            {data ? <DataTable data={data} /> : <p>No data available</p>}
        </div>
    );
};

export default AdminParamPage;
