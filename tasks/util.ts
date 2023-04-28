import gulp from "gulp"
import * as p from "path"

export type Options<ExtraOptions> = {
  entryPoints: string[]
  outDir: string
  watchGlob: gulp.Globs
  extra?: ExtraOptions
}

export type BuildAndWatchTasks = [
  buildTask: gulp.TaskFunction,
  watchTask: gulp.TaskFunction
]

const ROOT_DIR = p.resolve(__dirname, "..")

export function resolve(path: string): string {
  if (p.isAbsolute(path)) return path
  return p.resolve(ROOT_DIR, path)
}

export function resolveOptions<T>(options: Options<T>): Options<T> {
  return {
    entryPoints: options.entryPoints.map(resolve),
    outDir: resolve(options.outDir),
    watchGlob:
      typeof options.watchGlob === "string"
        ? resolve(options.watchGlob)
        : options.watchGlob.map(resolve),
    extra: options.extra,
  }
}

export function namedTask<T>(name: string, task: T & { displayName?: string }) {
  task.displayName = name
  return task
}
