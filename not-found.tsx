import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">পেজটি পাওয়া যায়নি</h1>
      <p className="text-muted-foreground">আপনি যে প্রশ্নপত্রটি খুঁজছেন সেটি সরানো হয়েছে বা নেই।</p>
      <Link
        href="/"
        className="mt-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90"
      >
        হোমে ফিরে যান
      </Link>
    </div>
  )
}
