import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Check, CheckCircle2, Copy, Linkedin, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { profile } from '../../data/profile'
import { isSupabaseConfigured, submitContactMessage } from '../../lib/supabase'
import { SectionHeader } from '../ui/MetricCard'
import { Avatar } from '../ui/Avatar'

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') ?? '')
    const email = String(data.get('email') ?? '')
    const message = String(data.get('message') ?? '')

    if (!isSupabaseConfigured) {
      setSubmitStatus('error')
      setErrorMessage('Message service is not configured yet. Please use email or LinkedIn to connect.')
      return
    }

    setSubmitStatus('loading')
    setErrorMessage('')

    try {
      await submitContactMessage({
        name,
        email: email || undefined,
        message,
      })
      setSubmitStatus('success')
      form.reset()
    } catch (err) {
      setSubmitStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to send message. Please try again.',
      )
    }
  }

  const contactItems = [
    {
      id: 'email',
      label: 'Email',
      value: profile.personal.email,
      icon: Mail,
      href: `mailto:${profile.personal.email}`,
      action: 'copy',
    },
    {
      id: 'phone',
      label: 'Phone',
      value: profile.personal.phone,
      icon: Phone,
      href: `tel:${profile.personal.phone.replace(/\s/g, '')}`,
      action: 'copy',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: 'Connect on LinkedIn',
      icon: Linkedin,
      href: profile.personal.linkedin,
      action: 'link',
    },
    {
      id: 'location',
      label: 'Location',
      value: profile.personal.location,
      icon: MapPin,
      action: 'none',
    },
  ]

  return (
    <section id="contact" className="scroll-mt-4 mt-10 mb-8">
      <SectionHeader
        title="Contact & Connect"
        subtitle="Get in touch for collaborations and opportunities"
        icon={<Send className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-xl p-6 border border-obs-border glow-cyan"
        >
          <div className="flex items-center gap-4 mb-6">
            <Avatar size="lg" />
            <div>
              <h3 className="text-lg font-semibold text-obs-text">
                {profile.personal.fullName}
              </h3>
              <p className="text-sm text-obs-muted">{profile.personal.headline}</p>
            </div>
          </div>

          <div className="space-y-3">
            {contactItems.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-obs-surface/50 border border-obs-border hover:border-obs-cyan/30 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-obs-cyan/10 text-obs-cyan shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-obs-muted">{item.label}</p>
                      {item.href && item.action === 'link' ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-obs-cyan hover:underline truncate block"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-obs-text truncate">{item.value}</p>
                      )}
                    </div>
                  </div>

                  {item.action === 'copy' && (
                    <button
                      onClick={() => copyToClipboard(item.value, item.id)}
                      className="p-2 rounded-lg text-obs-muted hover:text-obs-cyan hover:bg-obs-cyan/10 transition-colors shrink-0"
                      aria-label={`Copy ${item.label}`}
                    >
                      {copied === item.id ? (
                        <Check className="w-4 h-4 text-obs-teal" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6 border border-obs-border flex flex-col"
        >
          <h3 className="text-sm font-semibold mb-1">Quick Message</h3>
          <p className="text-xs text-obs-muted mb-4">
            Messages are saved securely to the database and delivered to Saif.
          </p>

          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-obs-teal/10 border border-obs-teal/30 text-obs-teal text-sm"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Message sent successfully! I&apos;ll get back to you soon.</span>
            </motion.div>
          )}

          {submitStatus === 'error' && errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-obs-rose/10 border border-obs-rose/30 text-obs-rose text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
            <input
              name="name"
              required
              minLength={2}
              disabled={submitStatus === 'loading'}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg bg-obs-surface border border-obs-border text-obs-text text-sm placeholder:text-obs-muted focus:outline-none focus:border-obs-cyan/50 transition-colors disabled:opacity-60"
            />
            <input
              name="email"
              type="email"
              disabled={submitStatus === 'loading'}
              placeholder="Your email (optional)"
              className="w-full px-4 py-3 rounded-lg bg-obs-surface border border-obs-border text-obs-text text-sm placeholder:text-obs-muted focus:outline-none focus:border-obs-cyan/50 transition-colors disabled:opacity-60"
            />
            <textarea
              name="message"
              required
              minLength={10}
              rows={5}
              disabled={submitStatus === 'loading'}
              placeholder="Your message..."
              className="w-full px-4 py-3 rounded-lg bg-obs-surface border border-obs-border text-obs-text text-sm placeholder:text-obs-muted focus:outline-none focus:border-obs-cyan/50 transition-colors resize-none flex-1 disabled:opacity-60"
            />
            <motion.button
              whileHover={submitStatus !== 'loading' ? { scale: 1.02 } : undefined}
              whileTap={submitStatus !== 'loading' ? { scale: 0.98 } : undefined}
              type="submit"
              disabled={submitStatus === 'loading'}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-obs-cyan to-obs-teal text-obs-bg font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitStatus === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-10 pt-6 border-t border-obs-border text-center"
      >
        <p className="text-xs text-obs-muted font-mono">
          © {new Date().getFullYear()} {profile.personal.fullName} · Observability Dashboard Portfolio
        </p>
      </motion.footer>
    </section>
  )
}
