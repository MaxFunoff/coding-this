import { FieldError } from "src/grql-types/object/FieldError";
import { PostInput } from "../grql-types/input/PostInput";

export const validatePost = (input: PostInput) => {
    const errors: FieldError[] = [];


    if (input.title.length < 10 || input.title.length > 60) {
        errors.push({
            field: 'title',
            message: 'Title length must be between 10 - 60 characters'
        });
    }
    if (input.description.length > 1000) {
        errors.push({
            field: 'description',
            message: 'Description maximum length is 1000 characters'
        });
    }

    if (input.tags?.length > 6) {
        errors.push({
            field: 'tags',
            message: 'Up to 6 tags allowed'
        });
    }

    return errors
};