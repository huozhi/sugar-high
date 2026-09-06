import Link from 'next/link'
import Image from 'next/image'

type Product = 'theme' | 'react' | 'remark'

const links: { href: `/${Product}`; label: string; id: Product }[] = [
  { href: '/react', label: 'React', id: 'react' },
  { href: '/theme', label: 'Themes', id: 'theme' },
  { href: '/remark', label: 'Remark', id: 'remark' },
]

export function ProductNav({
  active,
  source,
  showBrand = true,
}: {
  active?: Product
  source: string
  showBrand?: boolean
}) {
  return (
    <nav className="product-nav" aria-label="Product navigation">
      {showBrand && (
        <Link className="product-nav__brand" href="/" aria-label="Sugar High home">
          <Image src="/icon-light.svg" alt="" width={36} height={36} />
        </Link>
      )}
      <div className="product-nav__links">
        {links.map(link => (
          <Link
            key={link.id}
            className={active === link.id ? 'product-nav__link--active' : undefined}
            href={link.href}
            aria-current={active === link.id ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
        <a className="product-nav__source" href={source} aria-label="View source on GitHub" title="GitHub">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>
        </a>
      </div>
    </nav>
  )
}
