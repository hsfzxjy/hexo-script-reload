import gulp from "gulp"
import { rimraf } from "rimraf"

import createNodeJs from "./tasks/node-js"
import { resolve } from "./tasks/util"
import createWebCss from "./tasks/web-css"
import createWebJs from "./tasks/web-js"

export const [buildJs, watchJs] = createWebJs({
  entryPoints: ["web/js/index.ts"],
  outDir: "dist/web/js",
  watchGlob: "web/js/**/*.ts",
})

export const [buildCss, watchCss] = createWebCss({
  entryPoints: ["web/css/main.scss"],
  outDir: "dist/web/css",
  watchGlob: "web/css/**/*.scss",
})

export const [buildNode, watchNode] = createNodeJs({
  entryPoints: ["lib/index.ts"],
  outDir: "dist/node",
  watchGlob: "lib/**/*.ts",
})

export const build = gulp.parallel(buildJs, buildCss, buildNode)
export const watch = gulp.parallel(watchJs, watchCss, watchNode)
export const clean = () => rimraf(resolve("dist"))
