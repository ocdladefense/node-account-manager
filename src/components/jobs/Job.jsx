import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { getJobsQuery } from "./JobsQuery";
import Button from "../ui/Button.jsx";

export default function Job() {
    const navigate = useNavigate();
    const { client } = useOutletContext();
    const { jobId } = useParams();
    const [job, setJob] = useState(null);

    useEffect(() => {
        const soql = getJobsQuery(jobId);
        const fetchJob = async () => {
            const resp = await client.query(soql);
            setJob(resp.records[0]);
        };
        fetchJob();
    }, []);

    console.log('jobs.jsx: ownerId: ', job.OwnerId);
    console.log('jobs.jsx: userId: ', process.env.SF_CONTACT_ID);
    console.log('jobs.jsx: Id Compare: ', job.OwnerId === process.env.SF_CONTACT_ID);


    return job ? (
        <div className="container mx-auto px-2">
            <h1>{job.Name}</h1>
            <p>{job.Organization__c}</p>
            <p>{job.Location__C}</p>
            <p>{job.Salary__c}</p>
            <Date value={job.PostingDate__c} />
            {job.OpenUntilFilled__c ? <p>Open Until Filled</p> : <Date value={job.ClosingDate__c} />}
            {/* job file */}

            {job.OwnerId == process.env.SF_CONTACT_ID && <Button label="Edit job" action={() => navigate(`job/${jobId}/edit`)} />}
        </div>
    ) : null;
}
