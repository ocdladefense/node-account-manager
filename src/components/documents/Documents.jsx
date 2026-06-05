import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getFileDataByContact } from './query.js';

const contactId = process.env.SF_CONTACT_ID;

// Helper function to format bytes to human readable size
function formatFileSize(bytes) {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
        size /= 1024;
        i++;
    }
    return (Math.round(size * 100) / 100) + ' ' + units[i];
}

// Helper function to format date (remove timestamp)
function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
}

export default function Documents() {
    const { client } = useOutletContext();
    const [files, setFiles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortColumn, setSortColumn] = useState('Filename__c');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const soql = getFileDataByContact(contactId);
        console.log('Contact Id:', contactId);
        const fetchFiles = async () => {
            try {
                const resp = await client.query(soql);
                setFiles(resp.records);
            } catch (error) {
                console.error('Error fetching files:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFiles();
    }, []);

    const handleColumnClick = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedFiles = files ? [...files].sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];

        // Handle different data types
        if (sortColumn === 'FileSize__c') {
            aVal = Number(aVal);
            bVal = Number(bVal);
        } else if (sortColumn === 'CreatedDate') {
            aVal = new Date(aVal).getTime();
            bVal = new Date(bVal).getTime();
        } else {
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
        }

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    }) : [];

    const handleRowClick = (file) => {
        window.location.href = `/download/${contactId}/${file.Filename__c}?type=${encodeURIComponent(file.FileType__c)}`;
    };

    const SortableHeader = ({ column, label }) => (
        <div
            onClick={() => handleColumnClick(column)}
            className="text-sm font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
        >
            {label} {sortColumn === column && (sortDirection === 'asc' ? '↑' : '↓')}
        </div>
    );

    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-[28px]">
                <h1 className="text-2xl font-bold text-center mb-6">Documents</h1>
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Table Header */}
                    <div className="border-b border-gray-200 p-4">
                        <div className="grid gap-4 grid-cols-4">

                            <SortableHeader column="Filename__c" label="Filename" sortColumn={sortColumn} sortDirection={sortDirection} onColumnClick={handleColumnClick} />
                            <SortableHeader column="FileSize__c" label="File Size" sortColumn={sortColumn} sortDirection={sortDirection} onColumnClick={handleColumnClick} />
                            <SortableHeader column="FileType__c" label="File Type" sortColumn={sortColumn} sortDirection={sortDirection} onColumnClick={handleColumnClick} />
                            <SortableHeader column="CreatedDate" label="Date Created" sortColumn={sortColumn} sortDirection={sortDirection} onColumnClick={handleColumnClick} />
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading...</div>
                        ) : sortedFiles.length > 0 ? (
                            sortedFiles.map((file) => (
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
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">No documents found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
