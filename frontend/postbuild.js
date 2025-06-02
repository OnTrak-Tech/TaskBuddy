const fs = require('fs');
const path = require('path');

// Function to process HTML files and add inline styles
function processHtmlFiles(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      processHtmlFiles(filePath); // Recursively process subdirectories
    } else if (file.endsWith('.html') && file !== 'index.html' && file !== '404.html') {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Add basic styles to ensure the page looks good
      if (!content.includes('<style>')) {
        const styleTag = `
<style>
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9fafb;
  }
  .layout {
    display: flex;
    min-height: 100vh;
  }
  .sidebar {
    width: 16rem;
    background-color: #4f46e5;
    color: white;
    display: flex;
    flex-direction: column;
  }
  .sidebar-header {
    display: flex;
    align-items: center;
    height: 4rem;
    padding: 0 1rem;
    background-color: #4338ca;
  }
  .sidebar-title {
    margin-left: 0.75rem;
    font-size: 1.25rem;
    font-weight: 700;
  }
  .sidebar-content {
    flex: 1;
    padding: 1rem;
  }
  .main-content {
    flex: 1;
    overflow: auto;
  }
  .header {
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
    padding: 1rem;
  }
  .content {
    padding: 1.5rem;
  }
  .card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .btn {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
  }
  .btn-primary {
    background-color: #4f46e5;
    color: white;
  }
  .btn-primary:hover {
    background-color: #4338ca;
  }
  .form-group {
    margin-bottom: 1rem;
  }
  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  .form-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
  }
</style>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;
        
        content = content.replace('</head>', `${styleTag}\n</head>`);
        fs.writeFileSync(filePath, content);
        console.log(`Added inline styles to ${filePath}`);
      }
    }
  });
}

// Start processing from the out directory
const outDir = path.join(__dirname, 'out');
console.log('Processing HTML files to add inline styles...');
processHtmlFiles(outDir);
console.log('Processing complete!');