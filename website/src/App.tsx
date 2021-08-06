import { Dashboard, GithubCallback, LoginPage } from "./routes";
import {
	Route,
	BrowserRouter as Router,
	Switch as RouterSwitch,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@material-ui/core";

import { useUser } from "./hooks";

const theme = createTheme({
	palette: {
		primary: { main: "#ffeeee" },
	},
});

function App() {
	const { user } = useUser();

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<RouterSwitch>
					<Route path="/github-callback">
						<GithubCallback />
					</Route>
					<Route path="/">
						{user ? <Dashboard /> : <LoginPage />}
					</Route>
				</RouterSwitch>
			</Router>
		</ThemeProvider>
	);
}

export default App;
