import {FileUpload, uploadFileToServer} from "../ui/form/FileUpload";

export default function JobsUpload(){
    const JOB_POSTING_APP_ID = 3;
    
    return (
        <div>
            {/* <form action="/jobs" method="post">
                <label for="name">Job Name</label>
                <input type="text" id="name" name="name" placeholder="Enter job name" />
                
                <label for="description">Job description</label>
                <input type="text" id="description" name="description" placeholder="Enter job description" />

                <input type="submit" value="submit" />
            </form> */}

            <FileUpload label="Job Posting" name="job-posting" applicationId={JOB_POSTING_APP_ID}/>
        </div>
    )
}