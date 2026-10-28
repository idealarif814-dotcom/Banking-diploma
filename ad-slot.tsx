import { cn } from '@/lib/utils'

type AdFormat = 'banner' | 'rectangle'

const FORMAT_CLASSES: Record<AdFormat, string> = {
  banner: 'min-h-[100px] sm:min-h-[90px]',
  rectangle: 'min-h-[250px]',
}

// Reserves fixed space so a future ad script (e.g. AdSense) doesn't cause layout shift.
// Drop the ad network markup inside this container and keep the min-height.
export function AdSlot({
  slotId,
  format = 'banner',
  className,
}: {
  slotId: string
  format?: AdFormat
  className?: string
}) {
  return (
    <aside
      aria-label="বিজ্ঞাপন"
      data-ad-slot={slotId}
      className={cn(
        'flex w-full items-center justify-center rounded-xl border border-dashed bg-muted/50 text-xs text-muted-foreground',
        FORMAT_CLASSES[format],
        className,
      )}
    >
      <span>বিজ্ঞাপন</span>
    </aside>
  )
}
