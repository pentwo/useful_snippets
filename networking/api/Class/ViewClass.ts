import BaseAdapter from "../../baseNetworkAdapter";

/**
 * View class (For school admin & teacher)
 * @param school_code
 * @param class_id
 *
 * return: Class
 */
class ViewClass extends BaseAdapter {
    constructor(school_code: string, class_id: string) {
        super(`/api/v1/s/{{1}}/classes/{{2}}`, BaseAdapter.METHODS.GET, [school_code, class_id]);
    }
}

export default ViewClass;
