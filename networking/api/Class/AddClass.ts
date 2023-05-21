import BaseAdapter from "../../baseNetworkAdapter";

/**
 * Add class (For school admin adn teacher)
 * @param school_code
 *
 * @input { name: string; desc?: string }
 *
 * @return class
 */

class AddClass extends BaseAdapter {
    constructor(school_code: string) {
        super(`/api/v1/s/{{1}}/classes`, BaseAdapter.METHODS.POST, [school_code]);
    }
    input(data: { name: string; desc?: string }) {
        this.data = data;
    }
}

export default AddClass;
