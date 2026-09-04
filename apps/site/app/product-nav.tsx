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
        <a className="product-nav__source" href={source}>GitHub ↗</a>
      </div>
    </nav>
  )
}
