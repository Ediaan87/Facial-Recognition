import React, { useState } from 'react';
import { useAction } from '@wasp/actions';
import createSearch from '@wasp/actions/createSearch';

export function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const createSearchFn = useAction(createSearch);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setError(null);
      return;
    }

    const allowedTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);
      setError('Invalid file type');
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    createSearchFn(formData)
      .then(() => {
        setSelectedFile(null);
        setError(null);
      })
      .catch((error) => {
        setError('Error uploading file');
      });
  };

  return (
    <div className='p-4'>
      <h1 className='text-xl font-semibold mb-4'>Upload an Image</h1>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      <input type='file' accept='image/gif, image/jpeg, image/png' onChange={handleFileChange} className='mb-4' />
      <button
        onClick={handleUpload}
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Upload
      </button>
    </div>
  );
}