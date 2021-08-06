const PORT = 80;

const express = require("express");
const Cookies = require("cookies");

const app = express();

app.use(express.json());
app.use(Cookies.express());

const api = express.Router();

const v1 = express.Router();

v1.post("/auth/getuserdatafromgithubtoken", (req, res) => {
	if (!req.body || !req.body.token) res.status(6969).send("Buzz orf");
	res.json({ a: "E" });
});

api.use("/v1", v1);

app.use("/api", api);

app.listen(PORT, () => console.info(`🚀 Server listening on port ${PORT}!`));
