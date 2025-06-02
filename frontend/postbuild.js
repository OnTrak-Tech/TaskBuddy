const fs = require('fs');
const path = require('path');

// Function to process HTML files and add Tailwind CDN
function processHtmlFiles(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      processHtmlFiles(filePath); // Recursively process subdirectories
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Check if Tailwind CDN is already included
      if (!content.includes('tailwindcss@2.2.19')) {
        // Add Tailwind CDN link before the first </head> tag
        content = content.replace('</head>', 
          '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">\n</head>');
        
        fs.writeFileSync(filePath, content);
        console.log(`Added Tailwind CDN to ${filePath}`);
      }
    }
  });
}

// Start processing from the out directory
const outDir = path.join(__dirname, 'out');
console.log('Processing HTML files to add Tailwind CDN...');
processHtmlFiles(outDir);
console.log('Processing complete!');