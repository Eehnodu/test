import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePost } from "@/hooks/common/useAPI";
import Button from "@/component/common/button";
import { LogIn, UserRound, Lock, LockOpen, Shield } from "lucide-react";
import { parseUserInfo } from "@/hooks/common/getCookie";
import { Admin } from "@/types/user";

const AdminLogin = () => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const admin = parseUserInfo() as Admin;
  const isRole = admin?.auth_type === "admin";
  const navigate = useNavigate();

  const loginMutation = usePost("api/admin/login");

  useEffect(() => {
    if (admin && isRole) {
      navigate("/admin/users", { replace: true });
    }
  }, [admin, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { admin_email: id, admin_password: pw },
      {
        onSuccess: () => navigate("/admin/users"),
        onError: (err: any) => {
          const status = err?.status;
          if (status == 401) {
            setErrorMsg("아이디 또는 비밀번호를 확인해 주세요.");
            setErrorModal(true);
            return;
          }

          if (status == 403) {
            setErrorMsg(
              "해당 계정은 비활성화되어 로그인할 수 없습니다.\n고객센터로 문의해 주세요."
            );
            setErrorModal(true);
            return;
          }
          setErrorMsg("아이디 또는 비밀번호를 확인해 주세요.");
          setErrorModal(true);
        },
      }
    );
  };

  const canSubmit = Boolean(id && pw);

  return (
    <main className="flex items-center justify-center h-screen w-screen bg-[#D0D0D0]">
      <div className="w-[400px] rounded-lg bg-white flex flex-col items-center justify-center gap-8 py-10">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="flex w-12 h-12 items-center justify-center bg-gray-500 rounded-lg p-2">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-2xl font-medium">관리자 로그인</span>
            <span className="text-sm font-medium">
              관리자 계정으로 로그인하세요
            </span>
          </div>
        </div>

        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          {/* ID */}
          <div className="flex flex-col gap-2">
            <div className="px-4 w-[280px] py-2 border border-gray-300 rounded-md flex items-center justify-between focus-within:border-gray-500">
              <input
                id="login-id"
                type="text"
                placeholder="ID"
                value={id}
                name="admin_email"
                onChange={(e) => setId(e.target.value)}
                className="focus:outline-none w-full h-full text-sm text-black placeholder-gray-400"
                autoComplete="username"
              />
              <UserRound className="w-5 h-5 text-gray-500" />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-2">
            <div className="relative px-4 w-[280px] py-2 border border-gray-300 rounded-md focus-within:border-gray-500">
              <input
                id="login-pw"
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={pw}
                name="admin_password"
                onChange={(e) => setPw(e.target.value)}
                className="focus:outline-none h-full w-[90%] text-sm text-black placeholder-gray-400"
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="transparented"
                intent="secondary"
                size="sm"
                onClick={() => setShowPw((prev) => !prev)}
                aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 표시"}
                className="!p-0 absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md pointer-events-auto"
                disabled={!canSubmit}
                tabIndex={-1}
              >
                {showPw ? (
                  <LockOpen className="w-5 h-5" />
                ) : (
                  <Lock className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* 제출 버튼 */}
          <Button
            type="submit"
            variant="solid"
            intent="primary"
            full
            className="mt-2 shadow-black/20 shadow-lg"
            leftIcon={<LogIn className="w-5 h-5" />}
            disabled={!canSubmit}
          >
            로그인
          </Button>
        </form>
      </div>
    </main>
  );
};

export default AdminLogin;
