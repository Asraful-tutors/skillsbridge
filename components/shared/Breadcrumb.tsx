'use client'

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Breadcrumb() {
  const path = usePathname();
  const pathSegments = path.split('/').filter((segment) => segment !== '');

  const crumbs = pathSegments.map((segment, index) => {
    const isLast = index === pathSegments.length - 1;
    const link = `/${pathSegments.slice(0, index + 1).join('/')}`;

    return {
      title: segment,
      link: isLast ? undefined : link,
    };
  });

  const capitalizeTitle = (title: string) => {
    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  return (
    <motion.div className='w-full text-black max-w-screen-2xl h-full rounded-2xl mx-auto mt-[43px]'>
      <nav>
        <ul className='flex flex-row'>
          {crumbs.map((crumb, index) => (
            <li key={index}>
              {crumb.link ? (
                <Link href={crumb.link} className='text-[#4F6181] text-sm'>
                  {capitalizeTitle(crumb.title)}
                </Link>
              ) : (
                <span className='text-sm'>{capitalizeTitle(crumb.title)}</span>
              )}
              {index < crumbs.length - 1 && <span className='text-sm'>&nbsp;&nbsp;/&nbsp;&nbsp;</span>}
            </li>
          ))}
        </ul>
      </nav>
    </motion.div>
  );
};
