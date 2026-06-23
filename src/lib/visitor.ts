import { getClient, isSupabaseConfigured } from './supabase'

const VISITOR_SESSION_KEY = 'portfolio_visitor_session'
const VISIT_LOGGED_KEY = 'portfolio_visit_logged'
const RETURNING_KEY = 'portfolio_returning'

export function getOrCreateVisitorSessionId(): string {
  let sessionId = sessionStorage.getItem(VISITOR_SESSION_KEY)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem(VISITOR_SESSION_KEY, sessionId)
  }
  return sessionId
}

function collectSessionData() {
  return {
    hash: window.location.hash || '#/',
    href: window.location.href,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? null,
    hardwareConcurrency: navigator.hardwareConcurrency ?? null,
    sessionStartedAt: sessionStorage.getItem(VISITOR_SESSION_KEY + '_started') ?? new Date().toISOString(),
  }
}

export async function trackPortfolioVisit(): Promise<void> {
  if (!isSupabaseConfigured) return
  if (sessionStorage.getItem(VISIT_LOGGED_KEY)) return

  const isReturnVisitor = localStorage.getItem(RETURNING_KEY) === '1'
  if (!isReturnVisitor) {
    localStorage.setItem(RETURNING_KEY, '1')
  }

  const sessionId = getOrCreateVisitorSessionId()
  if (!sessionStorage.getItem(VISITOR_SESSION_KEY + '_started')) {
    sessionStorage.setItem(VISITOR_SESSION_KEY + '_started', new Date().toISOString())
  }

  try {
    const supabase = getClient()
    const { error } = await supabase.rpc('log_visitor_visit', {
      p_session_id: sessionId,
      p_page_path: window.location.pathname + (window.location.hash || '#/'),
      p_referrer: document.referrer || null,
      p_user_agent: navigator.userAgent,
      p_language: navigator.language,
      p_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      p_screen_width: window.screen.width,
      p_screen_height: window.screen.height,
      p_is_return_visitor: isReturnVisitor,
      p_session_data: collectSessionData(),
    })

    if (!error) {
      sessionStorage.setItem(VISIT_LOGGED_KEY, '1')
    }
  } catch {
    // Silent fail — visitor tracking must not block the portfolio
  }
}
