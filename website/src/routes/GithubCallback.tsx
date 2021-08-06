import { Alert, AlertTitle, Box, Button, Typography } from "@material-ui/core";
import { Redirect, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

import { useUser } from "../hooks";

export function GithubCallback() {
	const { signIn } = useUser();
	const [success, setSuccess] = useState<null | boolean>(null);
	const [output, setOutput] = useState(
		<Typography>Validating data...</Typography>
	);
	const [errorMessage, setErrorMessage] = useState<null | string>(null);

	const history = useHistory();

	const params = new URL(window.location.href).searchParams;
	const code = params.get("code");
	const state = params.get("state");
	const error = params.get("error");

	useEffect(() => {
		setErrorMessage(null);
		let message;
		// Make sure state exists
		if (!state || state.length === 0) {
			message = (
				<Alert severity="error">
					<AlertTitle>No state provided!</AlertTitle>
					Please try again.
				</Alert>
			);
			setSuccess(false);
			// Make sure that the state matches
		} else if (state !== localStorage.getItem("oauth-state")) {
			message = (
				<Alert severity="error">
					<AlertTitle>You may have been clickjacked!</AlertTitle>
					The state does not match. Please try again.
				</Alert>
			);
			setSuccess(false);
			// If they did not authorise us
		} else if (error) {
			message = (
				<Alert severity="warning">
					<AlertTitle>
						{error === "access_denied"
							? "You denined us access to your account"
							: `Unknown error: ${error}`}
					</AlertTitle>
					{error === "access_denied"
						? "Please try again and allow us this time."
						: "Please try again."}
				</Alert>
			);
			setSuccess(false);
			// If there is no code
		} else if (!code || code.length === 0) {
			message = (
				<Alert severity="error">
					<AlertTitle>No code provided!</AlertTitle>
					Please try again.
				</Alert>
			);
			setSuccess(false);
		} else {
			message = (
				<Alert severity="success">
					<AlertTitle>Signed in with Spotify!</AlertTitle>
					You will be redirected in a moment.
				</Alert>
			);

			try {
				localStorage.setItem("updoot-token", code);
				signIn();
				setSuccess(true);
			} catch {
				setErrorMessage("NOT_OK");
				setSuccess(false);
			}
		}
		setOutput(message);
	}, [code, error, signIn, state]);

	return (
		<Box sx={{ width: "100%", flexGrow: 1, pt: 3 }}>
			{errorMessage ? (
				<Alert severity="error">
					<AlertTitle>
						{errorMessage === "HTTP"
							? "An error occurred when connecting to our servers."
							: "An unknown error occurred."}
					</AlertTitle>
					{errorMessage === "HTTP"
						? "We connected to spotify, but were unable to connect to our servers to authorise you. Please try again later."
						: "But don't worry! It's been automatically reported to us, and we're working on a fix as you read this. Please try again later."}
				</Alert>
			) : (
				<>
					{output}
					{success && <Redirect to="/" />}
					{success === false && (
						<Button
							disabled={localStorage["epic"]}
							sx={{ mt: 2 }}
							variant="contained"
							onClick={() => {
								history.push("/");
							}}
						>
							Go to login page
						</Button>
					)}
				</>
			)}
		</Box>
	);
}
