export default function JobCard({job}){
    return (
        <div>
            <h3>{job.name}</h3>
            <h4>{job.description}</h4>
        </div>
    )
}