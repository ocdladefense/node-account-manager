import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { getJobsQuery } from "./JobsQuery";
import { compareSFId } from "./jobUtils";
import Button from "../ui/Button.jsx";
import { BackButton } from "../ui/Button.jsx";
import DateDisplay from "../ui/DateDisplay.jsx";

export default function Job() {
    const navigate = useNavigate();
    const { client } = useOutletContext();
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    let userId = client.getUserId();
    let postingDate;
    let closingDate;


    useEffect(() => {
        const soql = getJobsQuery(jobId);
        const fetchJob = async () => {
            let job;
            const resp = await client.query(soql);
            job = resp.records[0];
            setJob(job);
            setIsOwner(compareSFId(job.OwnerId, userId));
        };
        fetchJob();
    }, []);

    return job ? (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
                <BackButton action={() => navigate(`/jobs`)} label="< Back" buttonType="button" />
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-gray-800">{job.Name}</h1>
                </div>

                <p className="text-xl text-gray-600 mb-6">{job.Organization__c}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Location</h3>
                        <p className="text-gray-600">{job.Location__c}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Salary</h3>
                        <p className="text-gray-600">{job.Salary__c}</p>
                    </div>
                    <div>
                        <DateDisplay label="Date Posted" value={job.PostingDate__c} type="Date" />
                    </div>
                    <div>
                        {job.OpenUntilFilled__c ? (
                            <p className="text-gray-600">Open Until Filled</p>
                        ) : (
                            <DateDisplay label="Closing Date" value={job.ClosingDate__c} type="Date" />
                        )}
                    </div>
                    {job.AttachmentUrl__c && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Attachment</h3>
                            <a href={job.AttachmentUrl__c} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                                {job.AttachmentPath__c ? job.AttachmentPath__c.split("/").pop() : "View Attachment"}
                            </a>
                        </div>
                    )}

                </div>
                <br />
                <div>
                    {isOwner && <Button label="Edit job" action={() => navigate(`/job/${jobId}/edit`)} />}

                </div>
            </div>
        </div>
    ) : null;
}
