import JobCard from "./JobCard.jsx";

export default function JobList({jobs}){
    let jobsList = [];

    jobs.map((job) => {
        jobsList.push(<JobCard job={job}/>)
    });

    return jobsList;
}