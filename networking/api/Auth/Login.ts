import BaseAdapter from "../../baseNetworkAdapter";

/**
 * Login
 *
 * @input {
 * email: string,
 * password: string
 * }
 *
 */
class Login extends BaseAdapter {
    constructor() {
        super(`/api/v1/auth/login`, BaseAdapter.METHODS.POST, []);
    }

    input({ email, password }: { email: string; password: string }) {
        this.data = {
            email,
            password,
        };
    }
}

export default Login;
