import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export async function getServerSideProps(context: any) {
  try {
    const res = await fetch('http://localhost:3001/database/', {
      method: 'GET',
      credentials: 'include', // Ensure cookies are sent
      headers: {
        // Ok so the cookies won't be sent automatically because we are on the server-side
        // We need to get them from the browser and pass them to the back end
        // This was horrible to fix and deserve a long comment
        Cookie: context.req.headers.cookie || '', // Pass cookies in request header if needed
      }
    });

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
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <div>
      <h1>Hello, Next.js and Express!</h1>
      <p>Welcome!</p>
      <h2>Tables:</h2>
      <ul>
        {tables.map((table: Table, index: number) => (
          <li key={table.tableName}>
            <Link href={`${currentPath}/table/${table.tableName}`}>
              {table.tableName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
