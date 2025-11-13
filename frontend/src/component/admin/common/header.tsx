import burger from "@/assets/admin/burger.png";
import { usePost } from "@/hooks/common/useAPI";
import { useNavigate, useLocation } from "react-router-dom";
import Modal from "@/component/common/modal";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { getTitleByPath } from "@/component/admin/common/adminMenu";

interface Props {
  setToggleSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminHeader = ({ setToggleSidebar }: Props) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const logoutMutation = usePost("api/admin/logout");
  const [logoutModal, setLogoutModal] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate(
      {},
      {
        onSuccess: () => {
          setLogoutModal(false);
          navigate("/admin/login");
        },
      }
    );
  };

  return (
    <div className="flex flex-row items-center justify-between w-full p-5 pl-0 bg-[#F5F5F5]">
      <div className="w-1/3 flex flex-row gap-4 text-xl font-bold px-8">
        <button onClick={() => setToggleSidebar((p) => !p)}>
          <img src={burger} alt="menu" className="w-6 h-5" />
        </button>
        <span>{getTitleByPath(pathname)}</span>
      </div>

      <button
        className="text-sm font-bold p-2 px-5 shadow-md rounded-lg"
        onClick={() => setLogoutModal(true)}
      >
        Logout
      </button>

      {logoutModal && (
        <Modal
          numbers={2}
          title="로그아웃"
          description="정말로 로그아웃 하시겠습니까?"
          label="확인"
          label2="취소"
          onClose={() => handleLogout()}
          onClick={() => setLogoutModal(false)}
          className="w-[300px] border border-gray-400"
        />
      )}
    </div>
  );
};

export default AdminHeader;
