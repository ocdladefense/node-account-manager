import { useState } from "react";

/**
 * Reusable paginated list component with customizable rendering
 * 
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to paginate (default: [])
 * @param {number} props.itemsPerPage - Number of items displayed per page (default: 5)
 * @param {Function} props.renderItem - Function to render each item. Receives (item, index) and returns JSX
 * @param {Function} [props.renderHeader] - Optional function to render header section above items. Returns JSX
 * @param {string} [props.title] - Optional section title displayed at the top
 * 
 * @example
 * <PagedList 
 *   items={data}
 *   itemsPerPage={5}
 *   title="Order Items"
 *   renderItem={(item, index) => <div>{item.name}</div>}
 *   renderHeader={() => <div>Order #12345</div>}
 * />
 */

export default function PagedList({
    items = [],
    itemsPerPage = 5,
    renderItem,
    renderHeader,
    title
}) {
    const [currentPage, setCurrentPage] = useState(1); // Default to Page #1

    // Total number of items in the array (defaults to 0 if items is null/undefined)    
    const totalItems = items?.length || 0;

    // Total number of pages needed (rounds up)
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Starting index for array slice on current page (Page 2: (2-1) * 5 = 5, so start at index 5)
    const startIndex = (currentPage - 1) * itemsPerPage;

    // Ending index for array slice (Page 2: 5 + 5 = 10, so end at index 10)
    const endIndex = startIndex + itemsPerPage;

    // Array slice of current page's items (Page 2: items[5..10], or empty array if items is null)
    const paginatedItems = items?.slice(startIndex, endIndex) || [];

    return (
        <div className="container mx-auto p-6 mt-20">
            {items && items.length > 0 && (
                <div>
                    {/* Title Section */}
                    {title && (
                        <div className="px-4">
                            <h1 className="text-base/7 font-semibold text-gray-900">{title}</h1>
                        </div>
                    )}

                    {/* Optional Header */}
                    {renderHeader && (
                        <div className="mt-6">
                            {renderHeader()}
                        </div>
                    )}

                    {/* Items Container */}
                    <div className={`${renderHeader ? 'mt-6' : 'mt-6'} border-t border-gray-100`}>
                        <div className="divide-y divide-gray-100">
                            {/* Render Paginated Items */}
                            {paginatedItems.map((item, index) => (
                                <div key={startIndex + index}>
                                    {renderItem(item, startIndex + index)}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex flex-col gap-4">
                            <div className="flex flex-wrap justify-center gap-2">
                                {/* First Button */}
                                <button
                                    onClick={() => setCurrentPage(1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    First
                                </button>

                                {/* Previous Button */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} // Math.max to ensure Page(s) never go below 1
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>

                                {/* 
                                    Page Number Buttons - Renders one button per page
                                    [...Array(totalPages)] creates an array, .map iterates over it using index (i) 
                                    to generate page numbers. Element parameter is undefined.
                                    Also changes active page button to blue.
                                */}
                                {[...Array(totalPages)].map((element, i) => {
                                    const page = i + 1;
                                    const isActive = currentPage === page;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-3 py-2 rounded text-sm font-medium ${isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                {/* Next Button */}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>

                                {/* Last Button */}
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Last
                                </button>
                            </div>

                            {/* Page Info */}
                            <div className="text-center text-sm text-gray-600">
                                Page {currentPage} of {totalPages} ({totalItems} items)
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
