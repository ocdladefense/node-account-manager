import JobCard from "./JobCard.jsx";

/**
 * Renders a list of job postings using the JobCard component for each job.
 * @param {Object} param - The parameters for the JobList component
 * @param {Array} param.jobs - An array of job objects from Salesforce, each containing details like title, organization, location, and salary.
 * @returns {React.JSX.Element} A list of job cards.
 */
export default function JobList({ jobs = [] }) {
    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <JobCard key={job.Id} job={job} />
            ))}
        </div>
    );
}
