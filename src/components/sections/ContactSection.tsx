import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react'
import { profile } from '../../data/profile'
import { SectionHeader } from '../ui/MetricCard'

export function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
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
          <h3 className="text-lg font-semibold text-obs-text mb-1">
            {profile.personal.fullName}
          </h3>
          <p className="text-sm text-obs-muted mb-6">{profile.personal.headline}</p>

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
          <h3 className="text-sm font-semibold mb-4">Quick Message</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const form = e.target as HTMLFormElement
              const data = new FormData(form)
              const subject = encodeURIComponent('Portfolio Inquiry')
              const body = encodeURIComponent(
                `Hi Saif,\n\n${data.get('message')}\n\n— ${data.get('name')}`,
              )
              window.location.href = `mailto:${profile.personal.email}?subject=${subject}&body=${body}`
            }}
            className="flex flex-col gap-4 flex-1"
          >
            <input
              name="name"
              required
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-lg bg-obs-surface border border-obs-border text-obs-text text-sm placeholder:text-obs-muted focus:outline-none focus:border-obs-cyan/50 transition-colors"
            />
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Your message..."
              className="w-full px-4 py-3 rounded-lg bg-obs-surface border border-obs-border text-obs-text text-sm placeholder:text-obs-muted focus:outline-none focus:border-obs-cyan/50 transition-colors resize-none flex-1"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-obs-cyan to-obs-teal text-obs-bg font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
              Send via Email
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
