import { Input } from "@chakra-ui/react";

export const FileInput = ({ onChange, ...rest }) => {
  return (
    <Input
      type="file"
      accept="image/*"
      onChange={(e) => onChange(e.target.files[0])}
      {...rest}
    />
  );
};
