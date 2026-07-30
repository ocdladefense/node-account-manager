import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getJobsQuery } from "./JobsQuery";
import { compareSFId } from "./jobUtils";
import JobList from "./JobsList";

// Mapper array for the filter fields and corresponding api endpoints
const FILTER_FIELDS = [
    ["Name", "Title"],
    ["Organization__c", "Company"],
    ["Location__c", "Location"]
];

/**
 * Renders the Jobs list page, handling data fetching,
 * loading, error states, filtering, and sorting.
 *
 * @returns {React.JSX.Element} The active jobs overview layout
 */
export default function Jobs() {
    const { client } = useOutletContext();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobs, setJobs] = useState([]);

    const [filterField, setFilterField] = useState("Name");
    const [filterText, setFilterText] = useState("");
    const [onlyOwned, setOnlyOwned] = useState(false);
    const [closingDateSort, setClosingDateSort] = useState("");

    const userId = process.env.SF_USER_ID;

    useEffect(() => {
        async function fetchJobs() {
            const jobsQuery = getJobsQuery();

            try {
                setLoading(true);

                const response = await client.query(jobsQuery);

                console.log("query response:", response);

                setJobs(response.records);
            } catch (err) {
                setError(err);
                console.error("Error fetching jobs:", err);
            } finally {
                setLoading(false);
            }
        }

        if (client) {
            fetchJobs();
        }
    }, [client]);


    // Boolean variable verifying if logged-in user is owner of any jobs
    const hasOwnedJobs = Boolean(
        userId && jobs.some((job) => compareSFId(job.OwnerId, userId))
    );

    // Creating an array of jobs filtered by chosen field and value
    const filteredJobs = jobs.filter((job) =>
        (!onlyOwned || compareSFId(job.OwnerId, userId)) &&
        String(job[filterField] ?? "")    // FUN THING! Nullish Coelescing Operator '??' coverts null/undefined to ""
            .toLowerCase()
            .includes(filterText.toLowerCase())
    );

    // Copied filteredJobs array for safe order manipulation. Jobs with no closing date go last.
    const displayedJobs = [...filteredJobs].sort((jobA, jobB) => {
        if (!closingDateSort) {
            return 0;
        }

        const dateA = jobA.ClosingDate__c;
        const dateB = jobB.ClosingDate__c;

        if (!dateA && !dateB) {
            return 0;
        }

        if (!dateA) {
            return 1;
        }

        if (!dateB) {
            return -1;
        }

        return closingDateSort === "ascending"
            ? dateA.localeCompare(dateB)
            : dateB.localeCompare(dateA);
    });

    // Clear all applied filtration by restoring states to initial values
    const clearFilters = () => {
        setFilterField("Name");
        setFilterText("");
        setOnlyOwned(false);
        setClosingDateSort("");
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto px-2 mt-7">
            {/* */}
            <h1 className="card-title">
                Showing {displayedJobs.length} of {jobs.length} active jobs.
            </h1>

            <a href="/job/new" className="link">
                Upload a job!
            </a>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
                {/* Text filter */}
                <label className="flex flex-col">
                    <span className="font-semibold">
                        Filter Jobs
                    </span>

                    <div className="flex">
                        <select
                            value={filterField}
                            onChange={(e) => setFilterField(e.target.value)}
                            className="border rounded-l px-3 py-2"
                        >
                            {FILTER_FIELDS.map(([field, label]) => (
                                <option key={field} value={field}>
                                    {label}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                            placeholder="Enter search text"
                            className="border border-l-0 rounded-r px-3 py-2 flex-1"
                        />
                    </div>
                </label>

                {/* Closing-date sorting */}
                <label className="flex flex-col">
                    <span className="font-semibold">
                        Sort by Closing Date
                    </span>

                    <select
                        value={closingDateSort}
                        onChange={(e) =>
                            setClosingDateSort(e.target.value)
                        }
                        className="border rounded px-3 py-2"
                    >
                        <option value="">Default Order</option>
                        <option value="ascending">
                            Soonest Closing First
                        </option>
                        <option value="descending">
                            Latest Closing First
                        </option>
                    </select>
                </label>
            </div>

            <div className="flex gap-3 mb-6">
                {hasOwnedJobs && (
                    <button
                        type="button"
                        onClick={() =>
                            setOnlyOwned((currentValue) => !currentValue)
                        }
                        className="border rounded px-4 py-2"
                    >
                        {onlyOwned
                            ? "Show All Jobs"
                            : "Show My Jobs"}
                    </button>
                )}

                <button
                    type="button"
                    onClick={clearFilters}
                    className="border rounded px-4 py-2"
                >
                    Clear Filters
                </button>
            </div>

            <JobList jobs={displayedJobs} />
        </div>
    );
}
