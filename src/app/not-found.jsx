import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <Link href="/" className="mb-10 block">
        <Image
          src="/logo.jpeg"
          alt="Kavan The Brand"
          width={120}
          height={60}
          className="object-contain mx-auto"
          priority
        />
      </Link>

      <p className="text-7xl font-light text-primary font-playfair mb-4">404</p>
      <h1 className="text-2xl font-playfair text-primary-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-primary-600 font-poppins max-w-md mb-10">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you
        back to something beautiful.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/shop"
          className="bg-primary text-white px-8 py-3 rounded-lg font-poppins hover:bg-primary/90 transition-colors"
        >
          Browse the Shop
        </Link>
        <Link
          href="/"
          className="border border-primary text-primary px-8 py-3 rounded-lg font-poppins hover:bg-primary/5 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
