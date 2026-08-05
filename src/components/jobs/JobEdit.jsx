import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { getJobsQuery } from "./JobsQuery";
import { compareSFId } from "./jobUtils";
import JobForm from "./JobForm";

export default function JobEdit() {
    const navigate = useNavigate();
    const { client } = useOutletContext();
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    let userId = getCookie(user_id);

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

    return isOwner ? (
        <JobForm job={job} onCancel={() => navigate(`/job/${job.Id}`)} />
    ) : <div>You do not have permission to edit this job.</div>;
}
