import BaseAdapter from "../../baseNetworkAdapter";

/**
 * Logout
 *
 */

class Logout extends BaseAdapter {
    constructor() {
        super(`/api/v1/auth/logout`, BaseAdapter.METHODS.POST, []);
    }
}

export default Logout;
