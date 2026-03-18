import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom'; // 1. Imported Link and useLocation

// 2. Updated routes and removed hardcoded 'current' status
const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Profile', href: '/profile' },
  { name: 'Market Today', href: '/market' },
  { name: 'Risk Prediction', href: '/predict' },
  { name: 'Procedural Docs', href: '/docs' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  const { token, balance, network } = useContext(AuthContext);
  const location = useLocation(); // 3. This reads the current URL so we know what to highlight

  // Capitalize network name
  const networkName = network ? network.charAt(0).toUpperCase() + network.slice(1) : '';

  return (
    <Disclosure as="nav" className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo + nav links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <h1 className="text-white font-extrabold font-mono ">YieldVoyager</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {navigation.map((item) => {
                const isCurrent = location.pathname === item.href; // Dynamically check if active
                return (
                  <Link
                    key={item.name}
                    to={item.href} // Swapped href to 'to' for React Router
                    aria-current={isCurrent ? 'page' : undefined}
                    className={classNames(
                      isCurrent ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium',
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right section: Wallet balance + network */}
          {token && (
            <div className="text-white text-sm font-mono">
              Balance: <span className="text-violet-400">{balance} ETH</span>
              {networkName && ` (${networkName})`}
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => {
            const isCurrent = location.pathname === item.href;
            return (
              <DisclosureButton
                key={item.name}
                as={Link} // Swapped 'a' to 'Link'
                to={item.href} // Swapped href to 'to'
                aria-current={isCurrent ? 'page' : undefined}
                className={classNames(
                  isCurrent ? 'bg-gray-950/50 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                  'block rounded-md px-3 py-2 text-base font-medium',
                )}
              >
                {item.name}
              </DisclosureButton>
            );
          })}

          {/* Mobile wallet balance */}
          {token && (
            <div className="text-white text-sm mt-2 px-3 py-2 border-t border-gray-700">
              Balance: <span className="text-violet-400">{balance} ETH</span>
              {networkName && ` (${networkName})`}
            </div>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
