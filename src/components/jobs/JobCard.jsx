export default function JobCard({job}){
    return (
        <div className="border-2">
            <h3 className="card-title">{job.name}</h3>
            <h4>{job.description}</h4>
        </div>
    )
}