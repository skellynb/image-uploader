import { useState, useEffect } from 'react';
import FileUploader from './pages/FileUploader';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(savedTheme !== null ? JSON.parse(savedTheme) : systemPrefersDark);
  }, []);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (darkMode) {
      htmlElement.classList.add('dark');
      htmlElement.style.colorScheme = 'dark';
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.style.colorScheme = 'light';
    }
    // localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen w-full bg-[#f9fafc] dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 max-w-screen-lg mx-auto">
        <div className="flex items-center space-x-2 font-bold">
          <img
            src="/logo-small.svg"
            alt="Logo"
            className="w-5 h-auto"
          />
          <h1 className="text-black dark:text-white text-lg">ImageUpload</h1>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-10 h-10 bg-white dark:bg-gray-700 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm..." clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          )}
        </button>
      </div>

      <hr className="border-[#f0f0f3] dark:border-[#f0f0f3] max-w-screen-lg mx-auto" />

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-10 sm:py-16 md:py-20 lg:py-24 min-h-[70vh] max-w-screen-lg mx-auto">
        <FileUploader />
      </main>
    </div>
  );
}

export default App;
