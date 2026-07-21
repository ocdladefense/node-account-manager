/**
 * Represents a job posting object.
 *
 * @property {string} [id] - The unique ID of the job posting.
 * @property {string} title - The title of the job.
 * @property {string} [description] - Detailed job description.
 * @property {number} postDate - Timestamp when the job was created.
 * @property {string} [closeDate] - Application closing date.
 * @property {string} [organization] - The organization or company name.
 * @property {string} salary - The salary range or amount.
 * @property {string} [documentName] - Name of the attached file/document.
 */
export default class Job {
    id;

    title;

    description;

    postDate;

    closeDate;

    organization;

    salary;

    documentName;

    /**
     * @param {string} title - The Job Title
     * @param {string} salary - The job salary
     */
    constructor(title, salary) {
        this.title = title;
        this.salary = salary;
        this.postDate = Date.now();
    }
}
