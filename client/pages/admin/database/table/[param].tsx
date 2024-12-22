import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import RawDataTable from '../../../../components/DataTable/RawDataTable'
import RawDataTableNewButton from '../../../../components/DataTable/RawDataTableNewButton'
import RawDataTableForm from '../../../../components/DataTable/RawDataTableForm'
import { table } from 'console';

function RawDataTablePage() {
    const { query } = useRouter();
    //TODO define a type for that!
    const [data, setData] = useState<{ columns: any[]; data: any[] } | null>(null);

    // const handleDelete = async (id: string) => {
    //     const request = {
    //         type: "delete",
    //         table: query.param,
    //         data: [{id}]
    //     }
    //     const response = await fetch("http://localhost:3001/database/write", {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(request),
    //       });
    //       console.log(response)
    //     const newData = JSON.parse(JSON.stringify(data));
    //     newData.table.data = newData.table.data.filter((row: any) => row.id !== id);
    //     setData(newData);
    //   };

    useEffect(() => {
        const UserDataMockUp = {
            "status": "success",
            "data": {
                "tableName": "User",
                "columns": [
                    {
                        "name": "id",
                        "type": "UUID"
                    },
                    {
                        "name": "email",
                        "type": "CHARACTER VARYING(255)"
                    },
                    {
                        "name": "pass",
                        "type": "CHARACTER VARYING(255)"
                    },
                    {
                        "name": "createdAt",
                        "type": "TIMESTAMP WITH TIME ZONE"
                    },
                    {
                        "name": "updatedAt",
                        "type": "TIMESTAMP WITH TIME ZONE"
                    }
                ],
                "data": [
                    {
                        "id": "dbbe6c2b-d4ac-4dcc-894b-978a9595d011",
                        "email": "test@gmail.com",
                        "pass": "$2b$10$R45iuwrSbb.zHXtX4wBIAu99KUmOir6RckKTiGDbJREzUANDiImAi",
                        "createdAt": "2024-12-22T00:38:08.417Z",
                        "updatedAt": "2024-12-22T00:38:08.417Z"
                    }
                ]
            }
        }
        setData(UserDataMockUp.data)
    }, [query.param]);

    const handleDelete = async (id: string) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData.data = newData.data.filter((row: any) => row.id !== id);
        setData(newData);
    };
    const handleInsert = async (object: any[]) => {
        const request = {
            type: "insert",
            table: query.param,
            data: [object]
        }
        const response = await fetch("http://localhost:3001/database/write", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });
        const responseJson = await response.json();
        if (responseJson.status !== "success") {
            return
        }
        const newObject = responseJson.data[0]
        const newData = JSON.parse(JSON.stringify(data));
        newData.data.push(newObject)
        setData(newData);
    };

    // useEffect(() => {
    //     console.log('query.param:', query.param);  // Check if param is available
    //     if (query.param) {
    //         fetch(`http://localhost:3001/database/read/${query.param}`)
    //             .then((res) => {
    //                 return res.json();
    //             })
    //             .then(result => {
    //                 console.log('Fetched data:', result);
    //                 setData(result.data)
    //             })
    //             .catch((err) => {
    //                 console.error('Fetch error:', err);
    //             });
    //     }
    // }, [query.param]);

    return (
        <div>
            <h1>{query.param}</h1>
            {data ? <RawDataTable data={data} handleDelete={handleDelete} /> : <p>Loading...</p>}
            {data && query.param ? <RawDataTableForm handleInsert={handleInsert} fields={data.columns} table={query.param} /> : <p>Loading...</p>}
        </div>
    );
};

export default RawDataTablePage;