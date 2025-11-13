import React from "react";

interface GoogleLoginBtnProps {
  client_id?: string;
  redirect_uri?: string;
  scopeParam?: string;
  className?: string;
  children: React.ReactNode;
}

const client_id_env = import.meta.env.VITE_APP_PUBLIC_GOOGLE_CLIENT_ID;
const redirect_uri_env = import.meta.env.VITE_APP_PUBLIC_GOOGLE_REDIRECT_URI;

/**
 * Google OAuth2 로그인 버튼 컴포넌트
 *
 * 구글 인증 페이지(`https://accounts.google.com/o/oauth2/v2/auth`)로
 * 리다이렉트 시켜주는 버튼입니다.
 *
 * @param client_id GOOGLE CLIENT ID (Google Cloud Console에서 발급)
 * @param redirect_uri 로그인 후 리다이렉트될 URI (Google OAuth 설정에 등록 필요)
 * @param scopeParam 요청할 권한 스코프 (예: "openid email profile")
 * @param className 버튼에 적용할 CSS 클래스
 * @param children 버튼 안에 표시할 내용 (텍스트/아이콘 등)
 *
 * @example
 * <GoogleLoginBtn
 *   client_id="구글클라이언트ID"
 *   redirect_uri="http://localhost:3000/google"
 *   scopeParam="openid email profile"
 *   className="bg-red-500 text-white px-4 py-2 rounded"
 * >
 *   구글로 로그인
 * </GoogleLoginBtn>
 */
const GoogleLoginBtn = ({
  client_id = client_id_env,
  redirect_uri = redirect_uri_env,
  scopeParam = "openid email profile",
  className,
  children,
}: GoogleLoginBtnProps) => {
  const googleAuth = () => {
    const scopeQuery = scopeParam
      ? `&scope=${encodeURIComponent(scopeParam)}`
      : "";
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${encodeURIComponent(
      redirect_uri,
    )}&response_type=code&access_type=offline${scopeQuery}`;
  };

  return (
    <button className={className} onClick={googleAuth}>
      {children}
    </button>
  );
};

export default GoogleLoginBtn;
