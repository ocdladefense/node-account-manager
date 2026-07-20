export default function JobCard({ job }) {
    return (
        <div className="border-t-2 p-4">
            <h3 className="card-title">{job.Name}</h3>
            <h4>{job.Organization__c}</h4>
            <p>Location: {job.Location__c}</p>
            <p>Salary: {job.Salary__c}</p>
        </div>
    )
}
