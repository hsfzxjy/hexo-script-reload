function removeRequireCache(name: string) {
  const toRemove = Object.keys(require.cache).filter((s) => s.match(name))
  toRemove.forEach((n) => delete require.cache[n])
}

function patchMethod(
  self: any,
  methodName: string,
  newMethod: (...args: any[]) => any
) {
  const oldMethod = self[methodName].bind(self)
  self[methodName] = newMethod(oldMethod)
}

type Hexo = any
type Context = {
  reload: () => Promise<void>
  removeCache: (pat: string) => void
}

export default function autoReload(
  hexo: Hexo,
  options: { dir: string; action: (ctx: Context) => any }[]
) {
  hexo.theme.options.ignored = /node_modules/
  const Box = hexo.theme.__proto__.__proto__.constructor
  const boxes: any[] = []
  for (const { dir, action } of options) {
    const box: any = new Box(hexo, dir)
    box.action = action
    box.processors = hexo.theme.processors
    boxes.push(box)
  }
  const ctx: Context = {
    reload: () =>
      Promise.all(
        hexo.model("Post").map((p: any) => {
          p.content = p._content
          return hexo.post.render(p.full_source, p).then(() => p.save())
        })
      ).then(() => hexo._watchBox()),
    removeCache: removeRequireCache,
  }
  patchMethod(hexo, "watch", function (oldWatch) {
    return async function () {
      // eslint-disable-next-line prefer-rest-params
      const args = arguments
      await Promise.all(boxes.map((box) => box.watch()))
      boxes.forEach((box) => {
        const action = debounce(() => box.action(ctx), 100)
        box.on("processAfter", action)
      })
      return oldWatch.apply(hexo, args)
    }
  })
  patchMethod(hexo, "unwatch", function (oldUnwatch) {
    return function () {
      // eslint-disable-next-line prefer-rest-params
      oldUnwatch.apply(hexo, arguments)
      boxes.forEach((box) => {
        if (box.isWatching()) box.unwatch()
      })
    }
  })
}

function debounce(func: (...args: any[]) => any, wait: number) {
  let timeout: NodeJS.Timeout
  return function (this: any, ...args: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(context, args)
    }, wait)
  }
}
