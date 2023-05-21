import BaseAdapter from "../../baseNetworkAdapter";

/**
 * Delete class (For school admin)
 * @param school_code
 * @param class_id
 *
 * @return: {
 * success: boolean
 * }
 *
 */

class DeleteClass extends BaseAdapter {
    constructor(school_code: string, class_id: string) {
        super(`/api/v1/s/{{1}}/classes/{{2}}`, BaseAdapter.METHODS.DELETE, [school_code, class_id]);
    }
}

export default DeleteClass;
