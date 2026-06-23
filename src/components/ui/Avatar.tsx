import { profile } from '../../data/profile'

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  ring?: boolean
}

const sizeMap = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
  xl: 'w-28 h-28',
}

export function Avatar({ size = 'sm', className = '', ring = true }: AvatarProps) {
  const src = `${import.meta.env.BASE_URL}${profile.personal.avatar}`

  return (
    <img
      src={src}
      alt={profile.personal.fullName}
      className={`${sizeMap[size]} rounded-xl object-cover shrink-0 ${
        ring ? 'ring-2 ring-obs-cyan/40 ring-offset-2 ring-offset-obs-surface' : ''
      } ${className}`}
    />
  )
}
