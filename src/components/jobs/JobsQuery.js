export function getJobQuery(jobId) {

    return `SELECT 
            Id,
            AttachmentPath__c,
            AttachmentUrl__c,
            ClosingDate__c,
            CreatedById,
            IsActive__c,
            LastModifiedById,
            Location__c,
            MemberId__c,
            Name,
            OpenUntilFilled__c,
            Organization__c,
            OwnerId,
            PostingDate__c,
            Salary__c
            FROM Job;`
}
