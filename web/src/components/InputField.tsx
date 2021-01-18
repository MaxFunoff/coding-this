import React, { FC, InputHTMLAttributes } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
};

export const InputField: FC<InputFieldProps> = ({
  label,
  size,
  textarea,
  ...props
}) => {
  const [field, { error }] = useField(props);

  let InputOrTextarea: any = Input;
  if (textarea) InputOrTextarea = Textarea;

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>
        {props.required && <span style={{ color: "red" }}>*</span>}{" "}
        {/*Place holder until u put css u fuck*/}
        {label}
      </FormLabel>
      <InputOrTextarea
        {...field}
        {...props}
        id={field.name}
        placeholder={props.placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
