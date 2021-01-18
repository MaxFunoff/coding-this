import { PostValues } from "../types/PostValues";

interface NewValues {
    title: string;
    description: string;
    tags: string[] | null;
}

export const validatePost = (v: PostValues) => {
    let errFound: boolean = false;
    const errors: any = {};
    const _v: NewValues = { ...v, tags: [] };
    
    if (v.title.length < 10 || v.title.length > 60) {
        errFound = true;
        errors.title = 'Title length must be between 10 - 60 characters'
    }
    if ( v.description.length > 1000) {
        errFound = true;
        errors.description = 'Description maximum length is 1000 characters'
    }
    if (v.tags) {
        _v.tags = v.tags.split(",").map((tag) => tag.trim());
        if (_v.tags.length > 6) {
            errFound = true;
            errors.tags = 'Up to 6 tags allowed'
        }
    }


    if (errFound) {
        return [null, errors]
    } else {
        return [_v, null]
    }
};