import Dashboard from '@/components/pages/Dashboard';
import Applications from '@/components/pages/Applications';
import ApplicationDetail from '@/components/pages/ApplicationDetail';
import Documents from '@/components/pages/Documents';
import Calendar from '@/components/pages/Calendar';
import Settings from '@/components/pages/Settings';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  applications: {
    id: 'applications',
    label: 'Applications',
    path: '/applications',
    icon: 'Briefcase',
    component: Applications
  },
  applicationDetail: {
    id: 'applicationDetail',
    label: 'Application Detail',
    path: '/applications/:id',
    icon: 'FileText',
    component: ApplicationDetail,
    hidden: true
  },
  documents: {
    id: 'documents',
    label: 'Documents',
    path: '/documents',
    icon: 'FileText',
    component: Documents
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar',
    path: '/calendar',
    icon: 'Calendar',
    component: Calendar
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes).filter(route => !route.hidden);
export default routes;