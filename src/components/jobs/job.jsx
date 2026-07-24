import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../ui/Button.jsx";
import Job from "../../models/Job.js";

export default function Job({ job = {} }) {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const [job, setJob] = useState(null);

    return (
        <div className="container mx-auto px-2">
            <h1>{job.Name}</h1>
            <p>{job.Organization__c}</p>
            <p>{job.Location__C}</p>
            <p>{job.Salary__c}</p>
            <Date value={job.PostingDate__c}/>
            {job.OpenUntilFilled__c ? <p>Open Until Filled</p> : <Date value={job.ClosingDate__c} />}
            {/* job file */}
        
            {job.OwnerId == process.env.SF_CONTACT_ID && <Button label="Edit job" action={navigate(`job/${job.id/edit}`)} />}
        </div>
    );
}
