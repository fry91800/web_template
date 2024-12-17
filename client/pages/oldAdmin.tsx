import React from 'react';
import Link from 'next/link';

export async function getServerSideProps() {
  try {
    const res = await fetch('http://localhost:3001/database/read');
    const data = await res.json();

    return {
      props: {
        test: data,  // Pass the fetched data as a prop
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        test: { name: 'Error fetching data' }, // Fallback data in case of error
      },
    };
  }
}


interface Table {
  tableName: string;
  columns: any[];
  data: any[];
}

interface TestData {
  config: any;
  tables: Table[];
}

interface Props {
  test: { data: TestData };
}

const Home: React.FC<Props> = ({ test }: any) => {
  const tables = test?.data?.database?.tables || [];

  return (
    <div>
      <h1>Hello, Next.js and Express!</h1>
      <p>Welcome!</p>
      <h2>Tables:</h2>
      <ul>
        {tables.map((table: Table, index: number) => (
          <li key={table.tableName}>
            <Link href={`/${table.tableName}`}>
              {table.tableName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
