export default function JobCard({ job }) {
    return (
        <div className="border-top-1 p-4">
            <h3 className="card-title">{job.title}</h3>
            <h4>{job.description}</h4>

        </div>
    )
}
