import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getSearchResults from '@wasp/queries/getSearchResults';

export function SearchResults() {
  const { searchId } = useParams();
  const { data: results, isLoading, error } = useQuery(getSearchResults, { searchId });

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  return (
    <div className='p-4'>
      {results.map((result) => (
        <div key={result.id} className='flex items-center bg-gray-100 p-4 mb-4 rounded-lg'>
          <img src={result.imageUrl} alt='Result' className='w-32 h-32 mr-4' />
          <div>
            <a href={result.sourceUrl} target='_blank' rel='noopener noreferrer'>
              {result.sourceUrl}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}