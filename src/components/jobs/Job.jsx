import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { getJobsQuery } from "./JobsQuery";
import { compareSFId } from "./jobUtils";
import Button from "../ui/Button.jsx";

export default function Job() {
    const navigate = useNavigate();
    const { client } = useOutletContext();
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    let userId = process.env.SF_USER_ID;
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
            postingDate = new Date(...job.PostingDate__c.split("-"));
            closingDate = new Date(...job.ClosingDate__c.split("-"));

        };
        fetchJob();
    }, []);

    // console.log(`date parsed:`, postingDate, closingDate);
    // console.log(`date raw:`, job.PostingDate__c, job.ClosingDate__c);
    // console.log(`date split: `, job.PostingDate__c.split("-"), job.ClosingDate__c.split("-"));

    return job ? (
        <div className="container mx-auto px-2">
            <h1>{job.Name}</h1>
            <p>{job.Organization__c}</p>
            <p>{job.Location__C}</p>
            <p>{job.Salary__c}</p>
            <p>{postingDate}</p>
            {job.OpenUntilFilled__c ? <p>Open Until Filled</p> : <p>{closingDate}</p>}
            {/* job file */}
            {isOwner && <Button label="Edit job" action={() => navigate(`/job/${jobId}/edit`)} />}
        </div>
    ) : null;
}
