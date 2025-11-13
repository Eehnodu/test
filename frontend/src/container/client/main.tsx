// 3. 메인(홈)
import { ContextUser } from "@/types/user";
import { useOutletContext } from "react-router-dom";

const Main = () => {
  const { user } = useOutletContext<ContextUser>();
  console.log(user);
  return (
    <>
      <div className="flex flex-col w-full h-full gap-4">
        <div className="flex flex-col w-full h-full gap-8"></div>
      </div>
    </>
  );
};

export default Main;
