import { Header } from "../organisms/header";

export const HeaderLayout = (props) => {
  const { children, familyMembers, myInfo } = props;
  return (
    <>
      <Header
       familyMembers={familyMembers}
       myInfo={myInfo}
        />
      {children}
    </>
  );
};
