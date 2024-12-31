import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import RawDataTable from '../../../../../components/DataTable/RawDataTable'
import RawDataTableNewButton from '../../../../../components/DataTable/RawDataTableNewButton'
import RawDataTableForm from '../../../../../components/DataTable/RawDataTableForm'
import { table } from 'console';

function RawDataTablePage() {
    const { query } = useRouter();
    //TODO define a type for that!
    const [data, setData] = useState<{ columns: any[]; data: any[] } | null>(null);
    const [file, setFile] = useState(null);

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file first!');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', "insert");
        formData.append('table', "User");
        const response = await fetch('http://localhost:3001/database/upload', {
            method: 'POST',
            body: formData,
        });

        const responseJson = await response.json();
        if (responseJson.status !== "success") {
            return
        }
        const responseData = responseJson.data
        console.log(responseJson)
        const newData = JSON.parse(JSON.stringify(data));
        newData.data = newData.data.concat(responseData)
        setData(newData);
    };

    const handleInsert = async (object: any) => {
        const response = await fetch(`http://localhost:3001/database/table/${query.param}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(object),
        });
        const responseJson = await response.json();
        if (responseJson.status !== "success") {
            return
        }
        const newObject = responseJson.data
        console.log(newObject)
        const newData = JSON.parse(JSON.stringify(data));
        newData.data.push(newObject)
        setData(newData);
    };

    const handleUpdate = async (update: any) => {
        const response = await fetch(`http://localhost:3001/database/table/${query.param}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(update),
        });
        const responseJson = await response.json();
        if (responseJson.status !== "success") {
            return false
        }
        console.log(responseJson)
        return responseJson.data
    };


    const handleDelete = async (id: string) => {
        console.log(id)
        const request = {
            type: "delete",
            table: query.param,
            data: { where: { id } }
        }
        const response = await fetch(`http://localhost:3001/database/table/${query.param}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });
        const responseJson = await response.json();
        console.log(responseJson)
        if (responseJson.status !== "success") {
            return
        }
        const newData = JSON.parse(JSON.stringify(data));
        newData.data = newData.data.filter((row: any) => row.id !== id);
        console.log(newData)
        setData(newData);
    };

    useEffect(() => {
        console.log('query.param:', query.param);  // Check if param is available
        if (query.param) {
            fetch(`http://localhost:3001/database/table/${query.param}`,
                {
                    credentials: 'include',
                }
            )
                .then((res) => {
                    return res.json();
                })
                .then(result => {
                    if (result.status === "success") {
                        console.log('Fetched data:', result);
                        setData(result.data)
                    }
                })
                .catch((err) => {
                    console.error('Fetch error:', err);
                });
        }
    }, [query.param]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            <h1>{query.param}</h1>
            {data ? <RawDataTable data={data} handleDelete={handleDelete} handleUpdate={handleUpdate} /> : <p>Loading...</p>}
            {data && query.param ? <RawDataTableForm handleInsert={handleInsert} fields={data.columns} table={query.param} /> : <p>Loading...</p>}
        </div>
    );
};

export default RawDataTablePage;