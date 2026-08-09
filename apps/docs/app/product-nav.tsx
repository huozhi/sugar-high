import Link from 'next/link'

type Product = 'theme' | 'react' | 'remark'

const links: { href: `/${Product}`; label: string; id: Product }[] = [
  { href: '/theme', label: 'Themes', id: 'theme' },
  { href: '/react', label: 'React', id: 'react' },
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
      {showBrand && <Link className="product-nav__brand" href="/">Sugar High</Link>}
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
        <a className="product-nav__source" href={source}>Source ↗</a>
      </div>
    </nav>
  )
}
