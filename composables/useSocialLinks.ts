export default function useSocialLinks() {
  const sidebarLinks = [
    {
      label: 'Home',
      to: '/',
      alt: 'Home',
    },
    {
      label: 'Azure Meetup',
      icon: 'i-simple-icons-meetup',
      to: 'https://www.meetup.com/azure-meetup-hamburg',
      target: '_blank',
      alt: 'Azure Meetup Hamburg',
    },
    {
      label: 'Discord',
      icon: 'i-simple-icons-discord',
      to: 'https://discord.gg/QakdtpQW',
      target: '_blank',
      alt: 'Discord invitation',
    },
    {
      label: 'IT Insights GitHub',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/it-insights',
      target: '_blank',
      alt: 'IT Insights GitHub',
    },
    {
      icon: 'i-heroicons-user-group',
      label: 'IT Insights Talks',
      to: 'https://github.com/it-insights/Talks',
      alt: 'IT Insights Talks Repository',
    },
    {
      alt: 'Azure Blog',
      label: 'Azure Blog',
      icon: 'i-simple-icons-microsoftazure',
      to: 'https://azure.microsoft.com/en-us/blog/',
      target: '_blank',
    },
  ]

  return {
    sidebarLinks,
  }
}
