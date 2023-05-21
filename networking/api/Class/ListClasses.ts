import BaseAdapter from "../../baseNetworkAdapter";

/**
 * List classes (For school admin & teacher)
 * @param school_code
 * @param page
 * @param per_page
 *
 * return: Class[]
 *
 */

class ListClasses extends BaseAdapter {
    constructor(school_code: string, page: number = 1, per_page: number = 20) {
        super(`/api/v1/s/{{1}}/classes?page={{2}}&per_page={{3}}`, BaseAdapter.METHODS.GET, [
            school_code,
            page,
            per_page,
        ]);
    }
}

export default ListClasses;
