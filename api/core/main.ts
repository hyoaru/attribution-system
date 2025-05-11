import { createApp } from "./src/index";

const app = createApp();

app.listen(8003, () => {
  console.log("Server is running on port 8003");
});
