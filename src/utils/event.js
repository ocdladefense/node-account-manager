



export function isBeforeEarlyBirdEndDate(product) {

    const currentDate = new Date().toISOString().split("T")[0];

    const earlyBirdEndDate = product.Event__r?.Early_Bird_End_Date__c;

    if (earlyBirdEndDate && currentDate <= earlyBirdEndDate)
    {
        return true;
    }

    return false;
}
