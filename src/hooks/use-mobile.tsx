import * as React from "react"

const MOBILE_BREAKPOINT = 768

const getIsMobile = () => {
  if (typeof window === "undefined") {
    return false
  }
  return window.innerWidth < MOBILE_BREAKPOINT
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const onResize = () => {
      setIsMobile(getIsMobile())
    }

    window.addEventListener("resize", onResize)

    // Set initial value
    onResize()

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return isMobile
}
