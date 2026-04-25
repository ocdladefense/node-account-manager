// Retrieves all of the contact information (by Salesforce Contact Id)
export function getContactQuery(contactId) {

    return `SELECT 
            Id,
            FirstName,
            LastName,
            MiddleName,
            Suffix,
            Salutation,
            Ocdla_Organization__c,
            OrderApi__Work_Phone__c,
            OrderApi__Work_Email__c,
            LegislativeAdvocacyOptIn__c,
            Ocdla_Is_Expert_Witness__c,
            Ocdla_Address_Line_1__c,
            Ocdla_Address_Line_2__c,
            Ocdla_Bar_Number__c,
            Ocdla_Investigator_License_Number__c,
            MailingAddress,
            Name,
            Phone,
            Ocdla_Cell_Phone__c,
            Fax,
            Ocdla_Website__c,
            AccountId,

            Ocdla_Is_State_Expert__c,
            Include_in_Expert_Witness_Directory__c,
            ExpertWitnessUpdateEmailSent__c,

            ExpertWitnessUpdateDateSent__c,
            
            Ocdla_Expert_Witness_Primary__c,
            
            Ocdla_Expert_Witness_Other_Areas__c,
            Ocdla_Expert_Witness_Last_Updated__c,
            Ocdla_Expert_Unavailability_Start_Date__c,
            Ocdla_Expert_Unavailability_End_Date__c,
            Ocdla_Expert_Travel_Availability__c,
            Ocdla_Expert_Minimum_Hours__c,
            Ocdla_Expert_Hourly_Rate__c,
            Ocdla_Expert_Comments__c


            FROM Contact WHERE Id = '${contactId}'`;
}

