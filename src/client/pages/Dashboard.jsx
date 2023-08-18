import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import getUserPictures from '@wasp/queries/getUserPictures';
import getPictureResults from '@wasp/queries/getPictureResults';
import uploadPicture from '@wasp/actions/uploadPicture';

export function DashboardPage() {
  const { data: pictures, isLoading: picturesLoading, error: picturesError } = useQuery(getUserPictures);
  const { data: results, isLoading: resultsLoading, error: resultsError } = useQuery(getPictureResults);
  const uploadPictureFn = useAction(uploadPicture);
  const [selectedPicture, setSelectedPicture] = useState(null);

  useEffect(() => {
    getUserPictures();
    getPictureResults();
  }, []);

  const handlePictureUpload = async (event) => {
    const file = event.target.files[0];
    const picturePromise = new Promise((resolve) => resolve(file));
    await uploadPictureFn({ picturePromise });
    getUserPictures();
    getPictureResults();
  };

  if (picturesLoading || resultsLoading) return 'Loading...';
  if (picturesError || resultsError) return 'Error: ' + (picturesError || resultsError);

  return (
    <div className="p-4">
      <input type="file" onChange={handlePictureUpload} />

      <div>
        {pictures.map((picture) => (
          <div key={picture.id} className="bg-gray-100 p-4 mb-4 rounded-lg">
            <img src={picture.url} alt="User's Picture" className="w-64 h-64 object-cover" />

            <div>
              {results[picture.id] ? (
                <div>
                  <h2>Facial Recognition Results:</h2>
                  {results[picture.id].map((result) => (
                    <a
                      key={result.id}
                      href={result.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {result.url}
                    </a>
                  ))}
                </div>
              ) : (
                <div>No facial recognition results found.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}