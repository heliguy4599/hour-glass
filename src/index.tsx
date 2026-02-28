/* @refresh reload */
import { render } from "solid-js/web"
import { App } from "./app.tsx"

const root = document.getElementById("root")

render(() => <App.new />, root!)
