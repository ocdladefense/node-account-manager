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
    const fileName = job.AttachmentPath__c ? job.AttachmentPath__c.split("/").pop() : "No Attachment";



    return (
        <div 
            className="bg-white shadow-md rounded-lg p-6 m-4 hover:shadow-xl hover:border-gray-300 border border-transparent transition-all duration-300 cursor-pointer" 
            onClick={() => navigate(`/job/${job.Id}`)}
        >
            <h3 className="text-xl font-bold text-gray-800">{job.Name}</h3>
            <h4 className="text-lg text-gray-600 mb-4">{job.Organization__c}</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="font-semibold text-gray-700">Location</p>
                    <p className="text-gray-600">{job.Location__c}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-700">Salary</p>
                    <p className="text-gray-600">{job.Salary__c}</p>
                </div>
            </div>

            {attachementUrl && (
                <div className="mt-4">
                    <a 
                        href={attachementUrl} 
                        className="text-blue-600 hover:underline text-sm" 
                        target="_blank" 
                        rel="noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        {fileName}
                    </a>
                </div>
            )}
        </div>
    )
}
