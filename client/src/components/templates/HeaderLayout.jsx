import { Header } from "../organisms/Header";

export const HeaderLayout = (props) => {
  const { children } = props;
  return (
    <>
      <Header/>
      {children}
    </>
  );
};
