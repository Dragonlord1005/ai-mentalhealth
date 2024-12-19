import type { QwikIntrinsicElements } from '@builder.io/qwik'

export function MdiMoonFull(props: QwikIntrinsicElements['svg'], key: string) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props} key={key}><path fill="currentColor" d="M12 2A10 10 0 1 1 2 12A10 10 0 0 1 12 2"></path></svg>
    )
  }