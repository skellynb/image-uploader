import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function FileUploader() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);

      const res = await axios.post('http://localhost:3001/api/upload', formData);

      setUploadedUrl(res.data.url); // e.g., /uploads/filename.jpg
      setUploadedFileName(file.name);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // Extract just the file name from the uploaded URL
  const downloadFileName = uploadedUrl.split('/').pop();

  return (
     
  <div className="flex items-center justify-center w-[450px] h-[300px] bg-white rounded shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
    <div className='flex items-center border border-dashed border-[#f0f0f3]  rounded w-[440px] h-[290px]'>
    <div className="p-4 max-w-md mx-auto  rounded-lg">
      <div
        {...getRootProps()}
        className="p-6 text-center cursor-pointer  rounded hover:bg-gray-200 transition flex flex-col items-center justify-center gap-1"
      >
        <img
        src="/exit.svg"
        alt="Logo"
        className="top-4 left-4 w-[30px] h-auto mb-4"
      />
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-700">Drop the file here ...</p>
        ) : (
          <p className="text-black font-[500] text-sm">Drag & drop a file or <span className='text-blue-600'>browse files</span></p>
          
        )
        }
        <p className='text-xs text-gray-400'>JPG, PNG or GIF-Max file size 2MB</p>
      </div>
          
        </div>
      {previewUrl && (
        <div className="mt-4">
          <img src={previewUrl} alt="Preview" className="w-48 h-auto rounded shadow" />
        </div>
      )}

      {uploading && <p className="mt-2 text-blue-500">Uploading...</p>}

      {uploadedUrl && (
        <div className="mt-4 space-y-2">
          <p className="text-green-600">Uploaded: {uploadedFileName}</p>
          <a
            href={`http://localhost:3001/api/download/${downloadFileName}`}
            download
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Download File
          </a>
        </div>
      )}
    </div>
    </div>
  );
}
