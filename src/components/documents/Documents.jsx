import { useState, useEffect } from "react";
import { getCookie } from "@ocdla/salesforce/CookieUtils";

export default function Documents() {

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchFiles = async () => {
            try {

                const subpath = getCookie("user_id");

                if (!subpath || subpath === "undefined") {
                    throw new Error("No user ID found.");
                }

                const response = await fetch("/files", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ subpath })
                });

                if (!response.ok) {
                    throw new Error("Unable to load documents");
                }

                const data = await response.json();

                setFiles(data);
            }
            catch (err) {
                console.error(err);
                setError(err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    // Navigate to download endpoint when row is clicked
    const handleRowClick = (file) => {
        window.location.href = `/download/${encodeURIComponent(file.name)}`;
    };

    if (loading) {
        return <div>Loading documents...</div>;
    }

    if (error) {
        return <div>Error loading documents.</div>;
    }

    return (
        <div className="w-full">
            <div className="container mx-auto px-2 mt-[28px]">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Documents
                </h1>

                <div className="bg-white rounded-lg shadow-sm">

                    {/* Table Header */}
                    <div className="border-b border-gray-200 p-4">
                        <div className="grid gap-4 grid-cols-4">
                            <div className="text-sm font-semibold text-gray-900">
                                Name
                            </div>

                            <div className="text-sm font-semibold text-gray-900">
                                Size
                            </div>

                            <div className="text-sm font-semibold text-gray-900">
                                File Type
                            </div>

                            <div className="text-sm font-semibold text-gray-900">
                                Date Created
                            </div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-200">
                        {files.map((file) => (
                            <div
                                key={file.id}
                                onClick={() => handleRowClick(file)}
                                className="p-4 hover:bg-gray-50 transition cursor-pointer"
                            >
                                <div className="grid gap-4 grid-cols-4">

                                    <div className="text-sm font-medium text-gray-900">
                                        {file.name}
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        {formatFileSize(file.size)}
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        {file.type}
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        {formatDate(file.dateCreated)}
                                    </div>

                                </div>
                            </div>
                        ))}

                        {files.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                                No Documents Found
                            </div>
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
