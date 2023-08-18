import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getPictureResults from '@wasp/queries/getPictureResults';

export function Results() {
  const { pictureId } = useParams();
  const { data: results, isLoading, error } = useQuery(getPictureResults, { id: pictureId });

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Facial Recognition Results</h1>
      <div>
        {results.map((result) => (
          <div key={result.id} className='bg-gray-100 p-4 mb-4 rounded-lg'>
            <img src={result.url} alt='Result' className='mb-4' />
            <div className='text-lg'>
              Found face at: <a href={result.link} target='_blank' rel='noopener noreferrer'>{result.link}</a>
            </div>
          </div>
        ))}
      </div>
      <Link to='/' className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Go Back</Link>
    </div>
  );
}