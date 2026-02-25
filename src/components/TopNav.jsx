import React from 'react';

const NAV_ITEMS = [
  { label: 'Pipelines SDK', href: '/' },
  { label: 'Hello World', href: '/hello-world' },
  { label: 'UTM Persistence', href: '/cio-utm-test.html' },
];

const TopNav = () => {
  const path = window.location.pathname;

  return (
    <nav className="top-nav" aria-label="Primary">
      <a href="/" className="top-nav-brand">
        CIO Toolbox
      </a>

      <div className="top-nav-links">
        {NAV_ITEMS.map((item) => {
          const isActive = path === item.href;

          return (
            <a
              key={item.href}
              href={item.href}
              className={`top-nav-link${isActive ? ' active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default TopNav;
