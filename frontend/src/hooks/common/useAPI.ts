import { useMutation, useQuery, keepPreviousData } from "@tanstack/react-query";

// baseURL 설정
export const hostname = window.location.hostname;
export const baseURL =
  hostname === "localhost" || hostname === "127.0.0.1"
    ? "http://localhost:8000"
    : "";

/**
 * Refresh Token을 사용하여 세션을 갱신하는 훅
 *
 * 401 응답 시 `/api/auth/refresh_token`으로 요청을 보내
 * 세션을 연장합니다. 실패 시 에러를 던집니다.
 *
 * @returns refreshToken 실행 함수 (Promise<boolean>)
 *
 * @param url API endpoint
 * @example
 * const refreshToken = useRefreshToken();
 * try {
 *   await refreshToken();
 *   console.log("토큰 갱신 성공");
 * } catch (err) {
 *   console.error("세션 만료", err);
 * }
 */
export const useRefreshToken = (url: string = "api/auth/refresh_token") => {
  const refresh = async () => {
    const response = await fetch(`${baseURL}/${url}`, {
      method: "POST",
      credentials: "include",
    });

    // TODO: 로그인 안되어 있을 때 처리 
    if (response.status === 401) {
      // window.location.href ="/"
    }

    return true;
  };

  return refresh;
};

/**
 * React Query 기반 GET 요청 훅
 *
 * 자동으로 401 응답 시 refreshToken()을 호출하고,
 * 재시도까지 해주는 fetch 래퍼입니다.
 *
 * @template T 응답 데이터의 타입
 *
 * @param url API endpoint
 * @param key React Query의 queryKey (배열 형태, 직렬화 가능한 값만 가능)
 * @param enabled 쿼리 실행 여부 (기본값: true)
 * @param refresh_url refresh token 갱신 필요한 경우 API endpoint (기본값: "api/auth/refresh_token")
 * @param fallback refresh token 갱신 실패 시 돌아갈 url
 * @example
 * const { data, isLoading, error } = useGet<User[]>("/users", ["users"]);
 */
export const useGet = <T>(
  url: string,
  key: (string | number)[],
  enabled: boolean = true,
  refresh_url: string = "api/auth/refresh_token",
  fallback: string = "/",
) => {
  const refreshToken = useRefreshToken(refresh_url);

  return useQuery<T>({
    queryKey: key,
    enabled,
    queryFn: async () => {
      const makeRequest = async () => {
        return await fetch(`${baseURL}/${url}`, {
          credentials: "include",
        });
      };

      let response = await makeRequest();

      if (response.status === 401) {
        const ok = await refreshToken();
        if (!ok) {
          window.location.href = fallback;
          return;
        }
        response = await makeRequest();
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API 오류 ${response.status}: ${text}`);
      }
      const data = await response.json();
      return data;
    },
    placeholderData: keepPreviousData,
  });
};

/**
 * React Query 기반 POST 요청 훅
 *
 * 자동으로 401 응답 시 refreshToken()을 호출하고,
 * 재시도까지 해주는 fetch 래퍼입니다.
 *
 * @template TResponse 응답 데이터 타입
 * @template TRequest 요청 바디 타입 (object, FormData, void)
 * @template TError 에러 타입 (기본: { status?: number; message?: string })
 *
 * @param url API endpoint
 * @param fallback refresh token 갱신 실패 시 돌아갈 url
 * @param refresh_url refresh token 갱신 필요한 경우 API endpoint (기본값: "api/auth/refresh_token")
 *
 * @example
 * // JSON Body 요청
 * const createUser = usePost<UserResponse, { name: string; email: string }>("/users");
 * createUser.mutate({ name: "홍길동", email: "hong@example.com" });
 *
 * @example
 * // FormData 요청 (파일 업로드)
 * const uploadFile = usePost<{ url: string }, FormData>("/upload");
 * const fd = new FormData();
 * fd.append("file", fileInput.files[0]);
 * uploadFile.mutate(fd);
 *
 * @example
 * // 바디 없는 POST (예: 로그아웃)
 * const logout = usePost<void, void>("/auth/logout");
 * logout.mutate();
 */
export const usePost = <
  TRequest extends object | FormData | void,
  TResponse,
  TError = { status?: number; message?: string },
>(
  url: string,
  fallback: string = "/",
  refresh_url: string = "api/auth/refresh_token",
) => {
  const refreshToken = useRefreshToken(refresh_url);

  return useMutation<TResponse, TError, TRequest>({
    mutationFn: async (body: TRequest) => {
      // 헤더 조건부
      const headers: HeadersInit = {};
      let fetchBody: BodyInit;

      if (body instanceof FormData) {
        fetchBody = body;
        // FormData면 Content-Type 자동 설정 (headers에 아무것도 안 넣음)
      } else {
        fetchBody = JSON.stringify(body);
        headers["Content-Type"] = "application/json";
      }

      const makeRequest = async () => {
        return await fetch(`${baseURL}/${url}`, {
          method: "POST",
          headers,
          credentials: "include",
          body: fetchBody,
        });
      };

      let response = await makeRequest();

      if (response.status === 401) {
        const ok = await refreshToken();
        if (!ok) {
          window.location.href = fallback;
          throw new Error("세션 만료");
        }
        response = await makeRequest();
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = null;
        }
        throw {
          status: response.status,
          message: errorData?.message || errorText || "Something went wrong",
        } as TError;
      }

      // 204, 205 등 No Content 응답일 경우 안전하게 처리
      if (response.status === 204 || response.status === 205) {
        return null as unknown as TResponse;
      }

      return (await response.json()) as TResponse;
    },
  });
};
