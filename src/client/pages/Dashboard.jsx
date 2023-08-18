import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getUserSearches from '@wasp/queries/getUserSearches';

export function DashboardPage() {
  const { data: searches, isLoading, error } = useQuery(getUserSearches);

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>My Searches</h1>
      {searches.map((search) => (
        <div
          key={search.id}
          className='flex items-center justify-between bg-gray-100 p-4 mb-4 rounded-lg'
        >
          <div>{search.imageUrl}</div>
          <div>
            <Link
              to={`/search/${search.id}`}
              className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2'
            >
              View Results
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}