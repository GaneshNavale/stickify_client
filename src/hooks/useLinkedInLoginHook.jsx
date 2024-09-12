import { useLinkedIn } from "react-linkedin-login-oauth2";
import * as API from "../utils/api";
import { useAuth } from "./useAuth";

export const useLinkedInLoginHook = (
  redirectUri,
  handleBackdropClose,
  handleBackdropOpen,
  onSuccess,
  onError
) => {
  const { login } = useAuth();
  const { linkedInLogin } = useLinkedIn({
    clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
    redirectUri: redirectUri,
    onSuccess: async (code) => {
      try {
        handleBackdropOpen();
        const response = await API.linkedinLogin({
          code,
          redirect_uri: redirectUri,
        });

        if (onSuccess) {
          const userInfo = {
            token: response.headers?.authorization,
            ...response.data?.user,
          };
          console.log("response.headers", response.headers);
          login(userInfo);

          handleBackdropClose();
          onSuccess(userInfo);
        }
      } catch (error) {
        console.error("Error exchanging authorization code: ", error);
        if (onError) onError(error);
      }
    },
    scope: "openid email profile",
    onError: (error) => {
      console.log(error);
      if (onError) onError(error);
    },
  });

  return { linkedInLogin };
};
