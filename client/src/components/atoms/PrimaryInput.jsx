import { Input } from "@chakra-ui/react";

export const PrimaryInput = (props) => {
  const { value, onChange, placeholder, disabled = false, rest } = props;
  return (
    <Input
      variant="outline"
      size="sm"
      bg="white"
      focusBorderColor="orange.400"
      iddisabled={disabled}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
    />
  );
};
