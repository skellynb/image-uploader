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
       console.log('Response from backend:', JSON.stringify(res.data, null, 2));

      setUploadedUrl(res.data.url);
      setUploadedFileName(file.name);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const downloadFileName = uploadedUrl.split('/').pop();

  return (
    <div className="flex items-center justify-center w-[450px] h-[300px] bg-white rounded shadow-[0_10px_40px_rgba(0,0,0,0.3)] relative">
      <div className="w-[440px] h-[290px] border border-dashed border-[#f0f0f3] rounded flex items-center justify-center p-4 relative overflow-hidden">
        
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        )}

        {!uploadedUrl ? (
          <div
            {...getRootProps()}
            className="w-full h-full flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition rounded"
          >
            <img
              src="/exit.svg"
              alt="Logo"
              className="w-[30px] h-auto mb-4"
            />
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-gray-700">Drop the file here ...</p>
            ) : (
              <p className="text-black font-medium text-sm">
                Drag & drop a file or <span className="text-blue-600">browse files</span>
              </p>
            )}
            <p className="text-xs text-gray-400">JPG, PNG or GIF - Max file size 2MB</p>

            {previewUrl && !uploadedUrl && (
              <div className="mt-4">
                <img src={previewUrl} alt="Preview" className="w-40 h-auto rounded shadow" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 w-full">
            <img
              src={`http://localhost:3001${uploadedUrl}`}
              alt="Uploaded"
              className="w-40 h-auto rounded shadow"
            />
            <p className="text-sm text-gray-600">Uploaded: {uploadedFileName}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`http://localhost:3001${uploadedUrl}`);
                  alert('Image URL copied!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Share
              </button>
              <a
                href={`http://localhost:3001/api/download/${downloadFileName}`}
                download
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
