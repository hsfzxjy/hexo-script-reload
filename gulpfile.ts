import gulp from "gulp"
import { rimraf } from "rimraf"

import createNodeJs from "./tasks/node-js"
import { resolve } from "./tasks/util"

export const [buildNode, watchNode] = createNodeJs({
  entryPoints: ["lib/index.ts"],
  outDir: "dist/node",
  watchGlob: "lib/**/*.ts",
})

export const build = gulp.parallel(buildNode)
export const watch = gulp.parallel(watchNode)
export const clean = () => rimraf(resolve("dist"))
