import { useState } from "react";

interface User {
	username: string;
	avatarURL: string;
	id: string;
}

const githubOAuthURL = new URL("https://github.com/login/oauth/authorize");
githubOAuthURL.searchParams.append("client_id", "8d782ff49f1e284d281c");
process.env.NODE_ENV === "development" &&
	githubOAuthURL.searchParams.append(
		"redirect_uri",
		"http://localhost:30*00/github-callback"
	);
githubOAuthURL.searchParams.append("scope", "read:user user:email");

export function useUser() {
	const [user, setUser] = useState<null | (User & { token: string })>(null);

	async function signIn() {
		try {
			let token = localStorage.getItem("updoot-token");
			if (!token) {
				const state = crypto
					.getRandomValues(new Int32Array(50))
					.toString()
					.replaceAll(",", "")
					.replaceAll("-", "");
				localStorage.setItem("oauth-state", state);
				githubOAuthURL.searchParams.append("state", state);
				window.location.href = githubOAuthURL.toString();
			} else {
				const res = await fetch(
					"/api/v1/auth/getuserdatafromgithubtoken",
					{
						body: JSON.stringify({ token }),
					}
				);
				const data = (await res.json()) as User;
				setUser({ ...data, token: token });
				localStorage.setItem("updoot-token", token);
			}
		} catch {
			return false;
		}
		return true;
	}

	function signOut() {
		localStorage.removeItem("updoot-token");
		setUser(null);
	}

	return { signOut, signIn, user, setUser };
}
