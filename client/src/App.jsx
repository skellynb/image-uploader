import { useState, useEffect } from 'react';
import FileUploader from './pages/FileUploader';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference and saved preference on mount
    const savedTheme = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      setDarkMode(systemPrefersDark);
    }
  }, []);

  useEffect(() => {
    // For Tailwind v4+, we need to set the color-scheme and dark class
    const htmlElement = document.documentElement;
    
    if (darkMode) {
      htmlElement.classList.add('dark');
      htmlElement.style.colorScheme = 'dark';
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.style.colorScheme = 'light';
    }
    
    // Save theme preference 
    // localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);


  return (
    <div className="min-h-screen bg-[#f9fafc] dark:bg-gray-900 text-gray-900 dark:text-white p-8 relative transition-colors duration-300">
      {/* Top-left Logo */}
      <div className='flex space-x-2 font-bold'>
      <img
        src="/logo-small.svg"
        alt="Logo"
        className="top-4 left-4 w-[20px] h-auto"
      />
      <h1 className="text-black dark:text-white">ImageUpload</h1>
      </div>
     
      {/* Top-right Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-6 right-8 w-10 h-10 bg-white dark:bg-gray-700 rounded flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>
      <hr className='mt-4 border-[#f0f0f3]  my-4 dark:border-[#f0f0f3]'></hr>
      {/* Main Content */}
      <div className="flex items-center justify-center pt-20 ">        <FileUploader />
      </div>
    </div>
  );
}

export default App;
