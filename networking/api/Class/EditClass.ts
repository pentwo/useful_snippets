import BaseAdapter from "../../baseNetworkAdapter";

/**
 * Edit class (For school admin and teacher)
 * @param school_code
 * @param class_id
 *
 * @input {
 * name: string;
 * desc?: string
 * }
 *
 * @return class
 *
 */

class EditClass extends BaseAdapter {
    constructor(school_code: string, class_id: string) {
        super(`/api/v1/s/{{1}}/classes/{{2}}`, BaseAdapter.METHODS.PUT, [school_code, class_id]);
    }
    input(data: { name: string; desc?: string }) {
        this.data = data;
    }
}

export default EditClass;
