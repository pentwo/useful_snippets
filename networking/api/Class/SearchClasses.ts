import BaseAdapter from "../../baseNetworkAdapter";

/**
 * List classes (For school admin & teacher)
 * @param school_code
 * @param page
 * @param per_page
 * @param filter_name
 * @param filter_desc
 * @param sort
 * @param sort_desc
 *
 * return: Class[]
 *
 */

class ListClasses extends BaseAdapter {
    constructor(
        school_code: string,
        page: number = 1,
        per_page: number = 20,
        filter_name?: string,
        filter_desc?: string,
        sort: "created_at" | "name" | "student_count" = "created_at",
        sort_desc: boolean = false
    ) {
        super(
            `/api/v1/s/{{1}}/classes?page={{2}}&per_page={{3}}filter_name={{4}}&filter_desc={{5}}&sort={{6}}&sort_desc={{7}}`,
            BaseAdapter.METHODS.GET,
            [school_code, page, per_page, filter_name, filter_desc, sort, sort_desc]
        );
    }
}

export default ListClasses;
