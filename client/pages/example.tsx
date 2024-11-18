import React from 'react';

// This is where the data from Express will be fetched
// This is the updated `getServerSideProps` to fetch data from the Express endpoint
export async function getServerSideProps() {
  try {
    const res = await fetch('http://localhost:3001/data');
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

const Home: React.FC = ({ test }: any) => {
  return (
    <div>
      <h1>Hello, Next.js and Express!</h1>
      <p>Welcome, {test?.name || 'Guest'}!</p>
    </div>
  );
};

export default Home;
