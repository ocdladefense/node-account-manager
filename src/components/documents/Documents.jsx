import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getFileDataByContact } from './query.js';
// import SortableHeader from '../ui/table/SortableHeader.jsx';

const contactId = process.env.SF_CONTACT_ID;



export default function Documents() {
    // const { client } = useOutletContext();
    const testFile = {};
    const [files, setFiles] = useState([testFile]);
    const [loading, setLoading] = useState(true);
    // const [sortColumn, setSortColumn] = useState('Filename__c');
    //  const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {

        const fetchFiles = async () => {
            // Define an express server route that returns a list of files in a given directory in /uploads
        };
        fetchFiles();
    }, []);



    // Navigate to download endpoint when row is clicked (instead of download button)
    const handleRowClick = (file) => {
        window.location.href = `/download/${contactId}/${file.Filename__c}?type=${encodeURIComponent(file.FileType__c)}`;
    };

    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-[28px]">
                <h1 className="text-2xl font-bold text-center mb-6">Documents</h1>
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Table Header */}
                    <div className="border-b border-gray-200 p-4">
                        <div className="grid gap-4 grid-cols-4">
                            <div className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                                Label 1
                            </div>
                        </div>

                        <div className="grid gap-4 grid-cols-4">
                            <div className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                                Label 2
                            </div>
                        </div>

                        <div className="grid gap-4 grid-cols-4">
                            <div className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                                Label 3
                            </div>
                        </div>

                        <div className="grid gap-4 grid-cols-4">
                            <div className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-blue-600">
                                Label 4
                            </div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                        {files.map((file) => (
                            <div
                                key={file.Id}
                                onClick={() => handleRowClick(file)}
                                className="p-4 hover:bg-gray-50 transition cursor-pointer"
                            >
                                <div className="grid gap-4 grid-cols-4">
                                    {/* Filename */}
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{file.Filename__c}</div>
                                    </div>

                                    {/* File Size */}
                                    <div>
                                        <div className="text-sm text-gray-700">{formatFileSize(file.FileSize__c)}</div>
                                    </div>

                                    {/* File Type */}
                                    <div>
                                        <div className="text-sm text-gray-700">{file.FileType__c}</div>
                                    </div>

                                    {/* Date Created */}
                                    <div>
                                        <div className="text-sm text-gray-700">{formatDate(file.CreatedDate)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {files.length === 0 && (
                            <div className="p-4 text-center text-gray-500">No documents found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}






// Helper function to format bytes to human readable size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    // Calculate which unit to use (0=B, 1=KB, 2=MB, 3=GB)
    // Using logarithm to find the appropriate index (i)
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    // Divide bytes by the appropriate power of 1024 and round to 2 decimals
    // Then append the unit label
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Helper function to format date (remove timestamp)
function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
}

/*
useEffect(() => {
    const soql = getFileDataByContact(contactId);
    console.log('Contact Id:', contactId);
    const fetchFiles = async () => {
        // Define an express server route that returns a list of files in a given directory
    };
    fetchFiles();
}, []);

*/


/*
// Sort files array based on current sort settings. Using spread operator (creates new array by default) to sort through a copy of returned files and leaves original files unchanged
const sortedFiles = files ? [...files].sort((a, b) => {
    // Extract values from both items based on the current sort column
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];

    // Handle different data types
    if (sortColumn === 'FileSize__c')
    {
        // For numbers: convert to actual numbers
        aVal = Number(aVal);
        bVal = Number(bVal);
    } else if (sortColumn === 'CreatedDate')
    {
        // For dates: convert to timestamps (milliseconds) so they compare numerically
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
    } else
    {
        // For text: convert to lowercase strings for case-insensitive sorting
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
    }

    // Compare the values and return sort order
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;

    // If they're equal, return 0 (no change in order). Edge case for duplicate file uploads.
    return 0;
}) : []; // otherwise return empty array so that first react render doesnt errror out if null


*/
