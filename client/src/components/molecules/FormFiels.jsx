import { FormControl, FormLabel } from "@chakra-ui/react";

export const FormField = ({ label, children }) => {
  return (
    <FormControl>
      <FormLabel fontSize="sm" fontWeight="bold">
        {label}
      </FormLabel>
      {children}
    </FormControl>
  );
};
