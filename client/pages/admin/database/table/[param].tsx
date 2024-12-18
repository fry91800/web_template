import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DataTable from '../../../../components/DataTable/DataTable'
import { table } from 'console';

const AdminParamPage = () => {
    const { query } = useRouter();
    const [data, setData] = useState<any>(null);
  
    const handleDelete = async (id: string) => {
        const request = {
            type: "delete",
            table: query.param,
            data: [{id}]
        }
        const response = await fetch("http://localhost:3001/database/write", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(request), // Send the id to delete
          });
          console.log(response)
        // Create a deep copy of the alteredData object to avoid mutating the original
        const newData = JSON.parse(JSON.stringify(data)); // or use cloneDeep if using lodash
      
        // Remove the data entry where id matches the provided id
        newData.table.data = newData.table.data.filter((row: any) => row.id !== id);
      
        // Now you can set the state with the new modified data
        setData(newData);
      };

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
            {data ? <DataTable data={data} handleDelete={handleDelete} /> : <p>No data available</p>}
        </div>
    );
};

export default AdminParamPage;
