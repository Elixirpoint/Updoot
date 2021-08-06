import { Button } from "@material-ui/core";
import { useUser } from "../hooks";

export function Dashboard() {
	const { signOut } = useUser();
	return (
		<Button onClick={signOut} variant="contained">
			Sign out
		</Button>
	);
}
