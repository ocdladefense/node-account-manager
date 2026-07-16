export default class Job{
    title;
    description;
    postDate;
    closeDate;
    Organization;
    Salary;
    Document;

    constructor(title, description){
        this.title = title;
        this.description = description;
        this.postDate = Date.now();
    }
}