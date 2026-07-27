import { useParams, useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { getJobsQuery } from "./JobsQuery";
import JobForm from "./JobForm";

export default function JobEdit() {

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

    return job ? <JobForm job={job} /> : null;

}
