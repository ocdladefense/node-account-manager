import { useNavigate } from "react-router-dom";


/**
 * Displays a summary card for an individual job posting.
 *
 * @param {Object} props
 * @param {Object} props.job - The salesforce Job object containing title, organization, location and salary/
 * @returns {React.JSX.Element} A formatted card component.
 */
export default function JobCard({ job }) {

    const navigate = useNavigate();
    const attachementUrl = job.AttachmentUrl__c;
    const fileName = job.AttachmentPath__c ? job.AttachmentPath__c.split("/").pop() : "View Attachment";



    return (
        <div className="border-t-2">
            <div className="p-4 hover:cursor-pointer hover:border-2 hover:border-blue-300" onClick={() => navigate(`/job/${job.Id}`)}>
                <h3 className="card-title">{job.Name}</h3>
                <h4>{job.Organization__c}</h4>
                <p>Location: {job.Location__c}</p>
                <p>Salary: {job.Salary__c}</p>
                <a href={attachementUrl} className="text-blue-600" target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>{fileName}</a>
            </div>
        </div>
    )
}
