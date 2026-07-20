import JobCard from "./JobCard.jsx";

export default function JobList({ jobs = [] }) {
    return (
        <div className="space-y-4">
            {jobs.map((job) => (
                <JobCard key={job.Id} job={job} />
            ))}
        </div>
    );
}
