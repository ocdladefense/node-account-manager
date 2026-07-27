import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { getJobsQuery } from "./JobsQuery";
import JobForm from "./JobForm";

export default function JobEdit() {
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

    if (job){
        console.log('JobEdit.jsx: ownerId: ', job.OwnerId);
        console.log('JobEdit.jsx: userId: ', process.env.SF_CONTACT_ID);
        console.log('JobEdit.jsx: Id Compare: ', job.OwnerId === process.env.SF_CONTACT_ID);
        if (job.OwnerId != process.env.SF_CONTACT_ID) {
            navigate(`/job/${job.Id}`);
        }
        return <JobForm job={job} />;
    }
    else{
        return null;
    }
}
