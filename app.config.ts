export default defineAppConfig({
  authors: [
    {
      name: 'Jacob Meissner',
      picture: 'jacob-meissner.jpg',
      socials: {
        twitter: 'VisorianGmbh',
        linkedIn: 'jacob-meißner-3799b6134',
      },
      company: {
        name: 'Visorian GmbH',
        url: 'https://visorian.com',
        position: 'CEO',
      },
    },
    {
      name: 'Jan-Henrik Damaschke',
      picture: 'jan-henrik-damaschke.jpg',
      socials: {
        twitter: 'jandamaschke',
        linkedIn: 'jan-henrik-damaschke',
      },
      company: {
        name: 'Visorian GmbH',
        url: 'https://visorian.com',
        position: 'CTO',
      },
    },
    {
      name: 'Christoph Burmeister',
      picture: 'christoph-burmeister.jpg',
      socials: {
        twitter: 'chrburmeister',
        linkedIn: 'chrburmeister',
      },
      company: {
        name: 'b.Berlin Bytes GmbH',
        url: 'https://www.https://www.berlin-bytes.de/.com/',
        position: 'Principal Solutions Architect',
      },
    },
    {
      name: 'itinsights',
      picture: 'favit.png',
    },
    {
      name: 'Ingo Deissenroth',
      picture: 'favit.png',
    },
    {
      name: 'Frederik Junge',
      picture: 'favit.png',
    },
  ],
  ui: {
    primary: 'blue',
    gray: 'zinc',
    pagination: {
      wrapper: 'flex items-center justify-center -space-x-px',
    },
    header: {
      logo: 'items-center',
    },
    main: {
      wrapper: 'min-h-[calc(100vh-2*var(--header-height))]',
    },
    variables: {
      light: {
        background: '255 255 255',
        foreground: 'var(--color-gray-700)',
      },
      dark: {
        background: 'var(--color-gray-900)',
        foreground: 'var(--color-gray-200)',
      },
      header: {
        height: '4rem',
      },
    },
  },
})
