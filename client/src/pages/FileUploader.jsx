import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export default function FileUploader() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [copied, setCopied] = useState(false);
  const [showLink, setShowLink] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await axios.post('http://localhost:3001/api/upload', formData);
      setUploadedUrl(res.data.url);
      setUploadedFileName(file.name);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleShareClick = () => {
    setShowLink(true);
  };

  const handleCopy = async () => {
    if (!uploadedUrl) return;
    const url = `${window.location.origin}${uploadedUrl}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const downloadFileName = uploadedUrl.split('/').pop();

   return (
    <div className="flex items-center justify-center px-4 py-6 w-full min-h-screen">
  <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white rounded shadow-[0_10px_40px_rgba(0,0,0,0.1)] p-4 md:p-6 border border-dashed border-gray-200 relative">
    {uploading && (
      <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center z-10">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
        <p className="text-sm text-gray-600">Uploading...</p>
      </div>
    )}

    {!uploadedUrl ? (
      <div
        {...getRootProps()}
        className="w-full min-h-[250px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition rounded px-2 py-6"
      >
        <img src="/exit.svg" alt="Logo" className="w-8 h-auto mb-4" />
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-700 text-base sm:text-sm">Drop the file here ...</p>
        ) : (
          <p className="text-black font-medium text-sm sm:text-base">
            Drag & drop a file or <span className="text-blue-600">browse files</span>
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF - Max file size 2MB</p>

        {previewUrl && (
          <div className="mt-4">
            <img src={previewUrl} alt="Preview" className="w-40 h-auto rounded shadow" />
          </div>
        )}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <img
          src={`http://localhost:3001${uploadedUrl}`}
          alt="Uploaded"
          className="w-40 h-auto rounded shadow"
        />
        <p className="text-sm text-gray-600 text-center px-2">Uploaded: {uploadedFileName}</p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <button
            onClick={handleShareClick}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
          >
            Share
          </button>
          <a
            href={`http://localhost:3001/api/download/${downloadFileName}`}
            download
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm text-center"
          >
            Download
          </a>
        </div>

        {showLink && (
          <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded-lg w-full text-center">
            <p className="text-sm font-medium text-green-800 mb-2">Share this link:</p>
            <code className="text-sm text-black break-words bg-white px-2 py-1 rounded border block w-full">
              {`${window.location.origin}${uploadedUrl}`}
            </code>
            <button
              onClick={handleCopy}
              className="mt-2 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition"
            >
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
        )}
      </div>
    )}
  </div>
</div>

  );
}