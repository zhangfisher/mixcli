import { useData,withBase  } from "vitepress"
export const EXTERNAL_URL_RE = /^[a-z]+:/i
export function isExternal(path: string): boolean {
    return EXTERNAL_URL_RE.test(path)
}

  
export function normalizeLink(url: string): string {
    if (isExternal(url)) return url
  
    const { site } = useData()
    const { pathname, search, hash } = new URL(url, 'http://a.com')
  
    const normalizedPath =
      pathname.endsWith('/') || pathname.endsWith('.html')
        ? url
        : url.replace(
            /(?:(^\.+)\/)?.*$/,
            `$1${pathname.replace(
              /(\.md)?$/,
              site.value.cleanUrls ? '' : '.html'
            )}${search}${hash}`
          )
  
    return withBase(normalizedPath)
  }