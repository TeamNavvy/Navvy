import { Header } from "../organisms/header";

export const HeaderLayout = (props) => {
  const { children } = props;
  return (
    <>
      <Header/>
      {children}
    </>
  );
};
