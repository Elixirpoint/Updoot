import { Button } from "@material-ui/core";
import { useUser } from "../hooks";

export function LoginPage() {
	const { signIn } = useUser();
	return (
		<Button onClick={signIn} variant="contained">
			Sign in with GitHub
		</Button>
	);
}
