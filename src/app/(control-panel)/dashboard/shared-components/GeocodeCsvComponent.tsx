// "use client"
// import React, { useState, useEffect, useRef } from 'react';
// import Papa from 'papaparse';
// import * as _ from 'lodash';
// import { GoogleMap, InfoWindow, useLoadScript } from '@react-google-maps/api';


// // Caches to improve performance and reduce API calls
// const geocodeCache = {};

// export default function GeocodeCsvComponent(){
//   const [file, setFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [results, setResults] = useState(null);
//   const [error, setError] = useState(null);
//   const [downloadReady, setDownloadReady] = useState(false);
//   const [columnHeaders, setColumnHeaders] = useState([]);
//   const [locationColumns, setLocationColumns] = useState({
//     region: 1, // Default to second column (index 1)
//     city: 0   // Default to first column (index 0)
//   });
  
//   // Map Libraries
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.MAP_KEY,
//     libraries: ['places', 'geometry']
//   });

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       parseHeaders(selectedFile);
//     }
//   };

//   const parseHeaders = (csvFile) => {
//     Papa.parse(csvFile, {
//       preview: 1, // Just read the first row
//       header: false,
//       complete: (results) => {
//         if (results.data && results.data[0]) {
//           setColumnHeaders(results.data[0]);
//         }
//       },
//       error: (error) => {
//         setError(`Error parsing headers: ${error.message}`);
//       }
//     });
//   };

//   // Geocode a single location
//   const geocodeLocation = async (region, city) => {
//     // Clean up and format the location
//     const cleanCity = city?.toString().trim() || "";
//     const cleanRegion = region?.toString().trim() || "";
    
//     // Skip if both are empty or (not set)
//     if (
//       (cleanCity === "" || cleanCity === "(not set)") && 
//       (cleanRegion === "" || cleanRegion === "(not set)")
//     ) {
//       return { lat: null, lng: null };
//     }
    
//     // Create a cache key
//     const cacheKey = `${cleanCity}|${cleanRegion}`;
    
//     // Check cache first
//     if (geocodeCache[cacheKey]) {
//       return geocodeCache[cacheKey];
//     }
    
//     // Build the geocoding query
//     let query = "";
//     if (cleanCity && cleanCity !== "(not set)") {
//       query += cleanCity;
//     }
    
//     if (cleanRegion && cleanRegion !== "(not set)") {
//       if (query) query += ", ";
//       query += cleanRegion;
//     }
    
//     // Add country bias toward USA if not specified
//     if (!query.includes("USA") && 
//         !query.includes("United States") && 
//         query.trim() !== "") {
//       query += ", USA";
//     }
    
//     if (!query.trim()) {
//       return { lat: null, lng: null };
//     }
    
//     try {
//       // Alternative approach: Use the existing function from MapComponent
//       // that's already working with your API key
//       if (window.google && window.google.maps && window.google.maps.Geocoder) {
//         const geocoder = new window.google.maps.Geocoder();
        
//         return new Promise((resolve) => {
//           geocoder.geocode({ address: query }, (results, status) => {
//             if (status === "OK" && results && results.length > 0) {
//               const position = results[0].geometry.location;
              
//               // Store in cache
//               geocodeCache[cacheKey] = {
//                 lat: position.lat(),
//                 lng: position.lng()
//               };
              
//               resolve({ lat: position.lat(), lng: position.lng() });
//             } else {
//               resolve({ lat: null, lng: null });
//             }
//           });
//         });
//       }
      
//       // Fallback to REST API if Google Maps JS API is not loaded
//       const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${process.env.MAP_KEY}`;
//       const response = await fetch(url);
//       const data = await response.json();
      
//       if (data.status === "OK" && data.results && data.results.length > 0) {
//         const position = data.results[0].geometry.location;
        
//         // Store in cache
//         geocodeCache[cacheKey] = {
//           lat: position.lat,
//           lng: position.lng
//         };
        
//         return { lat: position.lat, lng: position.lng };
//       }
      
//       return { lat: null, lng: null };
//     } catch (err) {
//       console.error(`Error geocoding ${query}:`, err);
//       return { lat: null, lng: null };
//     }
//   };

//   const processCSV = async () => {
//     if (!file) {
//       setError("Please select a CSV file first");
//       return;
//     }
    
//     setIsLoading(true);
//     setProgress(0);
//     setError(null);
    
//     Papa.parse(file, {
//       header: false,
//       skipEmptyLines: true,
//       complete: async (results) => {
//         try {
//           const data = results.data;
//           if (!data || data.length <= 1) {
//             throw new Error("CSV file appears to be empty or invalid");
//           }
          
//           // Process the data
//           const headers = data[0];
//           const rows = data.slice(1);
//           const totalRows = rows.length;
          
//           // Add new headers for lat/lng
//           const newHeaders = [...headers, "Latitude", "Longitude"];
          
//           const processedRows = [];
//           processedRows.push(newHeaders);
          
//           // Process each row with rate limiting
//           const BATCH_SIZE = 10;
//           const DELAY_MS = 1000; // 1 second delay between batches
          
//           for (let i = 0; i < totalRows; i += BATCH_SIZE) {
//             const batch = rows.slice(i, Math.min(i + BATCH_SIZE, totalRows));
//             const batchPromises = batch.map(async (row) => {
//               const city = locationColumns.city < row.length ? row[locationColumns.city] : "";
//               const region = locationColumns.region < row.length ? row[locationColumns.region] : "";
              
//               const coords = await geocodeLocation(region, city);
              
//               return [...row, coords.lat, coords.lng];
//             });
            
//             const batchResults = await Promise.all(batchPromises);
//             processedRows.push(...batchResults);
            
//             setProgress(Math.min(100, Math.round((i + batch.length) / totalRows * 100)));
            
//             // Delay before next batch
//             if (i + BATCH_SIZE < totalRows) {
//               await new Promise(resolve => setTimeout(resolve, DELAY_MS));
//             }
//           }
          
//           setResults(processedRows);
//           setDownloadReady(true);
//           setIsLoading(false);
//           setProgress(100);
//         } catch (err) {
//           setError(`Error processing CSV: ${err.message}`);
//           setIsLoading(false);
//         }
//       },
//       error: (error) => {
//         setError(`Error parsing CSV: ${error.message}`);
//         setIsLoading(false);
//       }
//     });
//   };

//   const downloadCSV = () => {
//     if (!results) return;
    
//     const csv = Papa.unparse(results);
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
    
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', 'geocoded_locations.csv');
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">CSV Location Geocoder</h1>
      
//       <div className="mb-6">
//         <label className="block mb-2 font-medium text-gray-700">Upload CSV File</label>
//         <input
//           type="file"
//           accept=".csv"
//           onChange={handleFileChange}
//           className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2.5 cursor-pointer bg-gray-50"
//         />
//       </div>
      
//       {columnHeaders.length > 0 && (
//         <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//           <h2 className="text-lg font-medium mb-3 text-gray-700">Select Location Columns</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-700">City/Location Column</label>
//               <select 
//                 className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
//                 value={locationColumns.city}
//                 onChange={(e) => setLocationColumns({...locationColumns, city: parseInt(e.target.value)})}
//               >
//                 {columnHeaders.map((header, index) => (
//                   <option key={`city-${index}`} value={index}>
//                     {header || `Column ${index + 1}`}
//                   </option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block mb-2 text-sm font-medium text-gray-700">Region/State Column</label>
//               <select 
//                 className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
//                 value={locationColumns.region}
//                 onChange={(e) => setLocationColumns({...locationColumns, region: parseInt(e.target.value)})}
//               >
//                 {columnHeaders.map((header, index) => (
//                   <option key={`region-${index}`} value={index}>
//                     {header || `Column ${index + 1}`}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       )}
      
//       <div className="flex flex-col space-y-4">
//         <button
//           onClick={processCSV}
//           disabled={isLoading || !file}
//           className={`py-2.5 px-5 rounded-lg text-white font-medium ${
//             isLoading || !file ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {isLoading ? 'Processing...' : 'Process CSV File'}
//         </button>
        
//         {isLoading && (
//           <div className="w-full bg-gray-200 rounded-full h-2.5">
//             <div 
//               className="bg-blue-600 h-2.5 rounded-full" 
//               style={{ width: `${progress}%` }}
//             ></div>
//             <p className="text-sm text-gray-600 mt-1">Processing: {progress}% complete</p>
//           </div>
//         )}
        
//         {error && (
//           <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
//             <p>{error}</p>
//           </div>
//         )}
        
//         {downloadReady && (
//           <div className="flex flex-col space-y-4">
//             <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
//               <p>Geocoding complete! You can now download your enhanced CSV file.</p>
//             </div>
            
//             <button
//               onClick={downloadCSV}
//               className="py-2.5 px-5 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium"
//             >
//               Download Geocoded CSV
//             </button>
            
//             {results && results.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-lg font-medium mb-3 text-gray-700">Preview (first 5 rows)</h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full bg-white border border-gray-200">
//                     <thead>
//                       <tr>
//                         {results[0].map((header, index) => (
//                           <th key={index} className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 text-left">
//                             {header || `Column ${index + 1}`}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {results.slice(1, 6).map((row, rowIndex) => (
//                         <tr key={rowIndex}>
//                           {row.map((cell, cellIndex) => (
//                             <td key={cellIndex} className="py-2 px-4 border-b border-gray-200 text-sm text-gray-700">
//                               {cell !== null ? cell : '(empty)'}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };