import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DataTable from '../../../../components/DataTable'

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
                    const formattedData = { headers: [] as string[], data: [] as Record<string, any>[] };
                    if (result?.data?.table) {
                        for (const column of result.data.table.columns)
                            formattedData.headers.push(column.name)
                        formattedData.data = [{ 'id': 1, "email": "a@a.com", "pass": "1234" }]
                        console.log(formattedData)
                        const test = { data: formattedData }

                        console.log(test.data)
                        setData(DataTable(test.data))
                    }
                })
                .catch((err) => {
                    console.error('Fetch error:', err);
                });
        }
    }, [query.param]);

    useEffect(() => {
        console.log('Updated data:', typeof data); // Logs data after state update
    }, [data]);

    return (
        <div>
            <h1>Parameter: {query.param}</h1>
            <pre>{data}</pre>
        </div>
    );
};

export default AdminParamPage;
