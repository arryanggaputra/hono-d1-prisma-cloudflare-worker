import { Hono } from "hono";
import { Bindings } from "~/types";

const App = new Hono<{ Bindings: Bindings }>();
export default App;
