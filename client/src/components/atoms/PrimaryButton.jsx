import { Button } from "@chakra-ui/react";

export const PrimaryButton = (props) => {
  const { children, disabled = false, loading = false, onClick } = props;
  return (
    <Button
      bg="gray"
      color="white"
      _hover={{ opacity: 0.8 }}
      isdisabled={disabled || loading}
      isLoading={loading}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
