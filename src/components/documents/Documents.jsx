import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getFileDataByContact } from './query.js';

export default function Documents() {
    const { client } = useOutletContext();
    const [files, setFiles] = useState(null);
    const [loading, setLoading] = useState(true);

    const contactId = process.env.SF_CONTACT_ID;

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

    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-[28px]">
                <h1 className="text-2xl font-bold text-center mb-6">Documents</h1>
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Table Header */}
                    <div className="border-b border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                            <div className="text-sm font-semibold text-gray-900">Filename</div>
                            <div className="text-sm font-semibold text-gray-900">File Size</div>
                            <div className="text-sm font-semibold text-gray-900">File Type</div>
                            <div className="ml-auto"></div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                        {loading ? (
                            <div className="p-6 text-center text-gray-500">Loading...</div>
                        ) : files && files.length > 0 ? (
                            files.map((file) => (
                                <div key={file.Id} className="p-6 hover:bg-gray-50 transition">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                                        {/* Filename */}
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{file.Filename__c}</div>
                                        </div>

                                        {/* File Size */}
                                        <div>
                                            <div className="text-sm text-gray-700">{file.FileSize__c}</div>
                                        </div>

                                        {/* File Type */}
                                        <div>
                                            <div className="text-sm text-gray-700">{file.FileType__c}</div>
                                        </div>

                                        {/* Download Link */}
                                        <div className="ml-auto">
                                            <a
                                                href={`/download/${contactId}/${file.Filename__c}?type=${encodeURIComponent(file.FileType__c)}`}
                                                download
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-500">No documents found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
