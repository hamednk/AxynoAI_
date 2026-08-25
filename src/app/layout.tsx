type Props = { children: React.ReactNode };

/** Required root shell — html/body live in [locale]/layout for lang/dir */
export default function RootLayout({ children }: Props) {
  return children;
}
