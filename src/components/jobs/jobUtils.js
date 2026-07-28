/*
 * @params {string} SalesForce ID
 */
export function compareSFId(id1, id2) {
    return id1.substring(0, 16) == id2.substring(0, 16);
}
