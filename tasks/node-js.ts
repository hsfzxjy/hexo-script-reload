import gulp from "gulp"
import { createGulpEsbuild, Options as GulpEsbuildOptions } from "gulp-esbuild"

import { BuildAndWatchTasks, namedTask, Options, resolveOptions } from "./util"

type NodeJsOptions = Options<GulpEsbuildOptions>

function esbuildTask(
  options: NodeJsOptions,
  watchMode: boolean
): gulp.TaskFunction {
  return () =>
    gulp
      .src(options.entryPoints)
      .pipe(
        createGulpEsbuild({ incremental: watchMode })({
          sourcemap: true,
          bundle: true,
          platform: "node",
          ...options.extra,
        })
      )
      .pipe(gulp.dest(options.outDir))
}

export default function (options: NodeJsOptions): BuildAndWatchTasks {
  options = resolveOptions(options)
  return [
    namedTask("build:node", esbuildTask(options, false)),
    namedTask("watch:node", () =>
      gulp.watch(
        options.watchGlob,
        { ignoreInitial: false },
        namedTask("watch:node:once", esbuildTask(options, true))
      )
    ),
  ]
}
